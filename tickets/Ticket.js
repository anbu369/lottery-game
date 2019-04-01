/**
 * @file Ticket Model
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose')
let Line = require('../lines/Line')

let TicketSchema = new mongoose.Schema({
    noOfLines: Number,
    lines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Line'
    }],
    statusChecked: Boolean
})

TicketSchema.methods.createLines = function createLines(noOfLines) {
    let lines = []
    for(let i=0; i<noOfLines; i++){
        lines.push(Line.newLine())
    }

    let existingLines = (this.lines) ? this.lines : [];
    this.lines = existingLines.concat(lines);
    this.noOfLines = this.lines.length;
    this.save();
    return this
}

TicketSchema.methods.changeStatus = function changeStatus(){
    this.statusChecked = true
    this.save()
}

mongoose.model('Ticket', TicketSchema)
module.exports = mongoose.model('Ticket')
