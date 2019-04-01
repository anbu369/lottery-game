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
    'defaultNoOfLines': 3,
    'lineValuesCount': 3,
    'minLineValue': 0,
    'maxLineValue': 2,
    'outcomeOrder': 'ASC' //ASC or DEC
}
