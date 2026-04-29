const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
    window.location.href = 'login.html';
}

if (user && user.role !== 'admin') {
    window.location.href = 'index.html';
}

let allProjects = [];

function loadAdminProjects() {
    fetch(API_URL + '/api/admin/projects', {
        headers: { 'authorization': token }
    })
    .then(response => response.json())
    .then(projects => {
        allProjects = projects;
        updateStats(projects);
        displayAdminProjects(projects);
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function updateStats(projects) {
    document.getElementById('total-count').textContent = projects.length;
    document.getElementById('pending-count').textContent = projects.filter(p => p.status === 'pending').length;
    document.getElementById('approved-count').textContent = projects.filter(p => p.status === 'approved').length;
    document.getElementById('rejected-count').textContent = projects.filter(p => p.status === 'rejected').length;
}

function filterProjects(status) {
    if (status === 'all') {
        displayAdminProjects(allProjects);
    } else {
        const filtered = allProjects.filter(p => p.status === status);
        displayAdminProjects(filtered);
    }
}

function displayAdminProjects(projects) {
    const container = document.getElementById('admin-projects');

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects found.</p>';
        return;
    }

    container.innerHTML = '';
    projects.forEach(project => {
        const div = document.createElement('div');
        div.className = 'admin-card';
        div.innerHTML = `
            <div class="admin-card-header">
                <h3>${project.title}</h3>
                <span class="status-badge status-${project.status}">${project.status}</span>
            </div>
            <p>By: ${project.student_name} | ${project.department} | ${project.year}</p>
            <p class="abstract-preview">${project.abstract.substring(0, 200)}...</p>
            <div class="admin-actions">
                ${project.status !== 'approved' ? `<button class="approve-btn" onclick="updateStatus(${project.id}, 'approved')">Approve</button>` : ''}
                ${project.status !== 'rejected' ? `<button class="reject-btn" onclick="updateStatus(${project.id}, 'rejected')">Reject</button>` : ''}
                <button class="delete-btn" onclick="deleteProject(${project.id})">Delete</button>
                <a href="project.html?id=${project.id}" class="btn" target="_blank">View</a>
            </div>
            <p id="msg-${project.id}" class="success"></p>
        `;
        container.appendChild(div);
    });
}

function updateStatus(projectId, status) {
    fetch(API_URL + '/api/admin/projects/' + projectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('msg-' + projectId).textContent = '✅ Project ' + status + '!';
            setTimeout(() => loadAdminProjects(), 1500);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    fetch(API_URL + '/api/admin/projects/' + projectId, {
        method: 'DELETE',
        headers: { 'authorization': token }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            loadAdminProjects();
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

loadAdminProjects();