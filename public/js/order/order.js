

const orderIdsToPay=[];
let currentPage=1;

const handleGetOrderDetails=(id)=>{
    window.location.href=`/orders/get/${id}`;
}

const handleChooseOrders=(id)=>{
    const index=orderIdsToPay.findIndex(orderId=>orderId===id);
    if(index===-1){
        orderIdsToPay.push(id);
        toggleDisablePayButton();
        return;
    }
    orderIdsToPay.splice(index,1);
    toggleDisablePayButton();
}

const handlePay=async (type)=>{
    if(orderIdsToPay.length===0){
        return alert('Please choose orders to pay');
    }
    console.log("here");
    try{
        showSpinnerLoading();
        const res= await fetch(`/payment/${type}/pay`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({orderIds:orderIdsToPay})
        });
        hideSpinnerLoading();
        if(res.ok){
            const data=await res.text();
            window.location.href=data;
        }
        else{
            showToast('There is something wrong just happened, please try again later','warning');
        }
    }
    catch(e){
        console.log(e);
    }
}

const toggleDisablePayButton=()=>{
    const buttionIds=["btn-pay"];
    buttionIds.forEach(id=>{
        const btn=document.getElementById(id);
        if(!btn){
            return;
        }
        if(orderIdsToPay.length===0){
            btn.classList.add('bg-gray-300');
            btn.disabled=true;
            return;
        }
        btn.classList.remove('bg-gray-300');
        btn.disabled=false;
    });
};

toggleDisablePayButton();


const handlePaging=async (page)=>{
    if(Number(page)===currentPage){
        return;
    };
    currentPage=Number(page);
    try{
        showSpinnerLoading();
        const res=await fetch(`/orders/get/api?page=${currentPage}`);
        hideSpinnerLoading();
        if(res.ok){
            const data=await res.json();
            const orders=data.orders;
            const totalOrders=data.totalOrders;
            const rowPerPage=data.rowPerPage;
            updateOrderListBigScreen(orders,totalOrders,rowPerPage);
            updateOrderListPhoneScreen(orders,totalOrders,rowPerPage);
            updateChoosenOrders();
            for(let i=1;i<=Math.ceil(totalOrders/rowPerPage);i++){
                document.getElementById(`order-btn-${i}`).classList.remove('bg-blue-300');
                if(i===currentPage){
                    document.getElementById(`order-btn-${i}`).classList.add('bg-blue-300');
                }
            }
        }
        else{
            showToast('There is something wrong just happened, please try again later','warning');
        }
    }
    catch(e){
        showSpinnerLoading('There is an unexpected error happened, please try again later','warning');
    }
};

const updateOrderListBigScreen=(orders,totalOrders,rowPerPage)=>{
    const orderContainer=$('#orders-container');
    orderContainer.empty();
    orders.forEach((order,i)=>{
        orderContainer.append(
        `
        <div class="w-full flex flex-row justify-between items-center ">
            <div class="w-1/12 flex flex-row justify-center items-center">
                <input 
                        type="checkbox" 
                        name="order" 
                        id="checkbox-order-${order._id}" 
                        value="${order._id}" 
                        class="hidden peer"
                        ${order.checkoutStatus.toLowerCase()==='paid' ? 'disabled' : ''}
                    />
                <label
                        onclick="handleChooseOrders('${order._id}')" 
                        for="checkbox-order-${order._id}" 
                        class="w-6 h-6 rounded-full border-2 ${order.checkoutStatus.toLowerCase()==='paid'?'hidden':''} 
                        border-gray-500 bg-white cursor-pointer flex justify-center items-center peer-checked:bg-blue-400
                        ${order.checkoutStatus.toLowerCase() === 'paid' ? 'pointer-events-none' : '' }">
                </label>
            </div>
            <div
                onclick="handleGetOrderDetails('${order._id}')" 
                class="flex flex-row gap-2 items-center justify-between bg-white 
                    border border-black rounded-lg text-sm p-2 w-11/12 cursor-pointer">
            <div class="w-1/4 break-words flex justify-center items-center">${i+1+(currentPage-1)*rowPerPage}</div>
            <div class="w-3/4 flex flex-row justify-between items-center flex-wrap">
                <div class="w-1/4 break-words flex justify-center 
                    items-center">${order.createdAt}</div>
                <div class="w-1/4 break-words flex justify-center items-center">
                    <span class="rounded-md p-2 border ${order.checkoutStatus.toLowerCase()==='unpaid'?'bg-red-500 border-red-500':'bg-green-500 border-green-400'}">
                        ${order.checkoutStatus.charAt(0).toUpperCase() + order.checkoutStatus.slice(1).toLowerCase()}</span>
                </div>
                        
                <div class="w-1/4 break-words flex justify-center 
                    items-center">
                    <span class="rounded-md p-2 border ${order.orderStatus.toLowerCase()==='pending'?'bg-yellow-200':'bg-blue-400'}">
                        ${order.orderStatus}</span>
                </div>
                <div class="w-1/4 break-words flex justify-center 
                    items-center">$${order.total}</div>
            </div>
            </div>
        </div>
        `);
    }); 
};


const updateOrderListPhoneScreen=(orders,totalOrders,rowPerPage)=>{
    const orderContainer=$('#orders-container-mobile');
    orderContainer.empty();
    orders.forEach((order,i)=>{
        orderContainer.append(
        `
        <div class="flex flex-row gap-1">
            <div class="w-1/12 flex flex-row justify-center items-center">
                <div class="flex flex-row justify-center items-center">
                    <input 
                        type="checkbox" 
                        name="order" 
                        id="checkbox-order-mobile-${order._id}" 
                        value="${order._id}" 
                        class="hidden peer"
                        ${order.checkoutStatus.toLowerCase()==='paid' ? 'disabled' : '' }
                    />
                    <label
                        onclick="handleChooseOrders('${order._id}')" 
                        for="checkbox-order-mobile-<%=order._id%>" 
                        class="w-6 h-6 rounded-full border-2 ${order.checkoutStatus.toLowerCase()==='paid'?'hidden':''} 
                        border-gray-500 bg-white cursor-pointer flex justify-center items-center peer-checked:bg-blue-400
                        ${order.checkoutStatus.toLowerCase() === 'paid' ? 'pointer-events-none' : '' }">
                    </label>
                </div>
            </div>
            <div
                onclick="handleGetOrderDetails('${order._id}')"  
                class="flex flex-col items-start border border-black rounded-md p-2 w-full gap-3">
                <div class="flex flex-row gap-3 justify-between items-center w-11/12" >
                    <div class="">
                        <span class="text-lg font-semibold">Order.No:</span> ${i+1+(currentPage-1)*rowPerPage}</div>
                    <div><span class="text-lg font-semibold">Total:</span> $${order.total}</div> 
                </div>
                <div><span class="text-lg font-semibold">Date:</span> ${order.createdAt}</div>
                <div><span class="text-lg font-semibold">Payment:</span> 
                    <span class="rounded-md p-1 border ${order.checkoutStatus.toLowerCase()==='unpaid'?'bg-red-500 border-red-500':'bg-green-500 border-green-400'}">${order.checkoutStatus}</span></div>
                <div><span class="text-lg font-semibold">Status:</span> 
                    <span class="rounded-md p-1 border ${order.orderStatus.toLowerCase()==='pending'?'bg-yellow-200':'bg-blue-400'}">${order.orderStatus}</span></div>
            </div>
        </div>
        `);
    });
};

const updateChoosenOrders=async()=>{
    orderIdsToPay.forEach(orderId=>{
        const checkbox=document.getElementById(`checkbox-order-${orderId}`);
        const checkboxMobile=document.getElementById(`checkbox-order-mobile-${orderId}`);
        if(checkbox){
            checkbox.checked=true;
        }
        if(checkboxMobile){
            checkboxMobile.checked=true;
        }
    });
};