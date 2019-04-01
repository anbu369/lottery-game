/**
 * @author Anbarasan Swaminathan
 * @email anbu.369@gmail.com
 *
 * @file Controller file to manage all the operations on a ticket
 */

let express = require('express')
let router = express.Router()
let bodyParser = require('body-parser')

//Helpers
let variables = require('../helpers/variables')
let config = require('../helpers/config')

//Models
let Ticket = require('./Ticket')

//Adding body-parser to express router
router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(bodyParser.json())

/**
 * POST /api/ticket?noOfLines=n
 * @description Creates a new ticket with n number of lines. {noOfLines} Number of lines is passed as query parameter.
 * If {noOfLines} Number of lines is not mentioned, it is defaulted to the {defaultNoOfLines} Default number of values
 * from config.js
 * @param req : Request received from the user - Contains number of lines as query parameter
 * @param res : Response sent to the user - Sends back the created ticket
 */
router.post('/ticket', function(req, res) {
    let noOfLines = req.query.noOfLines ? req.query.noOfLines : config.defaultNoOfLines

    //Create a new Ticket using the Ticket model
    let ticketItem = new Ticket({
        noOfLines: 0,
        statusChecked: false,
        lines: []
    })

    //Generate and add lines to the ticket
    let ticket = ticketItem.createLines(noOfLines)
    if(ticket){
        //Converting the ticket to object so _id of lines can be removed
        let ticketObject = ticket.toObject()

        //Removing _id property of each line object
        ticketObject.lines.forEach(function(line) {
            delete line._id
        })
        res.status(200).json({ticket: ticketObject})
    }else{
        res.status(500).send(variables.GENERAL_ERROR)
    }
})

/**
 * GET /api/ticket/
 * @description Returns all the tickets
 * @param req : Request received from the user
 * @param res : Response sent to the user - Sends back all the tickets as JSON
 */
router.get('/ticket', function(req, res) {
    Ticket.find({}, {lines: 0, __v: 0}).exec(function(err, tickets){
        if (err) return res.status(500).send(variables.DB_GET_ERROR + ' : ' + err.stack)
        res.status(200).json({tickets: tickets});
    })
})

/**
 * GET /api/ticket/:id
 * @description Function to return individual ticket based on the id received
 * @param req : Request received from the user - Contains _id of the ticket as parameter
 * @param res : Response sent to the user - Sends back the corresponding ticket with lines
 */
router.get('/ticket/:id', function(req, res) {
    let tID = req.params.id
    Ticket.findOne({_id: tID}, {__v: 0})
        .populate('lines', {_id: 0, __v: 0})
        .exec(function(err, ticket) {
            if (err) return res.status(500).send(variables.DB_GET_ERROR + ' : ' + err.stack)
            if (!ticket) return res.status(500).send(variables.DB_NO_DATA)

            res.status(200).json({ticket: ticket})
        })
})

/**
 * PUT /api/ticket/:id
 * @description Amends additional lines to an existing ticket based on the ticket id received and the {noOfLines} number
 * of lines
 * @param req : Request received from the user - Contains _id of ticket as parameter and {noOfLInes} number of lines as
 * query parameter
 * @param res : Response sent to the user - Sends back the amended ticket
 */
router.put('/ticket/:id', function(req, res) {
    let tId = req.params.id
    let noOfLines = req.query.noOfLines
    if(!noOfLines) return res.status(500).send(variables.NO_LINE_QUANTITY)
    Ticket.findOne({_id: tId}, {__v: 0})
        .populate('lines', 'line')
        .exec(function(err, ticket) {
            if (err) return res.status(500).send(variables.DB_GET_ERROR + ' : ' + err.stack)
            if (!ticket) return res.status(500).send(variables.DB_NO_DATA)

            //Check if the status of the ticket is checked already. If checked, it cannot be amended
            if(ticket.statusChecked){
                res.status(400).send(variables.TICKET_CANNOT_MODIFY)
            }else{
                ticket.createLines(noOfLines)
                if(ticket){
                    //Converting the ticket to object so _id of lines can be removed
                    let ticketObject = ticket.toObject()

                    //Removing _id property of each line object
                    ticketObject.lines.forEach(function(line) {
                        delete line._id
                    })
                    res.status(200).json({ticket: ticketObject})
                }else{
                    res.status(500).send(variables.GENERAL_ERROR)
                }
            }
        })
})

/**
 * PUT /api/status/:id
 * @description Gets the status of a ticket based on ticket id. Result of each line is calculated using virtual created
 * in Line model. The lines are then sorted ascending or descending according to the {outcomeOrder} property in
 * config.js
 * @param req : Request received from the user - Contains _id of ticket as parameter
 * @param res : Response sent to the user - Sends back the ticket with result added to each line
 */
router.put('/status/:id', function(req, res) {
    let tId = req.params.id
    Ticket.findOne({_id: tId}, {__v: 0})
        .populate('lines', {_id: 0, __v: 0})
        .exec(function(err, ticket) {
            if (err) return res.status(500).send(variables.DB_GET_ERROR + ' : ' + err.stack)
            if (!ticket) return res.status(500).send(variables.DB_NO_DATA)

            //Change the status of the ticket once opened so the lines cannot be amended further
            ticket.changeStatus()

            //Enable the {result} virtual
            let ticketWithResults = ticket.toObject({virtuals: true})

            //Sort the lines array based on the result property in ascending or descending order
            ticketWithResults.lines.sort((a, b) => config.outcomeOrder === 'ASC' ? a.result - b.result : b.result - a.result)
            res.status(200).json({ticket: ticketWithResults})
        })
})

module.exports = router
