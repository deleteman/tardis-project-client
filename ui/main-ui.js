const blessed = require('node-blessed');
const config = require("config")
const logger = require("../utils/logger")

module.exports = {


	init: function(elements, UI) {
		this.elements = elements
		this.UI = UI
		this.id = "main-ui"
		this.setInput()
	},

	parseResponse(respObj) {
		if(respObj.message) {
			return ["Response: " + respObj.message]
		}

		if(respObj.inventory) {
			logger.info(require("util").inspect(respObj.inventory))
			let inventory = respObj.inventory.bag.length > 0 ? respObj.inventory.bag.map( i => "-[" + i.name + "] " + (i.details || ' ') ).join("\n") : "nothing"
			let inYourHands = respObj.inventory && respObj.inventory.hands ? (respObj.inventory.hands.details || respObj.inventory.hands.name) : "nothing"
			return [ "------------ inventory -------------",
					"Inventory: \n" + inventory, 
					"In your hands: " + inYourHands,
					"------------------------------------"]
		}
		return []
	},

	setInput: function() {
		
		let handler = require(this.elements["commandbox"].meta.handlerPath)
		let input = this.elements["commandbox"].obj

		input.focus()

		input.on('submit', (data) => {
			let command = input.getValue()
		  	//this.gamebox.setContent(command)

		 	input.clearValue()
			input.focus()
			this.UI.renderScreen()
			
			handler.handle(this.UI.gamestate, command, (err, resp) => {
		  		if(err) {
		  			this.UI.setUpAlert(err)	
					this.UI.renderScreen()
				} else {
					logger.info(resp)
					let respMsgs = this.parseResponse(resp)
					let lines = []

					lines.push('> ' + command) //render the command sent
					lines = lines.concat(respMsgs) //render the response received

					this.elements["gamebox"].obj.insertBottom(lines)
					//this.UI.renderScreen()

					this.elements["gamebox"].obj.scroll((config.get("screens.main-ui.elements.gamebox.autoscrollspeed") * respMsgs.length )+ 1)
					this.UI.renderScreen()
				}
		  	})
		})
		 

		return input
	}
}
