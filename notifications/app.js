const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const notifications = require("./ws/notifications")

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

app.get('/', (req, res) => {
    res.send('/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("join-room", ({ roomId }) => {
        console.log(roomId);
        socket.join(roomId)
        notifications(socket, io)
    })

});

const PORT = process.env.PORT || 8002
server.listen(8001, () => {
    console.log(`Listening on  http://localhost:${PORT} \n`)
})