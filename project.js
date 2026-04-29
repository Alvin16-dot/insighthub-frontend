const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

if (!projectId) {
    window.location.href = 'index.html';
}

fetch(API_URL + '/api/projects/' + projectId)
.then(response => response.json())
.then(project => {
    if (!project) {
        document.getElementById('project-details').innerHTML = '<p>Project not found.</p>';
        return;
    }

    const bookmarkBtn = user ? 
        `<button onclick="bookmarkProject()">Bookmark Project</button>` : 
        `<p><a href="login.html">Login to bookmark this project</a></p>`;

    document.getElementById('project-details').innerHTML = `
        <h2>${project.title}</h2>
        <p class="student-name">By: ${project.student_name}</p>
        <div class="project-meta">
            <span>Department: ${project.department}</span>
            <span>Supervisor: ${project.supervisor}</span>
            <span>Year: ${project.year}</span>
        </div>
        <div class="project-tags">
            <span>Tags: ${project.tags || 'None'}</span>
            <span>Technology: ${project.technology || 'None'}</span>
        </div>
        <div class="project-abstract">
            <h3>Abstract</h3>
            <p>${project.abstract}</p>
        </div>
        <div class="project-links">
            ${project.file_url ? `<a href="${project.file_url}" target="_blank" class="btn">View Project File</a>` : ''}
            ${project.video_url ? `<a href="${project.video_url}" target="_blank" class="btn">Watch Demo</a>` : ''}
        </div>
        <div class="bookmark-section">
            ${bookmarkBtn}
        </div>
        <p id="bookmark-msg" class="success"></p>
    `;

    if (user) {
        document.getElementById('comment-form').style.display = 'block';
    }
})
.catch(error => {
    console.log('Error:', error);
});

function bookmarkProject() {
    fetch(API_URL + '/api/bookmarks/' + projectId, {
        method: 'POST',
        headers: { 'authorization': token }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('bookmark-msg').textContent = '✅ Project bookmarked!';
        } else {
            document.getElementById('bookmark-msg').textContent = data.error;
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function loadComments() {
    fetch(API_URL + '/api/comments/' + projectId)
    .then(response => response.json())
    .then(comments => {
        const list = document.getElementById('comments-list');

        if (comments.length === 0) {
            list.innerHTML = '<p>No comments yet. Be the first!</p>';
            return;
        }

        list.innerHTML = '';
        comments.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'comment-card';
            div.innerHTML = `
                <p class="comment-author">${comment.name}</p>
                <p class="comment-text">${comment.content}</p>
                <p class="comment-date">${new Date(comment.created_at).toLocaleDateString()}</p>
            `;
            list.appendChild(div);
        });
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function addComment() {
    const content = document.getElementById('comment-text').value;

    if (!content) {
        document.getElementById('comment-error').textContent = 'Please write a comment first';
        return;
    }

    fetch(API_URL + '/api/comments/' + projectId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            document.getElementById('comment-text').value = '';
            document.getElementById('comment-success').textContent = 'Comment posted!';
            document.getElementById('comment-error').textContent = '';
            loadComments();
        } else {
            document.getElementById('comment-error').textContent = data.error;
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

loadComments();