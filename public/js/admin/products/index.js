const DEFAULT_PAGE = 1;
const ROW_PER_PAGE = 10;

let filters = {
    page: 1,
    rowPerPage: ROW_PER_PAGE
};

function setCurrentPage(page) {
    filters.page = page;
}

async function handleFilters(type, value) {
    if(type === 'page') {
        setCurrentPage(Number(value));
    }
    
    const queryParams = new URLSearchParams(filters).toString();
    try {
        const data = await fetch(`/admin/products/api/get?${queryParams}`)
            .then(response => response.json());
            
        const products = data.products;
        const totalProducts = data.totalProducts;
        
        // Update desktop table
        const productsContainer = document.querySelector('tbody');
        productsContainer.innerHTML = '';
        
        // Update mobile container
        const mobileContainer = document.getElementById('mobile-container');
        mobileContainer.innerHTML = '';
        
        products.forEach(product => {
            // Desktop view
            const tr = document.createElement('tr');
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
                    ${product.rating.toFixed(1)}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                        <button onclick="handleEditProduct('${product._id}')" 
                            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="handleDeleteProduct('${product._id}')"
                            class="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            productsContainer.appendChild(tr);

            // Mobile view
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow';
            card.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="flex-shrink-0">
                        <img src="${product.image}" alt="${product.name}" 
                            class="w-full sm:w-24 h-32 sm:h-24 object-cover rounded">
                    </div>
                    <div class="flex-1 space-y-2">
                        <h3 class="font-medium text-base sm:text-lg truncate">
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
                                <div class="text-sm text-gray-500">
                                    <span>Stock: ${product.totalStock}</span>
                                    <span class="mx-2">•</span>
                                    <span>Rating: ${product.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 pt-2">
                            <button onclick="handleEditProduct('${product._id}')" 
                                class="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                            <button onclick="handleDeleteProduct('${product._id}')"
                                class="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors">
                                <i class="fas fa-trash mr-1"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            mobileContainer.appendChild(card);
        });

        // Update pagination
        const totalPages = Math.ceil(totalProducts/ROW_PER_PAGE);
        const paginationContainer = $('#paging-container');
        paginationContainer.empty();

        // Prev button
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

        // First page if not in range
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
        
        // Page numbers
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
        console.log(e);
    }
}

// Load trang đầu tiên khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    handleFilters('page', DEFAULT_PAGE);
});