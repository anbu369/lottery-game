/**
 * @author Anbarasan Swaminathan
 * @email anbu.369@gmail.com
 * @file Line Model
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose')

//Helpers
let config = require('../helpers/config')

/**
 * @description Create a schema for the Line model.
 * A line model contains single lines of a ticket in each row. _id of each line is referenced in the lines field of a
 * ticket
 */
let LineSchema = new mongoose.Schema({
    line: [Number]
}, {id: false})

/**
 * @description create a new line. By default a new line has n number of values mentioned in {lineValuesCount} config.js
 * minimum and maximum values to be used in the line can also be changed in config.js
 * @returns {mongoose.Schema.statics}
 */
LineSchema.statics.newLine = function newLine(){
    let lineItem = new this({
        line: []
    });

    for(let i=0; i<config.lineValuesCount; i++) {
        //generate value between {minLineValue} and {maxLineValue} and add it to the line array
        lineItem.line.push(generateLine(config.minLineValue, config.maxLineValue));
    }

    lineItem.save();
    return lineItem;
}

/**
 * A virtual is created to return each line with a computed value when requested
 */
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

/**
 * @description this function returns a random value from the range min to max value mentioned in config.js
 * @param min - Minimum value in a line
 * @param max - Maximum value in a line
 * @returns {*} a value from min value to max value
 */
function generateLine(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

mongoose.model('Line', LineSchema)
module.exports = mongoose.model('Line')
