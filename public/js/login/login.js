

const handleLogin = async () => {
    const username = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    const formData = { username, password };

    try {
        if(username === "" || password === ""){
            alert("Please fill in all fields");
            return;
        }
        const res = await fetch('/user/loginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (res.ok) { 
            window.location.href = "/products/get";
        } 
        else if (res.status === 401) {
            document.getElementById('error-message').classList.remove('hidden');
        }
        else{
            alert("Login failed, please try again");
        }
    } catch (err) {
        console.log(err);
    }
};


console.log("Login Page");