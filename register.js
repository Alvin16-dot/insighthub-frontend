function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error');
    const successElement = document.getElementById('success');

    errorElement.textContent = '';
    successElement.textContent = '';

    fetch(API_URL + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => {
        if (response.ok) {
            successElement.textContent = 'Registration successful! Redirecting to login...';
            setTimeout(() => window.location.href = 'login.html', 2000);
        }
        return response.json();
    })
    .then(data => {
        if (errorElement.textContent === '' && data.error) {
            errorElement.textContent = data.error;
        }
    })
    .catch(error => {
        console.log('Error:', error);
        errorElement.textContent = 'Could not connect to server.';
    });
}