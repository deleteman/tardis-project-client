const io = require('socket.io-client'),
    config = require("config"),
    logger = require("../utils/logger")


// Use https or wss in production.
let url = config.get("chatserver.url") //'ws://localhost:3000/'
let socket = io(url)


module.exports = {

    connect2Room: function(gamestate, done) {
        socket.on(config.get('chatserver.commands.SENDMSG'), msg => {
            done(null, {
                event: config.get('chatserver.commands.SENDMSG'),
                msg: msg
            })     
        })
        socket.emit(config.get("chatserver.commands.JOINROOM") , {
            roomname: gamestate.gameID,
            username: gamestate.playername
        }, _ => {
            logger.info("Room joined!")
            gamestate.inroom = true
            done(null, {
                event: config.get('chatserver.commands.JOINROOM')
            })
        })
        
    },

   handleCommand: function(command, gamestate, done) {
        logger.info("Sending command to chatserver!")
        

        //let userName = 'user' // for example and debug
        /*
        let userName = `user${Math.floor(Math.random() * 99) + 1}`
        let token = 'token' // auth token
        let query = `userName=${userName}&token=${token}`
        let opts = { query }
        */

        let message = command.split(" ").splice(1).join(" ")

        logger.info("Message to send: ", message)

        if(!gamestate.inroom) { //first time sending the message, so join the room first
            logger.info("Joining a room")
            let gameId = gamestate.game
            logger.info("Game property: ", gameId)
            logger.info("Room name: ", gamestate.gameID)
            logger.info("Username:", gamestate.playername)
            socket.emit(config.get("chatserver.commands.JOINROOM") , {
                roomname: gamestate.gameID,
                username: gamestate.playername
            }, _ => {
                logger.info("Room joined!")
                gamestate.inroom = true
                updateGameState = true

                logger.info("Updating game state ...")
                socket.emit(config.get("chatserver.commands.SENDMSG"), message, done)
            })
        } else {
            logger.info("Sending message to chat server: ", message  )
            socket.emit(config.get("chatserver.commands.SENDMSG"), message, done)
        }
            
    }
}