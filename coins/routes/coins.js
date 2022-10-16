const express = require("express")
const axios = require("axios")
const { Shiba, Coins } = require("../models")

const router = express.Router()



router.get("/", async (req, res) => {
    await Coins.find().sort({ "_id": -1 }).limit(1).then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json({
            err: err.toString()
        }).status(400)
    })
})

router.post("/", async (req, res) => {
    const coin = new Coins(req.body)
    coin.save().then((data) => {
        res.json({
            data
        }).status(200)
    }).catch((err) => {
        res.json({
            err: err.toString()
        }).status(400)
    })
})

router.get("/price/:address", async (req, res) => {
    try {
        axios.post("https://graphql.bitquery.io", {
            query: `{
                ethereum(network: bsc) {
                    dexTrades(
                      time: {since: "2015-08-01"}
                      options: {asc: "timeInterval.minute"}
                      any: [{baseCurrency: {is: "0xC17c30e98541188614dF99239cABD40280810cA3"}, quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}}]
                      tradeAmountUsd: {gt: 1}
                    ) {
                      timeInterval {
                        minute(format: "%FT%TZ", count: 1440)
                      }
                      info: baseCurrency {
                        address
                        name
                        decimals
                      }
                      price: maximum(of: block, get: quote_price)
                    }
                  }
                }`
        }, {
            headers: {
                "X-API-KEY": "BQY1qRu3jMTcENgPzfe9CoDMicnRefUP"
            }
        }).then((token) => {
            res.json(token.data?.data?.ethereum)
        })
    } catch (error) {
        res.json({ error, "message": "bad" })
    }
})

module.exports = router