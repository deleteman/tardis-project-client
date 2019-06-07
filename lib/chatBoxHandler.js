const chatServerClient = require("./chatClient")


module.exports = {
	


	handle: function(gamestate, done) {
        chatServerClient.connect2Room(gamestate, done)
	}


}