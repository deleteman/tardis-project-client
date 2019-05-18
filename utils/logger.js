const winston = require("winston")
const config = require("config")

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: config.get("app.logging.outputfile"), level: 'debug' }),
  ]
});
 

module.exports = logger
