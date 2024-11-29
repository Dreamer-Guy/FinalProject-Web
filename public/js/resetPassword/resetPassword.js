
const checkValidInput=(password,confirmPassword)=>{
    if(!password || password.trim().length===0 || !confirmPassword || confirmPassword.trim().length===0){
        return "Please fullfill in all fields";
    }
    if(password.length<6){
        return "Password must be at least 6 characters";
    }
    if(password!==confirmPassword){
        return "Passwords do not match";
    }
    return null;
};

const handleResetPasswordRequest=async()=>{
    try{
        const password=$("#new-password").val();
        const confirmPassword=$("#confirm-password").val();
        const errorMessages=checkValidInput(password,confirmPassword);
        if(errorMessages){
            showToast(errorMessages,'warning');
            return;
        }
        const url=new URL(window.location.href);
        const params=new URLSearchParams(url.search);
        const email=params.get('email');
        const token=params.get('token');
        showSpinnerLoading();
        const res=await fetch('/user/resetPassword',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email,
                token:token,
                newPassword:password,
                confirmPassword:confirmPassword,
            }),
        });
        hideSpinnerLoading();
        if(res.ok){
            const data=await res.json();
            showToast(data.message,'default');
            return;
        }
        else{
            const data=await res.json();
            console.log(data);
            showToast(data.message,'warning');
            return;
        }
    }
    catch(e){
        showToast('Error resetting password','warning');
    }
};

