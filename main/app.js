// Import require packages
require("dotenv").config()
const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const { default: axios } = require("axios")
const { ip } = require("address")
const cors = require("cors")
const { checkDatabaseConnection } = require("./config/db")
const cookieParser = require('cookie-parser')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

const { Users } = require("./models")
const routes = require("./routes")
const { User } = require("./auth/routesMaker")


// Checking Databae connection
checkDatabaseConnection()

// App middlewares
app.use(cors({
    origin: [
        "http://localhost:3000",
    ]
}))

app.use(session({
    name: "brica.sid",
    secret: 'brica sec',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
        // secure: true
        httpOnly: true
    },
    store: session.MemoryStore()
}))

app.use(bodyParser.json({ limit: "80mb" }))
app.use(cookieParser("secret"))
app.use(express.urlencoded({ limit: "80mb", extended: true }))

// Setting all routes
app.use("/users", routes.Users)
app.use("/coins", routes.Coins)
app.use("/posts", routes.Posts)
app.use("/files", routes.Files)
app.use("/likes", routes.Likes)
app.use("/comments", routes.Comments)
app.use("/reply", routes.Reply)

// Main route with Error check

io.on('connection', (socket) => {
    socket.on("join-room", async (roomId, userId) => {
        socket.join(roomId)

        socket.on("watchers-connected", async (userId) => {
            const userStr = JSON.stringify(user)
            socket.broadcast.emit("users-connected", userStr)
        })

        socket.broadcast.to(roomId).emit("stream", userId)

        socket.on("disconnect", () => {
            console.log(socket.id)
        })

        socket.on("live-media", media => {
            socket.broadcast.emit("viewer-connected", media)
        })
    })
})

// Get one user by id
app.get("/", async (req, res) => {
    res.json({
        error: false,
        session: req.sessionStore,
        sessionId: req.sessionID
    })
})

// Get one user by id
app.post("/login", async (req, res) => {
    User.Login(req, res, Users)
})


app.get("*", (req, res) => {
    res.json({
        error: true,
        "API-KEY or Error": "Invalid API KEY or you do not have access to this route",
    })
})


const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
    console.log(`\nListening on: http://localhost:${PORT} \n`);
})