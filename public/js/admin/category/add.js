function addPropertyField() {
    const propertiesList = document.getElementById('propertiesList');
    const propertyDiv = document.createElement('div');
    propertyDiv.className = 'flex flex-wrap items-center gap-2 mb-2';
    
    const propertyCount = propertiesList.children.length;
    
    propertyDiv.innerHTML = `
        <div class="flex-1 min-w-[200px]">
            <input type="text" 
                   name="properties[${propertyCount}]"
                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                   placeholder="Property name"
                   required>
        </div>
        <button type="button" 
                onclick="this.parentElement.remove()"
                class="shrink-0 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    propertiesList.appendChild(propertyDiv);
}

document.getElementById('addCategoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const categoryName = document.getElementById('categoryName').value;
    const propertyInputs = document.querySelectorAll('#propertiesList input');
    const properties = Array.from(propertyInputs).map(input => input.value);
    
    try {
        const response = await fetch('/admin/categories/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: categoryName,
                properties: properties
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Category added successfully', 'success');
            window.location.href = '/admin/categories';
        } else {
            showToast(data.message || 'Error adding category', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error adding category', 'error');
    }
});
