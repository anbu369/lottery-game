module.exports = {
    'port': process.env.port || 3000,
    'db': 'mongodb://localhost:27017/lotteryGame',
    'API_PREFIX': '/api/ticket',
    'defaultNoOfLines': 3,
    'lineValuesCount': 3,
    'minLineValue': 0,
    'maxLineValue': 2,
}
