document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 
    const formData = {
        fullName: document.getElementById("fullName").value,
        userName: document.getElementById("userName").value,
        password: document.getElementById("password").value,
        confirm: document.getElementById("confirm").value,
        aggrement: document.getElementById("aggrement").checked
    };
    console.log(formData);
    try {
        const response = await fetch("/user/registeruser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
    } 
    catch (error) {
        console.error("Error:", error);
    }
});

console.log("Hello from register.js");