
const { watchBinance, watchPercentageChange } = require("./watch");


module.exports = {
    binance: {
        watch: watchBinance,
        watchPercentageChange
    }
}
