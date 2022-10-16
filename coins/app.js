require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const Ethers = require("ethers")
const http = require('http')
const { binance } = require("./web3")
const { Shiba, Coins } = require("./models");
const ERC20 = require("./web3/ERC20")
const abi = require("./abi.json")
const { topCoins, bricaToken, watchCoins } = require("./ws/coins")


const app = express()
const erc20 = new ERC20()
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

// Connect to Database
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }).then(() => {
    console.log('Database Connected successfully')
})

// Watching Database Changes
// binance.watch(io, 5)
// watchCoins(io)

// Midlewares
app.use(bodyParser.json())
app.use("/coins", require("./routes/coins"))


// Socket Connection
io.on('connection', (socket) => {
    console.log("user connected")
    socket.on("join-coins-server", ({ userId }) => {
        socket.join(userId)
        topCoins(socket)
        // binance.watchPercentageChange(io, 5, 1)
        // binance.watchPercentageChange(io, 5, 24)
        // binance.watchPercentageChange(io, 5, 7)
        bricaToken(socket)
    })
})

const PORT = process.env.PORT || 8001
server.listen(PORT, () => {
    console.log(`\nListening on: http://localhost:${PORT} \n`);
})