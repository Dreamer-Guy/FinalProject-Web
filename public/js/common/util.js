function handleSearch(){
    const value=document.getElementById('search').value;
    window.location.href=`/products/search?search=${encodeURIComponent(value)}`;
}