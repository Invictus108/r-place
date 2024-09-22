# r/place Clone

This project is a clone of Reddit's famous **r/place**. It features a **75 x 125 grid** where users can place blocks. The grid's state is stored using **PostgreSQL**, ensuring that block placements are saved and can be reloaded. The server operates in real-time, meaning new blocks are uploaded and displayed without the need for refreshing the page.

## Key Features

- **75 x 125 Grid**: Users can place blocks in a grid with dimensions of 75 rows and 125 columns.
- **PostgreSQL Integration**: Block placements are saved in a PostgreSQL database, allowing persistent storage and real-time updates.
- **Real-Time Updates**: The server uses web sockets or a similar mechanism to ensure block placements are reflected immediately for all users, with no page refresh required.

## Original Concept

The idea is based on Reddit's **r/place** event, and you can learn more about the original concept by watching this [YouTube video](https://www.youtube.com/watch?v=y_J1SPXilGg).

## Local Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/r-place-clone.git
   cd r-place-clone
   npm install
   node index
