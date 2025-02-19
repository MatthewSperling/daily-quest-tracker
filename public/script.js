document.addEventListener("DOMContentLoaded", () => {
    let totalXP = 0; 

    function updateXPDisplay() {
        document.querySelector(".total-xp").textContent = `Total XP: ${totalXP}`;
    }

    function completeTask(event) {
        const button = event.target;
        const taskDiv = button.parentElement;
        const taskId = parseInt(taskDiv.id.replace("task-id-", ""), 10);

        // Fetch the corresponding post data from /posts/:id
        fetch(`/posts/${taskId}`)
            .then(response => response.json())
            .then(post => {
                
                let xpEarned = 0;
                if (taskId === 1) xpEarned = 10;
                else if (taskId === 2) xpEarned = 20; 
                else if (taskId === 3) xpEarned = 10; 

                taskDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>Date: ${post.date}</small>
                `;

                
                totalXP += xpEarned;
                updateXPDisplay();
            })
            .catch(error => console.error("Error fetching post data:", error));
    }

    // Attach event listeners to all "Task Complete" buttons
    document.querySelectorAll(".complete-task").forEach(button => {
        button.addEventListener("click", completeTask);
    });
});


// 
// document.addEventListener("DOMContentLoaded", () => {
//     fetch('/posts')
//         .then(response => response.json())
//         .then(posts => renderPosts(posts))
//         .catch(error => console.error('Error fetching posts:', error));
// });
// //Display Posts
// function renderPosts(posts) {
//     const postsSection = document.getElementById("posts");
//     postsSection.innerHTML = "";
//     posts.forEach(post => {
//         const postContainer = document.createElement("div");
//         postContainer.classList.add("post");

//         const postTitle = document.createElement("h2");
//         postTitle.textContent = post.title;
//         postContainer.appendChild(postTitle);

//         const postContent = document.createElement("p");
//         postContent.classList.add("post-content");
//         postContent.textContent = post.content;
//         postContainer.appendChild(postContent);

//         const postFooter = document.createElement("div");
//         postFooter.classList.add("post-footer");
//         postFooter.textContent = `Date: ${post.date}`;
//         postContainer.appendChild(postFooter);

//         postsSection.appendChild(postContainer);
//     });
// }
