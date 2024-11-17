const updateCartItems=async (productId,quantity) => {
    try{
        const res=await fetch('/carts/updateItems',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId,quantity})
        });
        if(res.ok){
            window.location.href="/carts/get";
        }
    }
    catch(e){

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