function handleSearch(){
    const value=document.getElementById('search').value;
    window.location.href=`/products/get?search=${encodeURIComponent(value)}`;
}