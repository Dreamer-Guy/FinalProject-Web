document.getElementById('addBrandForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const brandName = document.getElementById('brandName').value;
    
    try {
        const response = await fetch('/admin/brands/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: brandName })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Brand added successfully!', 'success');
            window.location.href = '/admin/brands';
        } else {
            showToast(data.message || 'Error adding brand', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error adding brand', 'error');
    }
});
