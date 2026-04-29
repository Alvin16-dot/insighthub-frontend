function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(API_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            document.getElementById('success').textContent = 'Login successful! Redirecting...';
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            document.getElementById('error').textContent = data.error;
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
}