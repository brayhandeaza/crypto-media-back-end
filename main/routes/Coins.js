const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, GetCoinsWithFilter, Post, Patch } = require("../auth/routesMaker")
const { Coins } = require("../models")
const joi = require("joi")
const { default: axios } = require("axios")


// Coins Schema
const CoinsSchema = joi.object({
    name: joi.string().required(),
    type: joi.string().required(),
    imageUrl: joi.string().required(),
    address: joi.string().required(),
    explorer: joi.string().required(),
    symbol: joi.string().required()
})

router.get("/", (req, res) => {
    GetAll(req, res, Coins)
})

router.get("/our-token", async (req, res) => {
    try {
        axios.post("https://graphql.bitquery.io", {
            query: `{
                ethereum(network: ethereum) {
                  TOKEN: dexTrades(
                    baseCurrency: {is: "0xfAd45E47083e4607302aa43c65fB3106F1cd7607"}
                    quoteCurrency: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
                  ) {
                    price: maximum(of: block, get: quote_price)
                    baseCurrency {
                      symbol
                      name
                      address
                      decimals
                    }
                  }
                  WETH: dexTrades(
                    baseCurrency: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
                    quoteCurrency: {is: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}
                  ) {
                    price: maximum(of: block, get: quote_price)
                    baseCurrency {
                      symbol
                      name
                      address
                    }
                  }
                }
              }`
        }, {
            headers: {
                "X-API-KEY": "BQYQkz8jrlRStPj2BGuPrOLYgCCJdnyJ"
            }
        }).then((token) => {
            res.json(token.data?.data?.ethereum)
        })
    } catch (error) {
        res.json({ error, "message": "bad" })
    }
})

router.get("/search", (req, res) => {
    GetCoinsWithFilter(req, res, Coins)
})

router.get("/:id", (req, res) => {
    GetOne(req, res, Coins)
})

router.post("/", (req, res) => {
    Post(req, res, Coins, CoinsSchema)
})

router.patch("/:id", (req, res) => {
    Patch(req, res, Coins)
})

router.delete("/:id", (req, res) => {
    DeleteOne(req, res, Coins)
})



module.exports = router