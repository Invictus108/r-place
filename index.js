const express = require("express")
const {wakeDyno} = require('heroku-keep-awake'),
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
    console.log("A User Connected")
    socket.emit("canvas", canvas)

    socket.on("color", data => {
        canvas[data.row - 1][data.col - 1] = data.color
        io.emit("canvas", canvas)
    })

    socket.on("draw", msg);
    function msg(data) {
        console.log(data);
        io.sockets.emit("draw", data);
        io.broadcast.emit("canvas", canvas);
    }
}) 
io.on("diconnect", socket => {
    console.log("A User Disconnected")
})
//when actually being hosted must be (process.env.PORT)
server.listen(process.env.PORT, () =>{
    wakeDyno("www.jadencohen.com");
})

