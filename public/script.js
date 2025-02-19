document.addEventListener("DOMContentLoaded", () => {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => renderPosts(posts))
        .catch(error => console.error('Error fetching posts:', error));
});
//Display Posts
function renderPosts(posts) {
    const postsSection = document.getElementById("posts");
    postsSection.innerHTML = "";
    posts.forEach(post => {
        const postContainer = document.createElement("div");
        postContainer.classList.add("post");

        const postTitle = document.createElement("h2");
        postTitle.textContent = post.title;
        postContainer.appendChild(postTitle);

        const postContent = document.createElement("p");
        postContent.classList.add("post-content");
        postContent.textContent = post.content;
        postContainer.appendChild(postContent);

        const postFooter = document.createElement("div");
        postFooter.classList.add("post-footer");
        postFooter.textContent = `Date: ${post.date}`;
        postContainer.appendChild(postFooter);

        postsSection.appendChild(postContainer);
    });
}
