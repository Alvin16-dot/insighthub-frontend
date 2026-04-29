const API_URL = 'https://insighthub-backend-aqi5.onrender.com';

function updateNav() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const navLinks = document.getElementById('nav-links');

    if (!navLinks) return;

    if (token && user) {
        navLinks.innerHTML = `
            <span>Hi, ${user.name}</span>
            <a href="index.html">Home</a>
            <a href="submit.html">Submit Project</a>
            ${user.role === 'admin' ? '<a href="admin.html">Admin</a>' : ''}
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', updateNav);