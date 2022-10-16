const mongoose = require("mongoose")

const Coins = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quotePrice: {
        type: Number,
        required: true
    },
    totalSupply: {
        type: Number,
        required: true
    },
    marketCap: {
        type: Number,
        required: true
    },
    totalBurned: {
        type: Number,
        required: true
    },
    circulating: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    explorer: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    liquility: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    inverse: {
        type: Boolean,
        required: true
    }
})


module.exports = mongoose.model("coin", Coins)