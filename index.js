const UI = require("./ui")
const mainHandler = require("./lib/appHandler")


mainHandler.registerApp( (err, resp) => {
	UI.init(resp.apikey)	
	UI.loadScreen('main-options', (err, ) => {
		
	})
})

/*
UI.setupGameBox()

UI.setupChatBox()

const cmdBox = UI.setupCommandBox(CommandHandler)

UI.renderScreen()

cmdBox.focus()



*/