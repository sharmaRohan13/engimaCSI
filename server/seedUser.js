const sqlite3 = require('sqlite3').verbose();

const users = [
    { username: 'team_01', password: "=\\([U" },
    { username: 'team_02', password: "G(.ZR" },
    { username: 'team_03', password: "_q'GG" },
    { username: 'team_04', password: "b(<*d" },
    { username: 'team_05', password: "Gcb8?" },
    { username: 'team_06', password: "D9u/&" },
    { username: 'team_07', password: "^JL3@" },
    { username: 'team_08', password: "dXD'w" },
    { username: 'team_09', password: ")3&@3" },
    { username: 'team_10', password: "XW,<1" },
];

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database');

        // delete all users from users table
        db.run('DELETE FROM users', (err) => {
            if (err) {
                console.error('Error deleting users:', err.message);
            } else {
                console.log('Deleted all users');

                // insert users into users table
                users.forEach(user => {
                    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [user.username, user.password], (err) => {
                        if (err) {
                            console.error('Error inserting user:', err.message);
                        } else {
                            console.log(`Inserted user ${user.username}`);
                        }
                    });
                });
            }
        });
    }
});





