const decodeHtmlEncodedString = (str) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return JSON.parse(txt.value);
};
let alternativeImages=[];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('editProductForm');
    const categorySelect = document.getElementById('categorySelect');
    const container = document.getElementById('categoryProperties');
    const previewImage = document.getElementById('preview-image');
    const uploadIcon = document.getElementById('upload-icon');
    const removeImageBtn = document.getElementById('remove-image');
    const currentImageInput = document.getElementById('current-image');
    const imageUploadInput = document.getElementById('image-upload');
    
    let isImageRemoved = false;
    
    removeImageBtn.addEventListener('click', () => {
        previewImage.src = '';
        previewImage.classList.add('hidden');
        uploadIcon.classList.remove('hidden');
        currentImageInput.value = '';
        imageUploadInput.value = '';
        isImageRemoved = true;
    });

    imageUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            previewImage.src = URL.createObjectURL(file);
            previewImage.classList.remove('hidden');
            uploadIcon.classList.add('hidden');
            isImageRemoved = false;
        }
    });

    const clearProperties = () => {
        container.innerHTML = '';
    };

    categorySelect.addEventListener('change', async () => {
        const categoryId = categorySelect.value;
        clearProperties();
        if (!categoryId) return;
        
        try {
            const response = await fetch(`/admin/categories/${categoryId}/properties`);
            if (!response.ok) {
                throw new Error('Failed to load category properties');
            }
            
            const properties = await response.json();
            
            if (properties && properties.length > 0) {
                container.innerHTML = `
                    <h4 class="text-lg text-gray-700 font-medium mb-4">Category Properties</h4>
                    ${properties.map(prop => `
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-medium mb-2">${prop.name}</label>
                            <input type="text" name="properties[${prop._id}]" 
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                        </div>
                    `).join('')}
                `;
            }
        } catch (error) {
            console.error('Error loading category properties:', error);
            showToast('Error loading category properties', 'error');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const imageFile = imageUploadInput.files[0];
            let imageUrl = null;
            
            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile);
            } else if (currentImageInput.value && !isImageRemoved) {
                imageUrl = currentImageInput.value;
            }

            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                price: Number(formData.get('price')),
                salePrice: Number(formData.get('salePrice')) || 0,
                totalStock: Number(formData.get('totalStock')) || 0,
                description: formData.get('description'),
                category_id: formData.get('category_id'),
                brand_id: formData.get('brand_id'),
                status: formData.get('status'),
            };
            
            formData.forEach((value, key) => {
                if (key.startsWith('properties[')) {
                    if (!data.properties) data.properties = {};
                    const propId = key.match(/\[(.*?)\]/)[1];
                    data.properties[propId] = value;
                }
            });

            if (imageUrl) {
                data.image = imageUrl;
            } else if (isImageRemoved) {
                data.image = null;
            }

            data.imagesProduct=alternativeImages;

            const productId = window.location.pathname.split('/').pop();
            const response = await fetch(`/admin/products/api/update/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = '/admin/products';
                showToast('Product updated successfully', 'success');
            } else {
                const error = await response.json();
                showToast(error.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('An error occurred while updating the product', 'error');
        }
    });
});


const createAlternativeImageElement=(url)=>{
    return `
    <div
        id="alternative-image-${encodeURIComponent(url)}" 
        class="relative w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center">
        <img src="${url}" alt="" class="w-full h-full object-cover rounded-lg">
        <button type="button" 
                class="absolute w-7 h-7 top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onclick="handleRemoveAlternativeImageByUrl('${url}')">
            <i class="fas fa-times"></i>
        </button>
    </div>
    `;
};


const handleChangeAlternativeImages=async(event)=>{
    try{
        event.preventDefault();
        const imageUrl=await handleImageUpload(event.target.files[0]);
        alternativeImages.push(imageUrl);
        const alternativeImageContainer=document.getElementById('altertive-images-container');
        alternativeImageContainer.innerHTML+=createAlternativeImageElement(imageUrl);
    }
    catch(error){
        console.error('Error:',error);
        showToast('An error occurred while uploading the image please try again','error');
    }
};


const getInitAlternativeImage=()=>{
    alternativeImages=decodeHtmlEncodedString(encodedAlternativeImages);
};

const handleRemoveAlternativeImageByUrl=(url)=>{
    const index=alternativeImages.findIndex(img=>img===url);
    alternativeImages.splice(index,1);
    const encodedUrl = encodeURIComponent(url);
    document.getElementById(`alternative-image-${encodedUrl}`)?.remove();
};

getInitAlternativeImage();