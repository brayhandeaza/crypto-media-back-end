// const Web3 = require('web3')
const { default: axios } = require('axios')
const Web3 = require('web3')
const { Coins } = require('../models')
const ERC20 = require("./ERC20")
const erc20 = new ERC20()
const moment = require("moment")



const formatPrice = (price) => {
    if (price > 1) return parseFloat(price).toFixed(2)

    if (price > 0.9) return parseFloat(price).toFixed(3)

    if (price > 0.09) return parseFloat(price).toFixed(4)

    if (price > 0.009) return parseFloat(price).toFixed(5)

    if (price > 0.0009) return parseFloat(price).toFixed(6)

    if (price > 0.0009) return parseFloat(price).toFixed(7)

    if (price > 0.000009) return parseFloat(price).toFixed(8)

    if (price > 0.0000009) return parseFloat(price).toFixed(9)

    if (price > 0.00000009) return parseFloat(price).toFixed(10)

    if (price > 0.000000009) return parseFloat(price).toFixed(11)

    if (price > 0.0000000009) return parseFloat(price).toFixed(12)

    if (price > 0.00000000009) return parseFloat(price).toFixed(13)

    if (price > 0.000000000009) return parseFloat(price).toFixed(14)

    if (price > 0.0000000000009) return parseFloat(price).toFixed(15)

    if (price > 0.00000000000009) return parseFloat(price).toFixed(16)

    if (price > 0.000000000000009) return parseFloat(price).toFixed(17)

    if (price > 0.0000000000000009) return parseFloat(price).toFixed(18)
}

const watchPercentageChange = (io, limit = 5, timeAgo) => {
    const yesterday = moment().subtract(1, "hours").format("YYYY-MM-DDThh:00")
    console.log(yesterday);
    let date;

    switch (timeAgo) {
        case 1:
            date = moment().subtract(1, "hours").format("YYYY-MM-DDThh:00")
            break;
        case 24:
            date = moment().subtract(24, "hours").format("YYYY-MM-DD")
            break;
        default:
            date = moment().subtract(7, "days").format("YYYY-MM-DD")
            break;
    }

    try {
        console.log(`watchPercentageChange: =>`)
        Coins.find().sort({ marketCap: -1 }).limit(limit).then(async (coins) => {
            let coinStr = ``

            coins.forEach(async coin => {
                if (coin.type === "bep20") {
                    coinStr += `${coin.symbol}: dexTrades(date: {is: "${date}"} baseCurrency: {is: "${coin.address}"} quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"} ) { price: maximum(of: block, get: quote_price) info: baseCurrency { address decimals } } `
                }
            })

            await axios.post("https://graphql.bitquery.io", {
                query: `{
                ethereum(network: bsc) {
                    ${coinStr}
                    WBNB: dexTrades(
                        date: {is: "${date}"}
                        baseCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
                        quoteCurrency: {is: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"}
                    ) {
                        price: maximum(of: block, get: quote_price)
                        baseCurrency {
                            symbol
                            name
                            address
                        }
                    }}
                }`.toString()
            }, {
                headers: {
                    "X-API-KEY": "BQYQkz8jrlRStPj2BGuPrOLYgCCJdnyJ"
                }
            }).then((token) => {
                const bitquery = token.data?.data?.ethereum
                console.log("bitquery");

                switch (timeAgo) {
                    case 1:
                        io.emit("1hour-coin-changes", bitquery)
                        break;
                    case 24:
                        io.emit("24hours-coin-changes", bitquery)
                        break;
                    default:
                        io.emit("7days-coin-changes", bitquery)
                        break;
                }
            })
        })
    } catch (err) {
        console.error(err)
    }
}

const watchBinance = (io, limit = 5) => {
    let i = 0
    setInterval(async () => {
        const date = new Date().toISOString()
        i++
        try {
            console.log(`<=================${i}=================>`)
            Coins.find().sort({ marketCap: -1 }).limit(limit).then(async (coins) => {
                let coinStr = ``

                coins.forEach(async coin => {
                    if (coin.type === "bep20") {
                        coinStr += `${coin.symbol}: dexTrades( baseCurrency: {is: "${coin.address}"} quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"} ) { price: maximum(of: block, get: quote_price) info: baseCurrency { address decimals } } `
                    }
                })

                await axios.post("https://graphql.bitquery.io", {
                    query: `{
                ethereum(network: bsc) {
                    ${coinStr}
                    WBNB: dexTrades(
                        date: {is: "${date}"}
                        baseCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
                        quoteCurrency: {is: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"}
                    ) {
                        price: maximum(of: block, get: quote_price)
                        baseCurrency {
                            symbol
                            name
                            address
                        }
                    }}
                }`.toString()
                }, {
                    headers: {
                        "X-API-KEY": "BQYQkz8jrlRStPj2BGuPrOLYgCCJdnyJ"
                    }
                }).then(async (token) => {
                    const bitquery = token.data?.data?.ethereum
                    const WBNB = bitquery["WBNB"][0].price
                    for (const symbol in bitquery) {
                        const bitqueryPrice = bitquery[symbol][0]?.price
                        await Coins.findOne({ symbol: symbol }).then(async (coin) => {
                            if (symbol !== "WBNB") {
                                if (formatPrice(bitqueryPrice * WBNB) !== formatPrice(coin?.price * WBNB)) {
                                    console.log({
                                        b: Number(bitqueryPrice),
                                        m: coin?.price,
                                        s: symbol
                                    });

                                    await Coins.updateOne({ symbol: symbol }, {
                                        $set: {
                                            price: Number(bitqueryPrice),
                                            quotePrice: WBNB
                                        }
                                    })

                                    if (coin.symbol === "SUNEKU") {
                                        io.emit("get-prev-brica-coin", {
                                            g: Number(bitqueryPrice) > coin?.price ? true : false,
                                            symbol
                                        })
                                    }
                                    io.emit("prev-tops-coins-limite-five", {
                                        g: Number(bitqueryPrice) > coin?.price ? true : false,
                                        symbol
                                    })
                                }
                            }
                        })
                    }
                })
            })
        } catch (err) {
            console.error(err)
        }
    }, 20000)
}

// 10:13

module.exports = {
    watchBinance,
    watchPercentageChange
}
