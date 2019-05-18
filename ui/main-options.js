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

	setInput: function() {
		
		let handler = require(this.elements["input"].meta.handlerPath)
		let input = this.elements["input"].obj
		let usernameRequest = this.elements['username-request'].obj
		let usernameRequestMeta = this.elements['username-request'].meta
		let question = usernameRequestMeta.params.content.trim()


		usernameRequest.setValue(question)

		this.UI.renderScreen()

 		this.UI.screen.program.disableMouse()

		usernameRequest.on('submit', (username) => {

			logger.info("Username:" +username)
			logger.info("Playername: " + username.replace(question, ''))
			this.UI.gamestate.playername = username.replace(question, '')

			input.focus()

			input.on('submit', (data) => {
				let command = input.getValue()
			  	//this.gamebox.setContent(command)

			  	if(command == "1") {
			  		return this.UI.loadScreen('id-requests', (err, ) => {
						
					})
			  	}

			  	if(command == "2") {
			  		handler.createNewGame(this.UI.gamestate.APIKEY, (err, gameData) => {
			  			logger.info("----------- game Data -------------")
			  			logger.info(gameData)
			  			logger.info("----------- /game Data -------------")

			  			this.UI.gamestate.gameID = gameData._id

			  			handler.joinGame(this.UI.gamestate, (err) => {
							return this.UI.loadScreen('main-ui', {
								flashmessage: "You've joined game " + this.UI.gamestate.gameID + " successfully"
							},  (err, ) => {
								
							})
			  			})
						
			  		})
			  		
			  	}
			})


		})

		
		 

		return input
	}
}