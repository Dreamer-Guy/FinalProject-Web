const DEFAULT_PAGE = 1;
const ROW_PER_PAGE = 10;
let userIdToLock = null;
let filters = {
    page: 1,
    rowPerPage: ROW_PER_PAGE,
};
function setCurrentPage(page) {
    filters.page = page;
}
async function handleFilters(type, value) {
    if(type !== 'page') {
        filters.page = 1;
    }
    if(type === 'page') {
        setCurrentPage(Number(value));
    }
    const queryParams = new URLSearchParams();
    queryParams.append('page', filters.page);
    queryParams.append('rowPerPage', filters.rowPerPage);
    try {
        const data = await fetch(`/admin/users/api/get?${queryParams}`)
            .then(response => response.json());  
        const users = data.users;
        const totalUsers = data.totalUsers;
        const usersContainer = document.querySelector('tbody');
        usersContainer.innerHTML = '';
        const mobileContainer = document.getElementById('mobile-container');
        mobileContainer.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap">
                    <img src="${user.avatar}" alt="Avatar" class="h-12 w-12 object-cover rounded">
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${user.fullName}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${user.userName}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-center">
                    ${user.role}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-center">
                    ${user.status}
                </td>
                ${user.status==="active"?`
                <td class="px-4 py-4 whitespace-nowrap">
                    <button onclick="showDialog('${user._id}')" 
                            class="bg-red-500 text-white p-2 rounded hover:bg-blue-600">
                           <i class="ri-indeterminate-circle-line"></i>
                    </button> 
                </td>`:
                `<td class="px-4 py-4 whitespace-nowrap">
                    <button onclick="handleUnLockUser()" 
                            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            <i class="ri-lock-unlock-line"></i>
                    </button> 
                </td>
                `
                }
            `;
            usersContainer.appendChild(tr);
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow';
            card.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="flex-shrink-0">
                        <img src="${user.avatar}" alt="${user.fullName}" 
                            class="w-full sm:w-24 h-32 sm:h-24 object-cover rounded">
                    </div>
                    <div class="flex-1 space-y-2">
                        <h3 class="font-medium text-base sm:text-lg truncate">
                            ${user.fullName}
                        </h3>
                        <div class="flex items-center justify-between">
                            <div class="space-y-1">
                                <div class="text-sm text-gray-500">
                                    <span>Username: ${user.userName}</span>
                                    <span class="mx-2">•</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            mobileContainer.appendChild(card);
        });
        const totalPages = Math.ceil(totalUsers/ROW_PER_PAGE);
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
        console.log(e);
    }
}
function clearFilters() {
    filters = {
        page: 1,
        rowPerPage: ROW_PER_PAGE,
    };
    handleFilters();
}
function showDialog(userId) {
    userIdToLock = userId;
    const dialog = document.getElementById('deleteDialog');
    dialog.style.display = 'flex';
}

function closeDialog() {
    const dialog = document.getElementById('deleteDialog');
    dialog.style.display = 'none';
    userIdToLock = null;
}

async function handleLockUser(status) {
    if (!userIdToLock) return;

    try {
        const response = await fetch(`/admin/users/api/lock/${userIdToLock}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
            ,
             body: JSON.stringify({status:status}),
        });
        
        const data = await response.json();

        if (response.ok) {
            closeDialog();
            handleFilters('page', filters.page);
            
            showToast('User locked successfully','success');
        } else {
            showToast(data.message || 'Error lock user','error');
        }
    } catch (error) {
        console.log(error);
        showToast('Error locking product','error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmLockBtn = document.getElementById('confirmLockBtn');
    if (confirmLockBtn) {
        confirmLockBtn.addEventListener('click', handleLockUser("lock"));
    }
    handleFilters('page', DEFAULT_PAGE);
});