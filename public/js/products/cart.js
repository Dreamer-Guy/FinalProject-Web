
const handleAddToCart = async (productId,quantity=1) => {
    try{
        showSpinnerLoading();
        const res=await fetch('/carts/addItems',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId,quantity})
        });
        hideSpinnerLoading();
        const data=await res.json();
        if(res.ok){
            showToast('Item added to cart successfully','default');
            const cartNumber=$('#cart-number');
            cartNumber.text(data.cartNumber);
        }
        else{
            showToast(data.message,'warning');
        }
    }
    catch(e){
        console.log(e);
        showToast(e.message,'warning');
    }
};