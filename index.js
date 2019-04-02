/**
 * @author Anbarasan Swaminathan
 * @email anbu.369@gmail.com
 *
 * @file Application entry point
 */
let mongoose = require('mongoose')
let express = require("express")
let app = express()

//Helpers
let config = require('./helpers/config')

//Switch db based on the environment
let db = ''
switch(process.env.NODE_ENV.replace(/\s/g, "")){
    case 'production':
        db = config.db_prod
        break
    case 'development':
        db = config.db_dev
        break
    case 'local':
        db = config.db_local
        break
    case 'test':
        db = config.db_test
        break
    default:
        db = config.db_local
}

//Database connection
mongoose.connect(db, {useNewUrlParser: true}).catch((err) => {
    console.log(`Error starting database: ${err.stack}`)
})

let dbConnection = mongoose.connection

//Initialize controller
let ticketController = require('./tickets/ticketController')
app.use(config.API_PREFIX, ticketController)

//Start server on defined port
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

module.exports = app
