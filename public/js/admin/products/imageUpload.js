const previewImage = (file) => {
    const preview = document.getElementById('preview-image');
    const uploadIcon = document.getElementById('upload-icon');
    const reader = new FileReader();

    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.classList.remove('hidden');
        uploadIcon.classList.add('hidden');
    };

    reader.readAsDataURL(file);
};

const handleImageUpload = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/admin/products/upload-image', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        showToast('Error uploading image: ' + error.message, 'error');
        throw error;
    }
};

document.getElementById('image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        previewImage(file);
    }
});
