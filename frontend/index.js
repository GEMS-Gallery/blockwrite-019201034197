import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
    quill = new Quill('#editor', {
        theme: 'snow'
    });

    const newPostBtn = document.getElementById('newPostBtn');
    const postForm = document.getElementById('postForm');
    const blogForm = document.getElementById('blogForm');
    const postsSection = document.getElementById('posts');

    newPostBtn.addEventListener('click', () => {
        postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
    });

    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const body = quill.root.innerHTML;

        await backend.addPost(title, body, author);
        blogForm.reset();
        quill.setContents([]);
        postForm.style.display = 'none';
        await displayPosts();
    });

    await displayPosts();
});

async function displayPosts() {
    const posts = await backend.getPosts();
    const postsSection = document.getElementById('posts');
    postsSection.innerHTML = '';

    posts.sort((a, b) => b.timestamp - a.timestamp).forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <div class="post-meta">By ${post.author} on ${new Date(post.timestamp / 1000000).toLocaleString()}</div>
            <div class="post-body">${post.body}</div>
        `;
        postsSection.appendChild(postElement);
    });
}
