const blessed = require('node-blessed');
const config = require("config")
const logger = require("../utils/logger")

module.exports = {


	init: function(elements, UI) {
		this.elements = elements
		this.UI = UI
		this.id = "main-options"
		this.setInput()
	},

	moveToIDRequest: function() {
		return this.UI.loadScreen('id-requests', (err, ) => {
			
		})
	},

	createNewGame: function() {

		handler.createNewGame(this.UI.gamestate.APIKEY, (err, gameData) => {
  			this.UI.gamestate.gameID = gameData._id
  			handler.joinGame(this.UI.gamestate, (err) => {
				return this.UI.loadScreen('main-ui', {
					flashmessage: "You've joined game " + this.UI.gamestate.gameID + " successfully"
				},  (err, ) => {
					
				})
  			})
			
  		})
	},

	setInput: function() {
		
		let handler = require(this.elements["input"].meta.handlerPath)
		let input = this.elements["input"].obj
		let usernameRequest = this.elements['username-request'].obj
		let usernameRequestMeta = this.elements['username-request'].meta
		let question = usernameRequestMeta.params.content.trim()


		usernameRequest.setValue(question)

		this.UI.renderScreen()

 //		this.UI.screen.program.disableMouse()

 		let validOptions =  {
 			1: this.moveToIDRequest.bind(this),
 			2: this.createNewGame.bind(this)
 		}

		usernameRequest.on('submit', (username) => {

			logger.info("Username:" +username)
			logger.info("Playername: " + username.replace(question, ''))
			this.UI.gamestate.playername = username.replace(question, '')

			input.focus()



			input.on('submit', (data) => {
				let command = input.getValue()
			  	if(!validOptions[+command]) {
			  		this.UI.setUpAlert("Invalid option: " + command)
			  		return this.UI.renderScreen()
			  	}
			  	return validOptions[+command]()
			})


		})

		
		 

		return input
	}
}