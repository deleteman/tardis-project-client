const request = require("request"),
	config = require("config"),
	apiClient = require("./apiClient"),
	logger = require("../utils/logger")

const UI = require("../ui")
const CommandHandler = require("../lib/commandHandler")


module.exports = {

	handle: function(gamestate, gameID, cb) {
		apiClient.joinGame(gamestate, gameID, (err, gstate) => {
			if(err) {
				logger.error("There was an error joining the game: ")
				logger.error(err)
				return cb(err)
			} else {
				if(gstate.error){
					logger.error("There was an error joining the game (returned as part of the body): ")
					logger.error(gstate.msg)
					return cb({
						errcode: config.get('app.errors.useralreadythere.code'),
						msg: config.get('app.errors.useralreadythere.msg')
					})
				}
			}
			cb(err, gstate, gameID)
		})

	}


}