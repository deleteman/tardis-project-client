const config = require("config")
const request = require("request")
const uuidv1 = require('uuid/v1');
const logger = require("../utils/logger")


module.exports = {

	joinGame: function(gamestate, gameID, done) {
		let payload = {
			playername: gamestate.playername
		}
		if(typeof gameID == 'function') {
			done = gameID
			gameID = gamestate.gameID
		}

		request.post(config.get('api.url') + config.get('api.endpoints.games') + "/" + gameID + "?apikey=" + gamestate.APIKEY, { //send command
			body: payload,
			json: true
		}, (err, resp, body) => {
            done(err, body)
        })
	},
	
	registerApp: function(done) {
		let payload = {
			name: config.get('app.name') + uuidv1()
		}

		request.post("http://localhost:3000/clients", { //send command
			body: payload,
			json: true
		}, (err, resp, body) => {
            done(err, body)
        })
	},
    sendCommand: function(gamestate, command, done) {

    	try {
			request.post(config.get("api.url") + config.get("api.endpoints.games") + "/" + gamestate.gameID + "/" + gamestate.playername + "/commands?apikey=" + gamestate.APIKEY, { //send command
				body: {
					action: command
				},
				json: true
			}, function (err, resp, body) {
	            done(err, body)
	        })
		} catch (e) {
			logger.error(e)
			done(e)
		}


    }
}