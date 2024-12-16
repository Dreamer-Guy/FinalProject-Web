

const handleEditProduct = (productId) => {
    window.location.href = `/admin/products/edit/${productId}`;
}

const handleDeleteProduct = async (productId) => {
    if(confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`/admin/products/${productId}`, {
                method: 'DELETE'
            });
            if(response.ok) {
                window.location.reload();
            }
        } catch(error) {
            console.error('Error:', error);
        }
    }
}