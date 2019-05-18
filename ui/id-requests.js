const blessed = require('node-blessed');
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
		  	

		 	input.clearValue()
			handler.handle(this.UI.gamestate, command, (err) => {
		  		if(err) {
		  			this.showMessage(err)	
		  		}
		  	})
		})
		 

		return input
	}
}