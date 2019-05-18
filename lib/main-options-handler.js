const request = require("request"),
	config = require("config"),
	apiClient = require("./apiClient")

let API = config.get("api")
module.exports = {

	joinGame: function(apikey, gameId, cb) {
		apiClient.joinGame(apikey, gameId, cb)
	},

	createNewGame: function(apikey, cb) {
		/*apiClient.createGame(apikey, (err, resp) => {
			if(err) return cb(err)
			if(resp.error) {
				switch(resp.errorCode) {
					case 400: //api key invalid, needs to request a new one
					break
				}
			}
		})*/
		request.post(API.url + API.endpoints.games + "?apikey=" + apikey, { //creating game
			body: {
				cartridgeid: config.get("app.game.cartdrigename")
			},
			json: true
		}, (err, resp, body) => {
			cb(null, body)	
		})
		
	}


}