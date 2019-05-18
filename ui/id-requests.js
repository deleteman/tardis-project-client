const blessed = require('node-blessed');
const logger = require("../utils/logger")
const config = require("config")

module.exports = {


	init: function(elements, UI) {
		this.elements = elements
		this.UI = UI
		this.id = "id-requests"
		this.setInput()
	},

	setInput: function() {
		
		let handler = require(this.elements["gameidbox"].meta.handlerPath)
		let input = this.elements["gameidbox"].obj

		input.focus()

		input.on('submit', (data) => {
			let command = input.getValue()
		  	logger.info("Game ID entered: ", command)	

		 	input.clearValue()
			handler.handle(this.UI.gamestate, command, (err, gstate, gameID) => {
		  		if(err) {
		  			logger.error("There was an error in the handler: ", err)
		  			if(err.errcode == config.get('app.errors.useralreadythere.code')) {
			  			logger.error("User is already in the party!")
		  				this.UI.setUpAlert(err.msg, () => {
				  			this.UI.loadScreen('main-options', (err ) => {
								if(err) this.UI.setUpAlert(err)	
					  		})		
		  				})	
		  				return this.UI.renderScreen()
		  			} else {
		  				this.UI.setUpAlert(err.msg)
		  			}
		  		}
		  		this.UI.gamestate.gameID = gameID
				this.UI.loadScreen('main-ui', (err ) => {
					if(err) this.UI.setUpAlert(err)	
			  	})
			})
		})
		 

		return input
	}
}