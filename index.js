const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { Client } = require("pg");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS canvas (
    x INT NOT NULL,
    y INT NOT NULL,
    color TEXT,
    PRIMARY KEY (x, y)
  );
`;

// Execute the query to create the table
client.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table "canvas" created successfully');
  }
})

const c_rows = 75;
const c_cols = 125;

var canvas = [];

async function fetchColors(row, col) {
    try {
        const res = await client.query(
            "SELECT color FROM canvas WHERE x = $1 AND y = $2",
            [row, col]
        );

        if (res.rows.length > 0 && res.rows[0].color !== undefined) {
            canvas[row][col] = res.rows[0].color;
        } else {
            // Set to white if no entry exists in the database
            canvas[row][col] = "white"; // Change "white" to your desired default color
        }
    } catch (err) {
        console.error("There was an error:", err.message);
    }
}

for (let rows = 0; rows < c_rows; rows++) {
    canvas[rows] = [];
    for (let cols = 0; cols < c_cols; cols++) {
        fetchColors(rows, cols);
    }
}

app.use(express.static("public"));

io.on("connection", socket => {
    console.log("A User Connected");
    socket.emit("canvas", canvas);

    socket.on("color", async data => {
        try {
            await client.query(
                "INSERT INTO canvas (x, y, color) VALUES ($1, $2, $3) ON CONFLICT (x, y) DO UPDATE SET color = EXCLUDED.color",
                [data.row, data.col, data.color]
            );
            canvas[data.row - 1][data.col - 1] = data.color;
            io.emit("canvas", canvas);
            console.log("X: " + data.row + ". Y " + data.col + ". Color " + data.color);
        } catch (err) {
            console.error("Error updating database:", err.message);
        }
    });

    socket.on("disconnect", () => {
        console.log("A User Disconnected");
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port " + (process.env.PORT || 3000));
});
