document.addEventListener("DOMContentLoaded", () => {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const csrfToken = getCookie("XSRF-TOKEN");
            const formData = new FormData(registerForm);

            fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify({
                    username: formData.get("username"),
                    email: formData.get("email"),
                    password: formData.get("password")
                })
            })
                .then(response => {
                    if (!response.ok) throw new Error("Registration failed");
                    return response.json();
                })
                .then(data => {
                    alert("Registration successful!");
                    window.location.href = "/index.html"; // Redirect to login
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Registration failed. Please try again.");
                });
        });
    }
});
