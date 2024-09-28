const sqlite3 = require('sqlite3').verbose();

const users = [
    { username: 'jj00', password: 'test0'},
    { username: 'jj01', password: 'test1' },
    { username: 'jj02', password: 'test2' },
    { username: 'jj03', password: 'test3' },
    { username: 'jj04', password: 'test4' },
    { username: 'jj05', password: 'test5' },
    { username: 'jj06', password: 'test6' },
    { username: 'jj07', password: 'test7' },
    { username: 'jj08', password: 'test8' },
    { username: 'jj09', password: 'test9' },
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





