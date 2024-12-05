const handlePayment=async()=>{
    const selectedOrder = document.querySelector('input[name="orderId"]:checked');
    if(selectedOrder){
        try{
            const orderId=selectedOrder.value;
            const data={
                orderId:orderId,
            };
            const res=await fetch('/payment/paypal/pay',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(data),
            });
            if(res.ok){
                const response=await res.json();
                window.location.href=response.link;
            }
        }
        catch(e){
            console.log(e);
        }
    }
}