/**
 * @file Line Model
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose')
let config = require('../config')

let LineSchema = new mongoose.Schema({
    line: [Number]
}, {id: false})

LineSchema.statics.newLine = function newLine(){
    let lineItem = new this({
        line: []
    });

    for(let i=0; i<config.lineValuesCount; i++) {
        lineItem.line.push(generateLine(config.minLineValue, config.maxLineValue));
    }

    lineItem.save();
    return lineItem;
}

LineSchema.virtual('result').get(function(){
    //condition 1: If sum of the array is 2, then result is 10
    if(this.line.reduce((a, b) => a + b) === 2){
        return 10
    }

    //condition 2: If all the values of line are same, then result is 5
    if(!isNaN(this.line.reduce((a, b) => a === b ? a : NaN))){
        return 5
    }

    //condition 3: If 2nd and 3rd value are different from first, then result is 1
    if(!isNaN(this.line.reduce((a, b) => a !== b ? a : NaN))){
        return 1
    }

    return 0
})

function generateLine(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

mongoose.model('Line', LineSchema)
module.exports = mongoose.model('Line')
