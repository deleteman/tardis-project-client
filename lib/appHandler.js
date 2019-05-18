const apiClient = require("./apiClient"),
	config = require("config")


module.exports = {
	


	registerApp: function(done) {
		apiClient.registerApp((err, body) => {
			let commandResp = {}

			if(body.error) {
				commandResp.error = true
				if(body.errorCode) {
					commandResp.message = config.get("api.errorCodes." + body.errorCode)
				} else {
					commandResp.message = body.msg
				}
			} else {
				if(body.apikey) {
					commandResp.apikey = body.apikey
				}
			}

			done(null, commandResp)
			//UI.updateGameBoxText(msg, (err, ) => {
				//
			//})
		})
	}


}