const handleResetPasswordRequest=async()=>{
    try{
        const url=new URL(window.location.href);
        const params=new URLSearchParams(url.search);
        const email=params.get('email');
        const token=params.get('token');
        const password=$("#new-password").val();

        const res=await fetch('/user/resetPassword',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email,
                token:token,
                newPassword:password,
            }),
        });
    }
    catch(e){

    }
};

