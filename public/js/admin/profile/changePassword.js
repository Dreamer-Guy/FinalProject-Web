document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        const response = await fetch('/admin/profile/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            Toastify({
                text: data.message || "Password changed successfully",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#4caf50"
                }
            }).showToast();
            
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        } else {
            Toastify({
                text: data.message || "An error occurred",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#f44336"
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
                background: "#f44336"
            }
        }).showToast();
    }
});
