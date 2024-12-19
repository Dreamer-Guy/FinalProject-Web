let isEditMode = false;
const originalData = {
    name: document.getElementById('categoryName').value,
    properties: Array.from(document.querySelectorAll('#propertiesList input')).map(input => ({
        id: input.closest('[data-property-id]').dataset.propertyId,
        name: input.value
    }))
};

function toggleEditMode() {
    isEditMode = !isEditMode;
    
    document.getElementById('categoryName').disabled = !isEditMode;
    document.querySelectorAll('#propertiesList input').forEach(input => {
        input.disabled = !isEditMode;
    });
    
    document.getElementById('formActions').classList.toggle('hidden');
    document.getElementById('addPropertyBtn').classList.toggle('hidden');
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.classList.toggle('hidden');
    });
}

function addPropertyField() {
    const propertiesList = document.getElementById('propertiesList');
    const propertyDiv = document.createElement('div');
    propertyDiv.className = 'flex flex-wrap items-center gap-2 mb-2';
    
    propertyDiv.innerHTML = `
        <div class="flex-1">
            <input type="text" 
                   name="properties[]"
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

function showDeleteDialog(propertyId, deleteCallback) {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    dialog.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p class="mb-4">Are you sure you want to delete this property?</p>
            <div class="flex justify-end space-x-2">
                <button id="cancelBtn" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                <button id="confirmBtn" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        dialog.remove();
    });

    document.getElementById('confirmBtn').addEventListener('click', () => {
        deleteCallback(propertyId);
        dialog.remove();
    });
}

async function deleteProperty(button, propertyId) {
    showDeleteDialog(propertyId, async (propertyId) => {
        try {
            const response = await fetch(`/admin/categories/properties/${propertyId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                originalData.properties = originalData.properties.filter(prop => 
                    prop.id !== propertyId
                );
                
                const propertyContainer = button.closest('.flex');
                if (propertyContainer) {
                    propertyContainer.remove();
                }
                
                showToast('Property deleted successfully', 'success');
                
                window.location.reload();
            } else {
                const data = await response.json();
                showToast(data.message || 'Error deleting property', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error deleting property', 'error');
        }
    });
}

function cancelEdit() {
    document.getElementById('categoryName').value = originalData.name;
    
    const propertiesList = document.getElementById('propertiesList');
    propertiesList.innerHTML = originalData.properties.map(prop => `
        <div class="flex flex-wrap items-center gap-2" data-property-id="${prop.id}">
            <div class="flex-1">
                <input type="text" 
                       value="${prop.name}"
                       class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                       disabled>
            </div>
            <button type="button" 
                    onclick="deleteProperty('${prop.id}')"
                    class="shrink-0 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 hidden delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    toggleEditMode();
}

async function saveChanges() {
    const categoryId = new URL(window.location.href).pathname.split('/').pop();
    const categoryName = document.getElementById('categoryName').value;
    const properties = Array.from(document.querySelectorAll('#propertiesList [data-property-id]')).map(div => ({
        id: div.dataset.propertyId,
        name: div.querySelector('input').value
    }));

    try {
        const response = await fetch(`/admin/categories/${categoryId}`, {
            method: 'PUT',
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
            showToast('Changes saved successfully', 'success');

            originalData.name = categoryName;
            originalData.properties = properties;
            toggleEditMode();
        } else {
            if (data.message === 'Duplicate properties are not allowed') {
                document.getElementById('errorMessage').innerText = data.message;
                document.getElementById('errorMessage').classList.remove('hidden');
            } else {
                showToast(data.message || 'Error saving changes', 'error');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error saving changes', 'error');
    }
}

document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const categoryId = window.location.pathname.split('/').pop();
    const categoryName = document.getElementById('categoryName').value;
    const propertyInputs = document.querySelectorAll('#propertiesList input');
    
    const properties = Array.from(propertyInputs).map(input => {
        const propertyId = input.dataset.propertyId;
        
        if (!propertyId || propertyId === 'new') {
            return {
                name: input.value
            };
        }

        return {
            id: propertyId,
            name: input.value
        };
    });

    try {
        const response = await fetch(`/admin/categories/${categoryId}`, {
            method: 'PUT',
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
            showToast('Category updated successfully', 'success');
            setTimeout(() => {
                window.location.href = '/admin/categories';
            }, 1000);
        } else {
            showToast(data.message || 'Error updating category', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error updating category', 'error');
    }
});
