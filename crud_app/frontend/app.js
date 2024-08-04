const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

function showPostSection() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('post-section').classList.remove('hidden');
    fetchPosts();
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Registration successful. Please login.');
        } else {
            alert('Registration failed.');
        }
    });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            token = `Bearer ${data.token}`;
            localStorage.setItem('token', token);
            showPostSection();
        } else {
            alert('Login failed.');
        }
    });
}

function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        if (data._id) {
            alert('Post created successfully');
            document.getElementById('post-title').value = '';
            document.getElementById('post-content').value = '';
            fetchPosts();
        } else {
            alert('Error creating post');
        }
    });
}

function fetchPosts() {
    fetch(`${API_URL}/posts`, {
        headers: { 'Authorization': `${token}` }
    })
    .then(response => response.json())
    .then(posts => {
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '';
        posts.forEach(post => {
            postsList.innerHTML += `
                <div>
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <button onclick="updatePost('${post._id}')">Update</button>
                    <button onclick="deletePost('${post._id}')">Delete</button>
                </div>
            `;
        });
    });
}

function updatePost(id) {
    const newTitle = prompt('Enter new title:');
    const newContent = prompt('Enter new content:');

    fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify({ title: newTitle, content: newContent })
    })
    .then(response => response.json())
    .then(data => {
        if (data._id) {
            alert('Post updated successfully');
            fetchPosts();
        } else {
            alert('Error updating post');
        }
    });
}

function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `${token}` }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Post deleted successfully');
                fetchPosts();
            } else {
                alert('Error deleting post');
            }
        });
    }
}

function logout() {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    token = null;

    // Hide the post section and show the auth section
    document.getElementById('post-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');

    // Clear any input fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';

    // Clear the posts list
    document.getElementById('posts-list').innerHTML = '';

    alert('You have been logged out successfully.');
}

// Check if user is already logged in
if (token) {
    showPostSection();
}