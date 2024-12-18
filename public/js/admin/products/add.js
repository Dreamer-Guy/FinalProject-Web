document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');
    const categorySelect = document.getElementById('categorySelect');
    const container = document.getElementById('categoryProperties');
    
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
        
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (key.startsWith('properties[')) {
                if (!data.properties) data.properties = {};
                const propId = key.match(/\[(.*?)\]/)[1];
                data.properties[propId] = value;
            } else {
                data[key] = value;
            }
        });

        try {
            const response = await fetch('/admin/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = '/admin/products';
                showToast('Product added successfully', 'success');
            } else {
                const error = await response.json();
                showToast(error.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('An error occurred while adding the product', 'error');
        }
    });
});