const mongoose = require("mongoose")

const Shiba = mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Number,
        default: Date.now
    }
})


module.exports = mongoose.model("token", Shiba)