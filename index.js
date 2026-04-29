function loadProjects() {
    document.getElementById('keyword').value = '';
    document.getElementById('department').value = '';
    document.getElementById('year').value = '';

    fetch(API_URL + '/api/projects')
    .then(response => response.json())
    .then(projects => {
        displayProjects(projects);
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function searchProjects() {
    const keyword = document.getElementById('keyword').value;
    const department = document.getElementById('department').value;
    const year = document.getElementById('year').value;

    let url = API_URL + '/api/projects?';
    if (keyword) url += 'keyword=' + keyword + '&';
    if (department) url += 'department=' + department + '&';
    if (year) url += 'year=' + year + '&';

    fetch(url)
    .then(response => response.json())
    .then(projects => {
        displayProjects(projects);
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function displayProjects(projects) {
    const grid = document.getElementById('projects-grid');

    if (projects.length === 0) {
        grid.innerHTML = '<p>No projects found.</p>';
        return;
    }

    grid.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p class="student-name">By: ${project.student_name}</p>
            <p class="department">${project.department} - ${project.year}</p>
            <p class="abstract">${project.abstract.substring(0, 150)}...</p>
            <a href="project.html?id=${project.id}" class="btn">View Project</a>
        `;
        grid.appendChild(card);
    });
}

loadProjects();