const DEFAULT_PAGE = 1;
const ROW_PER_PAGE = 10;

let filters = {
    page: 1,
    rowPerPage: ROW_PER_PAGE,
    sort: 'createdAt-desc'
};

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
                <td class="px-4 py-3 text-sm">${category.name}</td>
                <td class="px-4 py-3 text-sm">${createdAt}</td>
                <td class="px-4 py-3 text-sm">
                    <div class="flex  space-x-2">
                        <button onclick="editCategory('${category._id}')" 
                                class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteCategory('${category._id}')"
                                class="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center">
                            <i class="fas fa-trash"></i>
                        </button>
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
                    class="px-3 py-1 rounded border hover:bg-gray-100">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === filters.page) {
            paginationHTML += `
                <button class="px-3 py-1 rounded bg-blue-500 text-white">
                    ${i}
                </button>
            `;
        } else {
            paginationHTML += `
                <button onclick="changePage(${i})" 
                        class="px-3 py-1 rounded border hover:bg-gray-100">
                    ${i}
                </button>
            `;
        }
    }

    if (filters.page < totalPages) {
        paginationHTML += `
            <button onclick="changePage(${filters.page + 1})" 
                    class="px-3 py-1 rounded border hover:bg-gray-100">
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

document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = filters.sort;
    }
    
    loadCategories();
});
