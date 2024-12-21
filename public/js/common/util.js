function handleSearch(){
    const value=document.getElementById('search').value;
    window.location.href=`/products/get?search=${encodeURIComponent(value)}`;
}


document.getElementById('search').addEventListener('keypress',function(e){
    if(e.key==='Enter'){
        handleSearch();
    }
});