const isEmailValidFormat=(email)=>{
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
};

const isEmailEmpty=(email)=>{
    return !email || email.trim().length === 0;
};

const checkEmailValid=(email)=>{
    if(isEmailEmpty(email)){
        return "Please enter your email";
    }
    if(!isEmailValidFormat(email)){
        return "Please enter a valid email";
    }
    return null;
}

const handleSendForgotPasswordRequest=async()=>{
    try{
        
        const email=$('#email').val();
        const emailError=checkEmailValid(email);
        if(emailError){
            showToast(emailError);
            return;
        }
        showSpinnerLoading();
        const res=await fetch(`/user/forgotPassword?email=${email}`);
        hideSpinnerLoading();
        if(res.ok){
            showToast('Password reset link sent to your email');
        }
        else{
            showToast('Error sending password reset link','warning');
        }
    }
    catch(err){
        console.log(err);
    }
}