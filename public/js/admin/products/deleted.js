const DEFAULT_PAGE = 1;
const ROW_PER_PAGE = 10;

let filters = {
    page: 1,
    rowPerPage: ROW_PER_PAGE,
    sort: 'createdAt-desc',
    categories: [],
    brands: [],
    minPrice: '',
    maxPrice: '',
};

function handleCategoryChange(checkbox) {
    if (checkbox.checked) {
        filters.categories.push(checkbox.value);
    } else {
        filters.categories = filters.categories.filter(cat => cat !== checkbox.value);
    }
    filters.page = 1;
    handleFilters();
}

function handleBrandChange(checkbox) {
    if (checkbox.checked) {
        filters.brands.push(checkbox.value);
    } else {
        filters.brands = filters.brands.filter(brand => brand !== checkbox.value);
    }
    filters.page = 1;
    handleFilters();
}

async function handleFilters(type, value) {
    if(type !== 'page') {
        filters.page = 1;
    }
    
    if(type === 'page') {
        filters.page = Number(value);
    }
    if(type === 'sort') {
        filters.sort = value;
    }
    if(type === 'minPrice') {
        filters.minPrice = value;
    }
    if(type === 'maxPrice') {
        filters.maxPrice = value;
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', filters.page);
    queryParams.append('limit', filters.rowPerPage);
    queryParams.append('sort', filters.sort);
    
    if (filters.categories.length > 0) {
        queryParams.append('categories', filters.categories.join(','));
    }
    if (filters.brands.length > 0) {
        queryParams.append('brands', filters.brands.join(','));
    }
    if (filters.minPrice) {
        queryParams.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
        queryParams.append('maxPrice', filters.maxPrice);
    }

    try {
        const data = await fetch(`/admin/products/api/deleted?${queryParams}`)
            .then(response => response.json());
            
        if (!data || !data.products) {
            console.error('Invalid data received:', data);
            showToast('Error loading products', 'error');
            return;
        }

        const products = data.products;
        const totalProducts = data.totalProducts;

        const productsContainer = document.querySelector('tbody');
        if (!productsContainer) {
            console.error('Products container not found');
            return;
        }
        productsContainer.innerHTML = '';

        const mobileContainer = document.getElementById('mobile-container');
        if (!mobileContainer) {
            console.error('Mobile container not found');
            return;
        }
        mobileContainer.innerHTML = '';
        
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.className = 'cursor-pointer hover:bg-gray-50';
            tr.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap">
                    <img src="${product.image}" alt="${product.name}" class="h-12 w-12 object-cover rounded">
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${product.name}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${product.salePrice > 0 ? 
                        `<div class="text-red-500 line-through">$${product.price}</div>
                         <div>$${product.salePrice}</div>` :
                        `<div>$${product.price}</div>`
                    }
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-center">
                    ${product.totalStock}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-center">
                    <span class="${getStatusColorClass(product.status)} px-2 py-1 rounded-full text-xs">
                        ${product.status}
                    </span>
                </td>
                <td class="flex justify-center px-4 py-4 whitespace-nowrap text-center">
                    <button onclick="handleRestore('${product._id}')"
                        class="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center">
                        <i class="fas fa-undo"></i>
                    </button>
                </td>
            `;
            productsContainer.appendChild(tr);

            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50';
            card.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="flex-shrink-0">
                        <img src="${product.image}" alt="${product.name}" 
                            class="w-full sm:w-24 h-auto sm:h-24 object-cover rounded">
                    </div>
                    <div class="flex-1 space-y-2">
                        <h3 class="font-medium text-base sm:text-lg text-wrap">
                            ${product.name}
                        </h3>
                        <div class="flex items-center justify-between">
                            <div class="space-y-1">
                                <div class="text-sm">
                                    ${product.salePrice > 0 ? 
                                        `<span class="text-red-500 line-through">$${product.price}</span>
                                        <span class="ml-2 font-medium">$${product.salePrice}</span>` :
                                        `<span class="font-medium">$${product.price}</span>`
                                    }
                                </div>
                                <div class="flex flex-wrap text-sm text-gray-500">
                                    <span>Stock: ${product.totalStock}</span>
                                    <span class="mx-2">•</span>
                                    <span class="${getStatusColorClass(product.status)} px-2 py-1 rounded-full text-xs">
                                        ${product.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 pt-2">
                            <button onclick="handleRestore('${product._id}')" 
                                class="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors gap-2">
                                <i class="fas fa-undo mr-1"></i>
                                <span>Restore</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            mobileContainer.appendChild(card);
        });

        const totalPages = Math.ceil(totalProducts/ROW_PER_PAGE);
        const paginationContainer = $('#paging-container');
        paginationContainer.empty();

        if(filters.page > 1) {
            paginationContainer.append(`
                <button
                    onclick="handleFilters('page', ${filters.page-1})"
                    class="hover:cursor-pointer w-8 sm:w-10 h-8 sm:h-10 border text-center border-black px-2 rounded-lg">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `);
        }
        
        let startPage = filters.page - 1;
        if(startPage < 1) startPage = 1;
        if(startPage > totalPages - 2) startPage = totalPages - 2;
        if(startPage < 1) startPage = 1;

        if(startPage > 1) {
            paginationContainer.append(`
                <button onclick="handleFilters('page', 1)"
                    class="hover:cursor-pointer h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-lg border 
                    border-gray-300 text-sm font-medium">
                    1
                </button>
                ${startPage > 2 ? '<span class="px-2">...</span>' : ''}
            `);
        }

        for(let i = 0; i < 3 && startPage + i <= totalPages; i++) {
            const pageNum = startPage + i;
            paginationContainer.append(`
                <button onclick="handleFilters('page', ${pageNum})"
                    class="hover:cursor-pointer h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-lg border 
                    ${filters.page === pageNum ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} 
                    border-gray-300 text-sm font-medium">
                    ${pageNum}
                </button>
            `);
        }
        
        if(startPage + 2 < totalPages) {
            paginationContainer.append(`
                ${startPage + 3 < totalPages ? '<span class="px-2">...</span>' : ''}
                <button onclick="handleFilters('page', ${totalPages})"
                    class="hover:cursor-pointer h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center rounded-lg border 
                    border-gray-300 text-sm font-medium">
                    ${totalPages}
                </button>
            `);
        }
        
        if(filters.page < totalPages) {
            paginationContainer.append(`
                <button
                    onclick="handleFilters('page', ${filters.page+1})"
                    class="hover:cursor-pointer w-8 sm:w-10 h-8 sm:h-10 border text-center border-black px-2 rounded-lg">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `);
        }

    } catch(e) {
        console.error('Error:', e);
        showToast('Error loading products', 'error');
    }
}

function clearFilters() {
    filters = {
        page: 1,
        rowPerPage: ROW_PER_PAGE,
        sort: 'createdAt-desc',
        categories: [],
        brands: [],
        minPrice: '',
        maxPrice: ''
    };

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    handleFilters();
}

function getStatusColorClass(status) {
    switch(status) {
        case 'On stock':
            return 'bg-green-100 text-green-800';
        case 'Out of stock':
            return 'bg-red-100 text-red-800';
        case 'Suspended':
            return 'bg-yellow-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

async function handleRestore(productId) {
    try {
        const response = await fetch(`/admin/products/api/restore/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showToast('Product restored successfully', 'success');
            handleFilters();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error restoring product', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleFilters('page', DEFAULT_PAGE);
});
