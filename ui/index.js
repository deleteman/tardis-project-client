const blessed = require('node-blessed');
const config = require("config")

module.exports = {
	screenElements: [],
	screen: null,
	gamebox: null,
	chatbox: null,
	inputbox: null,
	firstRender: true,
	init: function(apikey) {
		// Create a screen object.
		const screen = blessed.screen({
		  fastCSR: true
		});
 
		screen.title = 'my window title';


		//[[TODO]] remove tihs part, exit sequence should be handled apart
		// Quit on Escape, q, or Control-C.
		screen.key(['escape', 'q', 'C-c'], function(ch, key) {
		  process.exit(0)
		});


		this.gamestate = {
			APIKEY: apikey
		}
		this.screen = screen

	},
	loadScreen: function(sname, extras, done) {
		if(typeof extras == "function") {
			done = extras
		}

		let screen = config.get('screens.' + sname)
		let screenElems = {}
		console.log(screen.elements, " elements found!")

		if(this.screenElements.length > 0) { //remove previous screen
			this.screenElements.map( e => e.detach())
			this.screen.realloc()
		}

		Object.keys(screen.elements).forEach( eName => {
			let elemObj = null
			let element = screen.elements[eName]
			//console.log(eName)
			//console.log(element)
			if(element.type == 'window') {
				elemObj = this.setUpWindow(element)
			}
			if(element.type == 'input') {
				elemObj = this.setUpInputBox(element)
			}

			if(element.type == 'input-prompt') {
				elemObj = this.setUpInputBox(element)
			}
			screenElems[eName] = {
				meta: element,
				obj: elemObj
			}
		})

		if(typeof extras === 'object' && extras.flashmessage) {
			this.setUpAlert(extras.flashmessage)	
		}


		this.renderScreen()
		let logicPath = require(screen.file)
		logicPath.init(screenElems, this)
		done()
	},


	setUpAlert: function(txt) {
		const box = blessed.message(
					 {
						"position": {
							"top": "35%",
							"left": "35%",
							"width": "30%",
							"height": "30%"
						},
						"content": txt,
						"border": {
						  "type": "line"
						},
						"mouse": false,
						"style": {
						  "fg": "white",
						  "bg": "blue",
						  "border": {
						      "fg": "#f0f0f0"
						  }
						}
					}
				);

		this.screenElements.push(box)
		this.screen.append(box)
 		this.screen.program.disableMouse()
 		setTimeout(() => {
 			box.destroy()
 			this.screen.program.enableMouse()
 		}, 2000)
		return box
	},

	setUpWindow: function(element) {
		const box = blessed.box(JSON.parse(JSON.stringify(element.params)));

		//scroll behavior
		box.on('wheelup', (elem) => {
			box.scroll(-1)
			this.renderScreen()
		})
		box.on('wheeldown', (elem) => {
			box.scroll(1)
			this.renderScreen()
		})


		this.screenElements.push(box)
		this.screen.append(box)
		return box
		//this.screenElements.push(box)
	},
	showMessage: function(msgObj) {
		const modal = blessed.message({
		  top: '25%',
		  left: '25%',
		  width: '50%',
		  height: '50%',
		  //tags: true,
		  inputOnFocus: true,
		  content: msgObj,
		  border: {
		    type: 'line'
		  },
		  style: {
		    fg: 'white',
		    bg: 'blue',
		    border: {
		      fg: '#f0f0f0'
		    },
		    hover: {
		      bg: 'green'
		    }
		  } 
		})

	},
	setUpPromptBox: function(element) {
		const input = blessed.prompt(JSON.parse(JSON.stringify(element.params)))
		
		this.screenElements.push(input)
		this.screen.append(input)
		return input
	},
	setUpInputBox: function(element) {
		const input = blessed.textbox(JSON.parse(JSON.stringify(element.params)))
		
		this.screenElements.push(input)
		this.screen.append(input)
		return input
	},
	renderScreen: function() {
		this.screen.render()
	}
}