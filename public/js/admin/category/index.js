const DEFAULT_PAGE = 1;
const ROW_PER_PAGE = 10;

let filters = {
    page: 1,
    rowPerPage: ROW_PER_PAGE,
    sort: 'createdAt-desc'
};

let categoryIdToDelete = null;

async function loadCategories() {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', filters.page);
        queryParams.append('rowPerPage', filters.rowPerPage);
        queryParams.append('sort', filters.sort);

        const response = await fetch(`/admin/categories/api/get?${queryParams}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error occurred while loading categories');
        }

        displayCategories(data.categories);
        displayPagination(data.totalCategories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function handleSort(value) {
    filters.sort = value;
    filters.page = 1;
    loadCategories();
}

function displayCategories(categories) {
    const tableBody = document.getElementById('categories-table-body');
    tableBody.innerHTML = '';

    categories.forEach(category => {
        const createdAt = new Date(category.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit'
        });
        
        const row = `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">
                    <a href="/admin/categories/${category._id}" 
                       class="text-blue-500 hover:text-blue-700">
                        ${category.name}
                    </a>
                </td>
                <td class="px-4 py-3 text-sm">${createdAt}</td>
                <td class="px-4 py-3 text-sm">
                    <div class="flex space-x-2">
                        ${category.name !== 'Other' ? `
                            <button onclick="window.location.href='/admin/categories/${category._id}'" 
                                    class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        ${category.name !== 'Other' ? `
                            <button onclick="showDeleteDialog('${category._id}')"
                                    class="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function displayPagination(totalCategories) {
    const totalPages = Math.ceil(totalCategories / ROW_PER_PAGE);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    let paginationHTML = '<div class="flex justify-center space-x-2">';

    if (filters.page > 1) {
        paginationHTML += `
            <button onclick="changePage(${filters.page - 1})" 
                    class="hover:cursor-pointer w-8 sm:w-10 h-8 sm:h-10 border text-center border-black px-2 rounded-lg">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === filters.page) {
            paginationHTML += `
                <button class="hover:cursor-pointer h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-lg border bg-blue-500 text-white border-gray-300 text-sm font-medium">
                    ${i}
                </button>
            `;
        } else {
            paginationHTML += `
                <button onclick="changePage(${i})" 
                        class="hover:cursor-pointer h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-lg border bg-white text-gray-700 border-gray-300 text-sm font-medium">
                    ${i}
                </button>
            `;
        }
    }

    if (filters.page < totalPages) {
        paginationHTML += `
            <button onclick="changePage(${filters.page + 1})" 
                    class="hover:cursor-pointer w-8 sm:w-10 h-8 sm:h-10 border text-center border-black px-2 rounded-lg">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    filters.page = page;
    loadCategories();
}

function showDeleteDialog(categoryId) {
    categoryIdToDelete = categoryId;
    const dialog = document.getElementById('deleteDialog');
    dialog.style.display = 'flex';
}

function closeDeleteDialog() {
    const dialog = document.getElementById('deleteDialog');
    dialog.style.display = 'none';
    categoryIdToDelete = null;
}

async function handleDeleteCategory() {
    if (!categoryIdToDelete) return;

    try {
        const response = await fetch(`/admin/categories/${categoryIdToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();

        if (response.ok) {
            closeDeleteDialog();
            loadCategories();
            showToast('Category deleted successfully', 'success');
        } else {
            showToast(data.message || 'Error deleting category', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error deleting category', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = filters.sort;
    }
    
    loadCategories();

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleDeleteCategory);
    }
});
