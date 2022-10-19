const { Coins } = require("../models")

const topCoins = (socket) => {
    Coins.find().sort({ marketCap: -1 }).limit(5).then(async (coins) => {
        socket.emit("tops-coins-limite-five", coins)
    })
}

const bricaToken = (socket) => {
    Coins.findOne({ symbol: "SENEKU" }).then(async (coin) => {
        socket.emit("get-brica-coin", coin)
    })
}

const watchCoins = (io) => {
    Coins.watch().on("change", () => {
        Coins.find().sort({ marketCap: -1 }).limit(20).then(async (coins) => {
            io.emit("tops-coins-limite-five", coins)
        })

        Coins.findOne({ symbol: "SENEKU" }).then(async (coin) => {
            io.emit("get-brica-coin", coin)
        })
    })
}


module.exports = {
    topCoins,
    bricaToken,
    watchCoins
}