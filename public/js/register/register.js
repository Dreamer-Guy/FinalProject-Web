
const handleRegister=async(e)=>{
    e.preventDefault();
    const formData = {
        fullName: document.getElementById("fullName").value,
        userName: document.getElementById("userName").value,
        password: document.getElementById("password").value,
        confirm: document.getElementById("confirm").value,
        aggrement: document.getElementById("aggrement").checked
    };
    try {
        showSpinnerLoading();
        const response = await fetch("/user/registeruser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        hideSpinnerLoading();
        if(response.ok){
            showToast('Register successfully','default');
            setTimeout(() => {
                window.location.href = "/user/login";
            }, 1500);
        }
        else {
            const data = await response.json();
            const message=data.message;
            document.getElementById("error-message").innerHTML=message;
            document.getElementById("error-message").classList.remove("hidden");
        }
    } 
    catch (error) {
        console.error("Error:", error);
    }
}




console.log("Hello from register.js");