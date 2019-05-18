const apiClient = require("./apiClient"),
	config = require("config")


module.exports = {
	


	handle: function(gamestate, text, done) {
		apiClient.sendCommand(gamestate, text, (err, body) => {
			let commandResp = {}

			if(body.error) {
				commandResp.error = true
				if(body.errorCode) {
					try {
						commandResp.message = config.get("api.errorCodes." + body.errorCode)
					} catch (e) {
						commandResp.message = body.msg || config.get("api.unknownResponse")
					}
				} else {
					commandResp.message = body.msg
				}
			} else {
				if(body.message) {
					if(!Array.isArray(body.message) &&  typeof body.message == "object") {
						commandResp.message = body.message.message
					}

					if(Array.isArray(body.message)) {
						commandResp.message = body.message.filter( i => i ).map( m => m.message).join("\n")
					}
					
					if(typeof body.message == "string") {
						commandResp.message = body.message
					}

				}
				if(body.gamestate) {
					commandResp.currentRoom = body.gamestate.currentscene
				}
				if(body.inventory) {
					commandResp.inventory = body.inventory
				}
			}

			done(null, commandResp)
		})
	}


}