

const orderIdsToPay=[];


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
