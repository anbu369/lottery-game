/**
 * @author Anbarasan swaminathan
 * @email anbu.369@gmail.com
 *
 * @description All the API configurations are stored here
 * @type {{outcomeOrder: string, API_PREFIX: string, port: string | number, minLineValue: number, lineValuesCount: number, maxLineValue: number, db: string, defaultNoOfLines: number}}
 */
module.exports = {
    'port': process.env.port || 3000,
    'db_prod': 'mongodb://localhost:27017/lotteryGame',
    'db_dev': 'mongodb://localhost:27017/lotteryGameDev',
    'db_local': 'mongodb://localhost:27017/lotteryGameLocal',
    'db_test': 'mongodb://localhost:27017/lotteryGameTest',
    'API_PREFIX': '/api',
    'defaultNoOfLines': 3, //number of lines when a new ticket is created if number of lines is not specified by user
    'lineValuesCount': 3, //no of values in a single line
    'minLineValue': 0, //Minimum value in a line
    'maxLineValue': 2, //Maximum value in a line
    'outcomeOrder': 'ASC' //ASC or DEC order for the lines to be ordered in the status
}
