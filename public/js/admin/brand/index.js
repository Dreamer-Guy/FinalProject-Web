let currentPage = 1;
let currentSort = 'createdAt-desc';
const rowPerPage = 10;

const editModal = document.getElementById('editBrandModal');
const editForm = document.getElementById('editBrandForm');
const editBrandId = document.getElementById('editBrandId');
const editBrandName = document.getElementById('editBrandName');

function openEditModal(brandId, currentName) {
    editBrandId.value = brandId;
    editBrandName.value = currentName;
    editModal.classList.remove('hidden');
    editModal.classList.add('flex');
}

function closeEditDialog() {
    editModal.classList.remove('flex');
    editModal.classList.add('hidden');
    editForm.reset();
}

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const brandId = editBrandId.value;
    const newName = editBrandName.value;
    
    try {
        const response = await fetch(`/admin/brands/api/update/${brandId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Brand updated successfully', 'success');
            closeEditDialog();
            await updateTable();
        } else {
            showToast(data.message || 'Error updating brand', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error updating brand', 'error');
    }
});

async function fetchBrands() {
    try {
        const response = await fetch(`/admin/brands/api/get?page=${currentPage}&rowPerPage=${rowPerPage}&sort=${currentSort}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        return null;
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit'
    });
}

function renderBrandsTable(brands) {
    const tableBody = document.getElementById('brands-table-body');
    tableBody.innerHTML = '';

    brands.forEach(brand => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-3">${brand.name}</td>
            <td class="px-4 py-3">${formatDate(brand.createdAt)}</td>
            <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                    <button class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center" 
                            onclick="openEditModal('${brand._id}', '${brand.name}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center" 
                            onclick="deleteBrand('${brand._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderPagination(totalBrands, currentPage) {
    const totalPages = Math.ceil(totalBrands / rowPerPage);
    const paginationContainer = document.getElementById('paging-container');
    paginationContainer.innerHTML = '';

    if(currentPage > 1) {
        paginationContainer.innerHTML += `
            <button
                onclick="changePage(${currentPage-1})"
                class="hover:cursor-pointer w-8 sm:w-10 h-8 sm:h-10 border text-center border-black px-2 rounded-lg">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
    }

    let startPage;
    if (currentPage === 1) {
        startPage = 1;
    } else if (currentPage === totalPages) {
        startPage = Math.max(totalPages - 2, 1);
    } else {
        startPage = currentPage - 1;
    }

    for(let i = 0; i < 3 && startPage + i <= totalPages; i++) {
        const pageNum = startPage + i;
        paginationContainer.innerHTML += `
            <button onclick="changePage(${pageNum})"
                class="hover:cursor-pointer h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-lg border 
                ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} 
                border-gray-300 text-sm font-medium">
                ${pageNum}
            </button>
        `;
    }

    if(currentPage < totalPages) {
        paginationContainer.innerHTML += `
            <button
                onclick="changePage(${currentPage+1})"
                class="hover:cursor-pointer w-8 sm:w-10 h-8 sm:h-10 border text-center border-black px-2 rounded-lg">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
}

async function updateTable() {
    const data = await fetchBrands();
    if (data) {
        renderBrandsTable(data.brands);
        renderPagination(data.totalBrands, data.currentPage);
    }
}

async function changePage(newPage) {
    currentPage = newPage;
    await updateTable();
}

async function handleSort(value) {
    currentSort = value;
    currentPage = 1;
    await updateTable();
}

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('brands-table-body');
    if(tableBody) {
        updateTable();
    } else {
        console.error('Could not find brands-table-body element');
    }

    document.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditDialog();
        }
    });
});
