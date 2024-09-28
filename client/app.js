const serverUrl = 'http://172.104.207.22/server';
// 'http://localhost:3000';
//'http://172.104.207.22/server';

const questions = [
    "<a href='https://pastebin.com/M9XNTHAf' target='_blank'>Link</a>",
    "<a href='https://imgur.com/a/wGZ16Ov' target='_blank'>Link</a>",
    "<a href='https://drive.google.com/file/d/1n86qNxWrIHWsQY9SkHfA7RYzxyX-BzB_/view?usp=drive_link' target='_blank'>Link</a>",
    "<a href='https://imgur.com/a/bSVswfW' target='_blank'>Link</a>",
    "<a href='https://imgur.com/a/TOfEqTj' target='_blank'>Link</a>",
    "<a href='https://imgur.com/a/UIsCvWR' target='_blank'>Link</a>",
    "<div><a href='https://drive.google.com/file/d/1-UgrzHqKK0mAT8vNsVR8Uuqsej-Dz_sg/view?usp=drive_link' target='_blank'>Link</a><p>In shadows cast by sound and steel,\nTwo silent watchers, cold yet real</p></div>",
    "<a href='https://imgur.com/a/2AZDrVm' target='_blank'>Link</a>",
    "<p>\"FBI says, \"\"Yj c mktbz yxatu mwynmi icaa junquo uxepu,\nKpu ycipu ilgbhu mevx icweeqh oycjj.\nXwj ep '47, qjqjdgh cteqr qnqia,\nYypj iaehavi pju sqhhf cwa daxun mdky.\nJdgo sjyorun qv omyau mdgha uuytupu cwa beg\"\" 'de'\"</p>",
    "<p>56°50'38.6\"N 60°39'15.4\"E</p>",
    "<p>Completed !!</p>"
];

// Dynamically load HTML content
async function loadPage(page) {
    try {
        const text = await fetch(page);
        const html = await text.text();
    
        document.getElementById('app').innerHTML = html;
    } catch(err) {
        console.error('Failed to load page:', err)
    }
}

// On load, fetch the login page
window.onload = async function() {
    const user = localStorage.getItem('user');
    if(user) {
        await loadPage('content.html');

        const { username, level } = JSON.parse(user);

        document.getElementById('welcome').innerText = `Welcome ${username} !!`;
        document.getElementById('level').innerText = `Level: ${level}`;

        document.getElementById('question').innerHTML = level > 10 ? questions[10] : questions[level];
        await getUsers();
    } else {
        loadPage('login.html');
    }
};

async function getUsers() {
    try {
        const data = await fetch(`${serverUrl}/users`);
        const users = await data.json();

        const leaderboard = document.getElementById('leaderboard');

        users.sort((a, b) => b.level - a.level);
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.level}</td>
            `;
            leaderboard.appendChild(row);
        });
    }
    catch(err) {
        console.error('Error fetching data:', err)
    }
}

async function getUser (username, password) {
    try {
        const data = await fetch(`${serverUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const user = await data.json();
        return user;
    } catch(err) {
        console.error('Error fetching data:', err)
    }
}

async function login() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await getUser(username, password);

        if (response.error) {
            alert(response.error);
        } else {
            localStorage.setItem('user', JSON.stringify(response));
            await loadPage('content.html');
            window.location.reload();
        }
    } catch(err) {
        console.error('Error logging in:', err);
        alert('Invalid username or password');
    }
}

async function logout() {
    localStorage.removeItem('user');
    await loadPage('login.html');
}


async function verifyAnswer(answer) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const data = await fetch(`${serverUrl}/submit`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, level: user.level, answer })
        });

        const response = await data.json();
        return response;
    } catch(err) {
        console.error('Error verifying answer:', err);
    }
}


async function submit() {
    try {
        const answer = document.getElementById('answer').value;
        const response = await verifyAnswer(answer);

        if (response.error) {
            alert(response.error);
        } else {
            localStorage.setItem('user', JSON.stringify(response));
            window.location.reload();
        }
    } catch(err) {
        console.error('Error submitting answer:', err);
    }
}