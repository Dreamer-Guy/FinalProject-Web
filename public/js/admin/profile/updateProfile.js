function previewImage(input) {
    const imageDisplay = document.getElementById('imageDisplay');
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageDisplay.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

document.getElementById('inputImage').addEventListener('change', function(e) {
    previewImage(this);
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let hasError = false;
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const birthday = document.getElementById('birthday').value;

    if (!fullname || fullname.trim().length < 3) {
        hasError = true;
        document.getElementById('fullname-error').textContent = 'Full name must be at least 3 characters';
    } else {
        document.getElementById('fullname-error').textContent = '';
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailPattern.test(email)) {
        hasError = true;
        document.getElementById('email-error').textContent = 'Invalid email format';
    } else {
        document.getElementById('email-error').textContent = '';
    }

    if (hasError) return;

    try {
        const formData = new FormData();
        formData.append('fullName', fullname);
        formData.append('email', email);
        formData.append('birthDate', birthday);

        const avatar = document.getElementById('inputImage').files[0];
        if (avatar) {
            formData.append('avatar', avatar);
        }

        const response = await fetch('/admin/profile/update', {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            Toastify({
                text: data.message || "Profile updated successfully",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#4caf50",
                    top: "auto !important",
                    bottom: "15px !important"
                }
            }).showToast();
        } else {
            Toastify({
                text: data.message || "An error occurred",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#f44336",
                    top: "auto !important",
                    bottom: "15px !important"
                }
            }).showToast();
        }
    } catch (error) {
        console.error('Error:', error);
        Toastify({
            text: "An error occurred",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "#f44336",
                top: "auto !important",
                bottom: "15px !important"
            }
        }).showToast();
    }
});
