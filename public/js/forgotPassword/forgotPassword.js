const handleSendForgotPasswordRequest=async()=>{
    try{
        const email=$('#email').val();
        const res=await fetch(`/user/forgotPassword?email=${email}`);
    }
    catch(err){
        console.log(err);
    }
}