const displayPriceOfItem=(item)=>{
    if(item.productId.salePrice>0){
        return `
        <div class="text-primary text-lg font-semibold">$${item.productId.salePrice}</div>
        <div class="text-gray-700 text-lg font-semibold line-through">$${item.productId.price}</div>`;
    }
    else{
        return `<div class="text-black text-lg font-semibold">${item.productId.price}</div>`;
    }
};

const calculateTotal=(items)=>{
    const total=items.reduce((acc,item)=>{
        if(item.productId.salePrice>0){
            return acc+item.productId.salePrice*item.quantity;
        }
        return acc+item.productId.price*item.quantity;
    },0);
    return total;
}


const displayTotalOfItemForSummary=(item)=>{
    if(item.productId.salePrice>0){
        return `
        <p class="text-gray-800 font-medium">$${item.productId.salePrice*item.quantity}</p>
        `;
    }
    else{
        return `
        <p class="text-gray-800 font-medium">$${item.productId.price*item.quantity}</p>
        `;
    }
}
const createSummaryItem=(item)=>{
    return `
    <div class="flex justify-between bg-white border border-black rounded-md p-2 items-center">
        <div class="w-3/6">
            <h5 class="text-gray-800 font-medium break-words break-all">${item.productId.name}</h5>
        </div>
        <p class="w-1/6 text-gray-600 flex flex-row justify-center">
            x${item.quantity}
        </p>
        <div class="w-2/6 flex flex-row justify-end">
            ${displayTotalOfItemForSummary(item)}
        </div>
    </div>
    `;
};

const createCartItem=(item)=>{
    return `
    <div
        class="hover:cursor-pointer w-full flex flex-col md:flex-row items-center justify-between border gap-3 md:gap-6 p-4 border-gray-200 rounded">
        <div
            onclick="window.location.href='/productDetails/get/${item.productId._id}'"  
            class="w-full md:w-3/5 flex flex-row justify-between items-center gap-3 break-words">
            <div class="w-1/5">
                <img src="${item.productId.image}" alt="product 6" class="w-[60px] h-[60px] object-cover">
            </div>
            <div class="w-4/5 flex flex-col justify-center items-end gap-1">
                <h2 class="text-gray-800 text-lg font-medium uppercase break-words break-all">${item.productId.name}</h2>
                <p class="text-gray-500 text-sm">Availability: <span class="text-green-600">${item.productId.totalStock}</span></p>
            </div>
        </div>

        <div class="w-full md:w-2/5 flex flex-row gap-4 justify-center md:justify-end items-center">
            <div class="flex flex-row justify-center gap-4">
                ${displayPriceOfItem(item)}
            </div>
            <div class="flex flex-row gap-2 justify-center items-center">
                <button
                    onclick="updateCartItems('${item.productId._id}','${item.quantity-1}')" 
                    class="p-2 border border-black w-[35px] h-[35px] 
                    flex justify-center items-center rounded-xl ">-</button>
                <span class="p-2 w-[35px] h-[35px] flex justify-center items-center">${item.quantity}</span>
                <button 
                onclick="updateCartItems('${item.productId._id}','${item.quantity+1}')"
                    class="p-2 border border-black w-[35px] h-[35px] 
                    flex justify-center items-center rounded-xl ">+</button>
            </div>

            <div
                onclick="deleteCartItems('${item.productId._id}')" 
                class="text-gray-600 cursor-pointer hover:text-primary">
                <i class="fa-solid fa-trash"></i>
            </div>
        </div>
    </div>
    `;
};

const reloadCartITems=(items)=>{
    const cartContainer=document.getElementById('cart-container');
    cartContainer.innerHTML='';
    items.forEach(item=>{
        if(!item.productId.isDeleted){
            const cartItemHtml=createCartItem(item);
            const tempContainer=document.createElement('div');
            tempContainer.innerHTML=cartItemHtml;
            cartContainer.appendChild(tempContainer);
        }
    });
};
const reloadSummaryItems=(items)=>{
    const summaryContainer=document.getElementById('order-summary-container');
    summaryContainer.innerHTML='';
    items.forEach(item=>{
        const summaryItemHtml=createSummaryItem(item);
        const tempContainer=document.createElement('div');
        tempContainer.innerHTML=summaryItemHtml;
        summaryContainer.appendChild(tempContainer);
    });
};
const reloadTotal=(items)=>{
    document.getElementById('total').textContent=`$${calculateTotal(items)}`;
};

const updateCartItems=async (productId,quantity) => {
    try{
        showSpinnerLoading();
        const res=await fetch('/carts/updateItems',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId,quantity})
        });
        hideSpinnerLoading();
        const data=await res.json();
        if(res.ok){
            const cart=data.cart;
            reloadCartITems(cart.items);
            reloadTotal(cart.items);
            reloadSummaryItems(cart.items);
            showToast('Update cart successfully','success');
        }
        else{
            showToast(data.message,'warning');
        }
    }
    catch(e){
        console.log(e.message);
    }
};

const deleteCartItems=async (productId) => {
    try{
        const res=await fetch('/carts/deleteItems',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
        });
        if(res.ok){
            window.location.href="/carts/get";
        }
    }
    catch(e){

    }
};

const handleCloseDialog=(id)=>{
    document.getElementById(id).classList.add('hidden');
}

const handleOpenDialog=(id)=>{
    document.getElementById(id).classList.remove('hidden');
};

const placeOrder=async()=>{
    try{
        showSpinnerLoading();
        const res=await fetch('/orders/create',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
        });
        hideSpinnerLoading();
        if(res.ok){
            showToast('Order placed successfully','success');
            setTimeout(()=>{
                window.location.href="/orders/get";
            },1500);
        }
        else{
            const data=await res.json();
            showToast(data.message,'warning');
        }
    }
    catch(e){
        console.log(e.message);
    }
};