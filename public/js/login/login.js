
const saveUsernameAndPassword = () => {
    localStorage.setItem('remember', true);
    localStorage.setItem('username', document.getElementById('userName').value);
    localStorage.setItem('password', document.getElementById('password').value);
};

const clearUsernameAndPassword = () => {
    localStorage.removeItem('remember');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
};

handleRememberMe = (remember) => {
    if(remember===true){
        saveUsernameAndPassword();
    }
    else{
        clearUsernameAndPassword();
    }
};

const handleLogin = async () => {
    const username = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    const isRememberMe = document.getElementById('remember').checked;
    const formData = { username, password };
    handleRememberMe(isRememberMe);
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
            const data = await res.json();
            window.location.href = data.redirectUrl;
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

const googleLogin=async()=>{
    window.location.href="/user/auth/google";
}


document.getElementById('userName').value = localStorage.getItem('username') || '';
document.getElementById('password').value = localStorage.getItem('password') || ''; 
document.getElementById('remember').checked = localStorage.getItem('remember')!==null?true:false;