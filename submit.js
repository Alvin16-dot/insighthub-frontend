const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

function submitProject() {
    const title = document.getElementById('title').value;
    const abstract = document.getElementById('abstract').value;
    const department = document.getElementById('department').value;
    const supervisor = document.getElementById('supervisor').value;
    const year = document.getElementById('year').value;
    const tags = document.getElementById('tags').value;
    const technology = document.getElementById('technology').value;
    const file_url = document.getElementById('file_url').value;
    const video_url = document.getElementById('video_url').value;

    const errorElement = document.getElementById('error');
    const successElement = document.getElementById('success');

    errorElement.textContent = '';
    successElement.textContent = '';

    fetch(API_URL + '/api/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify({ title, abstract, department, supervisor, year, tags, technology, file_url, video_url })
    })
    .then(response => response.json())
    .then(data => {
        if (data.project) {
            successElement.textContent = 'Project submitted! Waiting for admin approval.';
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            errorElement.textContent = data.error;
        }
    })
    .catch(error => {
        console.log('Error:', error);
        errorElement.textContent = 'Could not connect to server.';
    });
}