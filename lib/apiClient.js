const config = require("config")
const request = require("request")
const uuidv1 = require('uuid/v1');
const logger = require("../utils/logger")
const util = require("util")


module.exports = {

	joinGame: function(gamestate, done) {
		let payload = {
			playername: gamestate.playername
		}
        //let apikey = "36ba4a80-5b3a-11e9-9601-e148fd700cb6"

		request.post(config.get('api.url') + config.get('api.endpoints.games') + "/" + gamestate.gameID + "?apikey=" + gamestate.APIKEY, { //send command
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
        //let apikey = "36ba4a80-5b3a-11e9-9601-e148fd700cb6"

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