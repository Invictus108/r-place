const express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io")(server)

    const c_rows = 75 //50
    const c_cols = 75 //50

    var canvas = []

    for(var rows = 0; rows < c_rows; rows++){
        canvas[rows] = []

        for(var cols = 0; cols < c_cols; cols++){
            canvas[rows][cols] = "#FFF"
    }
}

app.use(express.static("public"))
io.on("connection", socket => {
    socket.emit("canvas", canvas)

    socket.on("color", data => {
        canvas[data.row - 1][data.col - 1] = data.color
        io.emit("canvas", canvas)
    })
})

//when actually being hosted must be (process.env.PORT)
server.listen(process.env.PORT)
