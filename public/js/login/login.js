

const handleLogin = async () => {
    const username = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    const formData = { username, password };

    try {
        const res = await fetch('/user/loginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (res.ok) { 
            window.location.href = "/products/get";
            console.log("here");
        } 
        else {
            console.log("Login failed");
        }
    } catch (err) {
        console.log(err);
    }
};


console.log("Login Page");