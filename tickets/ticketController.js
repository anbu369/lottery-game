let express = require('express')
let router = express.Router()
let bodyParser = require('body-parser')
let variables = require('../variables')
let config = require('../config')

router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(bodyParser.json())

//Initialize Ticket & Line model
let Ticket = require('./Ticket')
let Line = require('../lines/Line')

//Create a new ticket with n lines
router.post('/', function(req, res) {
    let noOfLines = config.defaultNoOfLines
    if(req.body.noOfLines) noOfLines = req.body.noOfLines
    let ticketItem = new Ticket({
        noOfLines: noOfLines,
        statusChecked: false,
        lines: []
    })

    let ticket = ticketItem.createLines(noOfLines)
    if(ticket){
        res.status(200).json({ticket: ticket})
    }else{
        res.status(500).send(variables.GENERAL_ERROR)
    }
})

//Get all tickets
router.get('/', function(req, res) {
    Ticket.find({}, {lines: 0, __v: 0}).exec(function(err, tickets){
        if (err) return res.status(500).send(variables.DB_GET_ERROR + ' : ' + err.stack)
        res.status(200).json({tickets: tickets});
    })
})

//Get Ticket by Id
router.get('/:id', function(req, res) {
    let tID = req.params.id
    Ticket.findOne({_id: tID}, {__v: 0})
        .populate('lines')
        .exec(function(err, ticket) {
            if (err) return res.status(500).send(variables.DB_GET_ERROR + ' : ' + err.stack)
            if (!ticket) return res.status(500).send(variables.DB_NO_DATA)

            res.status(200).json({ticket: ticket})
        })
})

function generateLine(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router
