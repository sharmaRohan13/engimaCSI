// index.js

const express = require('express');
const cors = require('cors');

const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Cors middleware
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                level INTEGER NOT NULL DEFAULT 0
            )
        `);
    }
});

// GET endpoint to retrieve all users
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    console.log(username, password)
    
    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            // If the user is found and the password matches, return user data
            res.json({ username: row.username, level: row.level });
        } else {
            // Invalid username or password
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

app.patch('/submit', (req, res) =>  {
    const { username, level, answer } = req.body;

    const answers = require('./answers');

    if(answer === answers[level]) {
        const query = 'UPDATE users SET level = ? WHERE username = ?';
        db.run(query, [level + 1, username], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ username, level: level+1 });

            }
        });
    } else {
        res.status(400).json({ error: 'Incorrect answer' });
    }
});


// get all users

app.get('/users', (req, res) => {
    const query = 'SELECT username, level FROM users';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
