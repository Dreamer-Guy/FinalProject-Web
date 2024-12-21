document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('profileForm').addEventListener('submit', function (e) {
      let hasError = false;
      const fullname = document.getElementById('fullname');
      const email = document.getElementById('email');
      
      if (!fullname.value || fullname.value.trim().length < 3) {
        hasError = true;
        document.getElementById('fullname-error').textContent = 'Please enter your fullname.';
      } else {
        document.getElementById('fullname-error').textContent = '';
      }
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!email.value || !emailPattern.test(email.value)) {
        hasError = true;
        document.getElementById('email-error').textContent = 'Please enter a valid email.';
      } else {
        document.getElementById('email-error').textContent = '';
      }
      if (hasError) {
        e.preventDefault(); 
      }
    });
    const inputImage=document.getElementById('inputImage')
    const imageDisplay=document.getElementById('imageDisplay')
    inputImage.addEventListener('change',function(e){
        const file =e.target.files[0]
        if(file){
            const reader= new FileReader()
            reader.onload=function(e){
                imageDisplay.src=e.target.result
            }
            reader.readAsDataURL(file)
        }
    })
});
  