const request = require("request"),
	config = require("config"),
	apiClient = require("./apiClient")

const UI = require("../ui")
const CommandHandler = require("../lib/commandHandler")


let API = config.get("api")
module.exports = {

	handle: function(gamestate, text, cb) {
		let gameId = "5c69f269ed1b636ad4e1d274"
		//let playername = "CLI"
		//let apikey = apikey //"36ba4a80-5b3a-11e9-9601-e148fd700cb6"
		apiClient.joinGame(gamestate.APIKEY, gamestate.gameID, gamestate.playername, (err, resp, body) => {
			UI.loadScreen('main-ui', (err, ) => {
				
			})
		})
		/*
		request.post(API.url + API.endpoints.games + "/" + gameId + "?apikey=" + apikey, { //joining game
			body: {
				playername: playername
			},
			json: true
		}, (err, resp, body) => {
			UI.loadScreen('main-ui', (err, ) => {
				
			})
		})
		*/
		
	}


}