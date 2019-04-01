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
let config = require('./config')

//Database connection
mongoose.connect(config.db, {useNewUrlParser: true}).catch((err) => {
    console.log(`Error starting database: ${err.stack}`)
})

//Initialize controller
let ticketController = require('./tickets/ticketController')
app.use(config.API_PREFIX, ticketController)

//Start server on defined port
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})
