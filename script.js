const API_URL = 'https://insighthub-backend-aqi5.onrender.com';

function updateNav() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (token && user) {
        if (document.getElementById('nav-user')) document.getElementById('nav-user').textContent = 'Hi, ' + user.name;
        if (document.getElementById('nav-login')) document.getElementById('nav-login').style.display = 'none';
        if (document.getElementById('nav-register')) document.getElementById('nav-register').style.display = 'none';
        if (document.getElementById('nav-submit')) document.getElementById('nav-submit').style.display = 'inline';
        if (document.getElementById('nav-logout')) document.getElementById('nav-logout').style.display = 'inline';

        if (user.role === 'admin') {
            if (document.getElementById('nav-admin')) document.getElementById('nav-admin').style.display = 'inline';
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', updateNav);