const DEFAULT_PAGE = 1;
const ROW_PER_PAGE = 10;

let filters = {
    page: 1,
    rowPerPage: ROW_PER_PAGE,
    status:null
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
    if(filters.status) {
        queryParams.append('status', filters.status);
    }
    try {
        showSpinnerLoading()
        const data = await fetch(`/admin/orders/api/get?${queryParams}`)
            .then(response => response.json());  
        hideSpinnerLoading()
        const orders = data.orders;
        const totalOrders = data.totalOrders;
        const ordersContainer = document.querySelector('tbody');
        ordersContainer.innerHTML = '';
        const mobileContainer = document.getElementById('mobile-container');
        mobileContainer.innerHTML = '';
        orders.forEach(order => {
            const tr = document.createElement('tr');
            
            tr.onclick = () => showOrderDetail(order._id);
            tr.className="hover:bg-red-100 cursor-pointer"
            tr.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap">
                    ${order._id}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    ${order.user}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-center">
                    ${order.productQuantity}
                </td>
                <td class="px-4 py-4 whitespace-nowrap ">
                    ${order.totalPrice}
                </td>
                <td class="${getStatusColorClass(order.status)} px-4 py-4 whitespace-nowrap font-semibold">
                    ${order.status}
                </td>
                <td class="${getCheckoutStatusColorClass(order.checkoutStatus)} px-4 py-4 whitespace-nowrap font-semibold">
                    ${order.checkoutStatus}
                </td>
                 <td class="px-4 py-4 whitespace-nowrap">
                    ${formatDateTime(order.createdAt)}
                </td>
            `;
            ordersContainer.appendChild(tr);
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow hover:bg-red-100 cursor-pointer px-10';
            card.onclick=()=>showOrderDetail(order._id)
            card.innerHTML = `
                <div class="flex flex-col gap-3">
                    <h3 class="font-bold text-base sm:text-lg truncate">
                        Order ID: ${order._id}
                    </h3>
                    <div class="flex flex-col justify-between sm:flex-row gap-4">
                        <div class="">
                            <p class="mb-2">
                                <span class="font-bold">Customer Name: </span>
                                ${order.user}
                            </p>
                            <p class="mb-2">
                                <span class="font-bold">Product Quantity: </span>
                                ${order.productQuantity}
                            </p>
                            <p class="mb-2">
                                <span class="font-bold">Total Price: </span>
                                ${order.totalPrice}
                            </p>
                        </div>
                        <div class="">
                            <p  class="mb-2">
                                <span class="font-bold">Status: </span>
                                <span class="${getStatusColorClass(order.status)}">                            
                                    ${order.status}
                                </span>
                            </p>
                            <p class="mb-2">
                                <span class="font-bold">Checkout Status: </span>
                                <span class="${getCheckoutStatusColorClass(order.checkoutStatus)}">
                                     ${order.checkoutStatus}
                                </span>
                            </p>
                            <p class="mb-2">
                                <span class="font-bold">Created At: </span>
                                ${formatDateTime(order.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            mobileContainer.appendChild(card);
            
        });
        const totalPages = Math.ceil(totalOrders/ROW_PER_PAGE);
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

async function showOrderDetail(orderId) {
    try{
        const orderDetailModal = document.getElementById('orderDetailModal');
        orderDetailModal.style.display = 'flex';
        showSpinnerLoading()
        const response = await fetch(`/admin/orders/api/detail/${orderId}`);
        const data = await response.json();
        hideSpinnerLoading()
        if(response.ok) {
           const orderDetailInfo=document.getElementById('orderDetailInfo')
           orderDetailInfo.innerHTML=`
                <div class=" w-full md:w-auto bg-green-100 p-4 rounded-lg" >
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold">User information</h4>
                        <button onclick="toggleSection('userInfo')" class=" md:hidden text-gray-600 hover:text-gray-800">
                            <i id="userInfoIcon" class="fas fa-chevron-up"></i>
                        </button>
                    </div>
                    <div id="userInfo">
                        <p><span class="font-bold">Full Name: </span> <span>${data.fullName}</span></p>
                        <p><span class="font-bold">Phone: </span> <span>${data.phone}</span></p>
                        <p><span class="font-bold">Postal Code: </span> <span>${data.postalCode}</span></p>
                        <p><span class="font-bold">Address: </span> <span>${data.address}</span></p>
                    </div>
                </div>
                <div class=" w-full md:w-auto mt-2 md:mt-0 bg-blue-100 p-4 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold">Order information</h4>
                        <button onclick="toggleSection('orderInfo')" class="md:hidden text-gray-600 hover:text-gray-800">
                            <i id="orderInfoIcon" class="fas fa-chevron-up"></i>
                        </button>
                    </div>
                    <div id="orderInfo">
                        <p><span class="font-bold">Status: </span> <span class=${getStatusColorClass(data.status)}>${data.status}</span></p>
                        <p><span class="font-bold">Checkout Status: </span> <span class=${getCheckoutStatusColorClass(data.checkoutStatus)}>${data.checkoutStatus}</span></p>
                        <p><span class="font-bold">Order ID: </span> <span>${data.orderId}</span></p>
                        <p><span class="font-bold">Order Date: </span> <span>${formatDateTime(data.createdAt)}</span></p>
                    </div>
                </div>`
            const productsContainer =document.getElementById('detail-products');
            productsContainer.innerHTML = data.items.map(item => `
               <div class="flex justify-between items-center border-b py-2">
                       <div class="flex gap-4 items-center">
                           <img src="${item.image}" alt="" class="w-16 h-16 object-cover rounded-md"/>
                           <div>
                               <p class="font-medium">${item.name}</p>
                               <p class="text-sm text-gray-600">Amount: ${item.quantity}</p>
                           </div>
                       </div>
                       <p class="font-medium text-red-500">$${item.price}</p>
                   </div>
               `).join('');
            document.getElementById('detail-total').textContent=`$${data.total}`;
            const updateStatusContainer = document.getElementById('updateStatusContainer')
            const btnUpdateStatus=document.getElementById('btnUpdateStatus')
            if(updateStatusContainer&&!btnUpdateStatus){
                const btn = document.createElement('div');
                btn.innerHTML = `
                <button id="btnUpdateStatus" onclick="updateStatus('${data.orderId}')" 
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update Status
                </button>
                `;
                updateStatusContainer.appendChild(btn.firstElementChild)
            }
        }
    }
    catch(e){
        console.log(e);
        showToast('Error loading order details', 'error');
    }

}
async function updateStatus(orderId){
 try{
    const status=document.getElementById('statusSelect').value;
    const response=await fetch(`/admin/orders/api/updateStatus/${orderId}`,{
        method:'PATCH',
        body:JSON.stringify({status}),
        headers:{
            'Content-Type':'application/json'
        }
    });
    if(response.ok){
        closeOrderDetailModal()
        showToast('Status updated successfully', 'success');
        handleFilters('page', filters.page);
    }
 }
 catch(e){
    console.log(e);
    showToast('Error updating status', 'error');
 }
}
function closeOrderDetailModal() {
    const modal = document.getElementById('orderDetailModal');
    modal.style.display = 'none';
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
function getStatusColorClass(status) {
    switch(status) {
        case 'pending':
            return 'text-yellow-500';
        case 'processing':
            return ' text-blue-500';
        case 'completed':
            return 'text-green-500';
        case 'canceled':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
}
function getCheckoutStatusColorClass(status) {
    switch(status) {
        case 'paid':
            return 'text-green-500';
        case 'refunded':
            return 'text-blue-500';
        case 'unpaid':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
}
function initializeOrderPage(status){
    filters.status = status;
    handleFilters('page', DEFAULT_PAGE);
}
document.addEventListener('DOMContentLoaded', () => {
    const pageStatus=document.body.dataset.status;
    initializeOrderPage(pageStatus);
});

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(`${sectionId}Icon`);
    const isHidden = section.style.display !== 'none';
    
    section.style.display = isHidden ? 'none' : 'block';
    icon.classList.toggle('fa-chevron-up', !isHidden);
    icon.classList.toggle('fa-chevron-down', isHidden);
}