const notification = (socket, io) => {
    socket.on("sentNotification", (data) => {
        io.to(data.userId).emit("getNotification", data)
    })
}

module.exports = notification