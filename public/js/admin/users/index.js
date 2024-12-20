const DEFAULT_PAGE = 1;
const ROW_PER_PAGE = 10;
let userIdToLock = null;
let filters = {
    page: 1,
    rowPerPage: ROW_PER_PAGE,
    sortFullName:null,
    sortEmail:null,
    sortCreatedAt:null
};
function handleSort(field){
    const sortFields = ["sortFullName","sortEmail","sortCreatedAt"]
    const otherSortFields = sortFields.filter(item => item !== field);
        if (!filters[field]) {
            filters[field] = 'asc';
        } else if (filters[field] === 'asc') {
            filters[field] = 'desc';
        } else {
            filters[field] = null;
        }
       otherSortFields.forEach(item => {
        filters[item] = null;
        updateSortIcons(`${field}Icon`, `${item}Icon`, filters[field]);
       })
    handleFilters('page', filters.page);
}
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
    const searchQuery = document.getElementById('searchInput').value;

    const queryParams = new URLSearchParams();
    queryParams.append('page', filters.page);
    queryParams.append('rowPerPage', filters.rowPerPage);
    if(searchQuery){
        queryParams.append('search', searchQuery);
    }
    if(filters.sortFullName){
        queryParams.append('sortFullName', filters.sortFullName);
    }
    if(filters.sortEmail){
        queryParams.append('sortEmail', filters.sortEmail);
    }
    if(filters.sortCreatedAt){
        queryParams.append('sortCreatedAt', filters.sortCreatedAt);
    }
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
            tr.onclick = () => showUserDetail(user._id);
            tr.className="hover:bg-red-100 cursor-pointer"
            tr.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap">
                    ${user.fullName}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${user.userName}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${user.email}
                </td>
                 <td class="px-4 py-4 whitespace-nowrap">
                    ${formatDateTime(user.createdAt)}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-center">
                    ${user.role}
                </td>
                <td class="p-4 font-bold ${getStatusColorClass(user.status)} bg-clip-content rounded-md  whitespace-nowrap text-center">
                    ${user.status}
                </td>
                ${user.status==="active"?`
                <td class="px-4 py-4 whitespace-nowrap">
                    <button onclick="event.stopPropagation(); showDialog('${user._id}')" 
                            class="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                           <i class="ri-indeterminate-circle-line"></i>
                    </button> 
                </td>`:
                `<td class="px-4 py-4 whitespace-nowrap">
                    <button onclick="event.stopPropagation(); unLockUser('${user._id}')" 
                            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            <i class="ri-lock-unlock-line"></i>
                    </button> 
                </td>
                `
                }
            `;
            usersContainer.appendChild(tr);
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow hover:bg-red-100 cursor-pointer px-10';
            card.onclick=()=>showUserDetail(user._id)
            card.innerHTML = `
                <div class="flex  sm:flex-row sm:items-center gap-3">
                    <div class="flex-1  items-center space-y-2">
                        <h3 class="font-bold text-base sm:text-lg truncate">
                            FullName: ${user.fullName}
                        </h3>
                        <p>
                            <span class="font-bold">UserName: </span>
                            ${user.userName}
                        </p>
                         <p>
                            <span class="font-bold">Email: </span>
                            ${user.email}
                        </p>
                         <p>
                            <span class="font-bold">Created At: </span>
                            ${formatDateTime(user.createdAt)}
                        </p>
                         <p>
                            <span class="font-bold">Role: </span>
                            ${user.role}
                        </p>
                         <p>
                            <span class="font-bold">Status: </span>
                            <span class="font-bold ${getStatusColorClass(user.status)}">
                                ${user.status}
                            </span>
                        </p>
                         <div class="flex justify-center items-center">
                    ${user.status==="active"?`
                        <td class="px-4  py-4 whitespace-nowrap">
                            <button onclick="event.stopPropagation(); showDialog('${user._id}')" 
                                    class="w-full max-w-96  bg-red-500 text-white p-2 rounded hover:bg-red-600">
                                   <i class="ri-indeterminate-circle-line"></i>
                            </button> 
                        </td>`:
                        `<td class="px-4 py-4 whitespace-nowrap">
                            <button onclick="event.stopPropagation(); unLockUser('${user._id}')" 
                                    class="w-full max-w-96  bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                    <i class="ri-lock-unlock-line"></i>
                            </button> 
                        </td>
                        `
                        }
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
async function showUserDetail(userId) {
    try {
        const response = await fetch(`/admin/users/api/detail/${userId}`);
        const data = await response.json();
        const user = data.user
        if (response.ok) {
            document.getElementById('detail-fullName').textContent = user.fullName;
            document.getElementById('detail-userName').textContent = user.userName;
            document.getElementById('detail-email').textContent = user.email;
            document.getElementById('detail-role').textContent = user.role;
            document.getElementById('detail-status').textContent = user.status;
            document.getElementById('detail-createdAt').textContent = formatDateTime(user.createdAt);
            document.getElementById('detail-totalOrders').textContent = data.totalOrder;
            document.getElementById('detail-totalSpent').textContent =  data.totalSpent;
            document.getElementById('detail-address').textContent = data.addressString
            const modal = document.getElementById('userDetailModal');
            modal.style.display = 'flex';
        } else {
            showToast(user.message || 'Error loading user details', 'error');
        }
    } catch (error) {
        console.error(error);
        showToast('Error loading user details', 'error');
    }
}

function closeUserDetailModal() {
    const modal = document.getElementById('userDetailModal');
    modal.style.display = 'none';
}
function clearFilters() {
    filters = {
        page: 1,
        rowPerPage: ROW_PER_PAGE,
        sortName:null,
        sortEmail:null
    };
    document.getElementById('sortNameIcon').className = 'fas fa-sort';
    document.getElementById('sortEmailIcon').className = 'fas fa-sort';
    document.getElementById('sortCreatedAtIcon').className = 'fas fa-sort';
    handleFilters();
}
function unLockUser(userId){
    userIdToLock =userId
    handleLockUser("active")
    handleFilters('page', filters.page);
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
function updateSortIcons(activeIconId, inactiveIconId, sortDirection) {
    const activeIcon = document.getElementById(activeIconId);
    const activeIconMobile = document.getElementById(activeIconId+"Mobile");
    const inactiveIcon = document.getElementById(inactiveIconId);
    const inactiveIconMobile = document.getElementById(inactiveIconId+"Mobile");
    inactiveIcon.className = 'fas fa-sort';
    inactiveIconMobile.className = 'fas fa-sort';
    if (sortDirection === 'asc') {
        activeIcon.className = 'fas fa-sort-up';    
        activeIconMobile.className = 'fas fa-sort-up';
    } else if (sortDirection === 'desc') {
        activeIcon.className = 'fas fa-sort-down';  
        activeIconMobile.className = 'fas fa-sort-down';
    } else {
        activeIcon.className = 'fas fa-sort';
        activeIconMobile.className = 'fas fa-sort';
    }
}
function getStatusColorClass(status) {
    switch(status) {
        case 'active':
            return 'text-blue-500';
        case 'locked':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
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


function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmLockBtn = document.getElementById('confirmLockBtn');
    if (confirmLockBtn) {
        confirmLockBtn.addEventListener('click', () => handleLockUser("locked"));
    }
    const searchButton = document.getElementById('searchButton');
    if(searchButton){
        searchButton.addEventListener('click', () => handleFilters('page', filters.page));
    }
    const searchInput = document.getElementById('searchInput');
    if(searchInput){
        searchInput.addEventListener('input', () => handleFilters('page', filters.page));
    }
    handleFilters('page', DEFAULT_PAGE);
});