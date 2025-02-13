// Dummy data for posts
const postsData = [
    { id: 1, title: "Quest Completed: Drink Water", content: "I drank 8 glasses of water today and earned 10 XP!", date: "2025-02-11" },
    { id: 2, title: "Quest Completed: Walk 10,000 Steps", content: "I reached my step goal and earned 20 XP!", date: "2025-02-11" },
    { id: 3, title: "Quest Completed: Read 20 Pages", content: "I read 20 pages of my book and earned 15 XP!", date: "2025-02-11" }
];

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

document.addEventListener("DOMContentLoaded", () => {
    renderPosts(postsData);
});
