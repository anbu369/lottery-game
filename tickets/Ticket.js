/**
 * @author Anbarasan Swaminathan
 * @email anbu.369@gmail.com
 * @file Ticket Model
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose')

//Models
let Line = require('../lines/Line')

/**
 * @description Create a schema for the Ticket model.
 * {noOfLines} field mentions the amount of lines a ticket has
 * {lines} has the objectIds of the collection of lines from Line Model.
 * {statusChecked} field is set to true when a ticket's status is checked
 */
let TicketSchema = new mongoose.Schema({
    noOfLines: Number,
    lines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Line'
    }],
    statusChecked: Boolean
}, {id: false})

/**
 * @description Method to create lines in Line model and add the lines to corresponding ticket
 * @param noOfLines
 * @returns {mongoose.Schema.methods}
 */
TicketSchema.methods.createLines = function createLines(noOfLines) {
    let lines = []
    for(let i=0; i<noOfLines; i++){
        lines.push(Line.newLine())
    }

    //amend with the ticket's existing lines
    let existingLines = (this.lines) ? this.lines : [];
    this.lines = existingLines.concat(lines);
    this.noOfLines = this.lines.length;
    this.save();
    return this
}

/**
 * @description Changes the {statusChecked} status of the ticket from false to true
 */
TicketSchema.methods.changeStatus = function changeStatus(){
    this.statusChecked = true
    this.save()
}

mongoose.model('Ticket', TicketSchema)
module.exports = mongoose.model('Ticket')
