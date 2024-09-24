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

client.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

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


  async function initializeCanvas() {
    // Initialize the canvas array with the default color
    for (let row = 0; row < c_rows; row++) {
        canvas[row] = [];
        for (let col = 0; col < c_cols; col++) {
            canvas[row][col] = "white"; // Default color
        }
    }

    try {
        // Fetch all canvas data in one query
        const res = await client.query("SELECT x, y, color FROM canvas");

        // Update the canvas array with data from the database
        res.rows.forEach(pixel => {
            const x = pixel.x;
            const y = pixel.y;
            const color = pixel.color;

            // Ensure indices are within bounds
            if (x >= 0 && x < c_rows && y >= 0 && y < c_cols) {
                canvas[x][y] = color;
            } else {
                console.warn(`Invalid coordinates from DB: x=${x}, y=${y}`);
            }
        });

        console.log("Canvas initialized with database data.");
    } catch (err) {
        console.error("Error fetching canvas data:", err.message);
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


(async () => {
    await initializeCanvas();
  
    server.listen(process.env.PORT || 3000, () => {
      console.log("Server is running on port " + (process.env.PORT || 3000));
    });
  })();
