const map={
    'profile':'profile',
    'account':'account',
    'passwords':'passwords',
    'addresses':'addresses',
    'orders':'orders',
    'carts':'carts',
}



updateNavBarProfileStatus = ()=>{
    const url=window.location.href;
    for(const key in map){
        if(url.includes(key)){
            document.getElementById(map[key]).classList.add('text-primary');
            document.getElementById(map[key]).classList.remove('hover:text-primary');
        }else{
            document.getElementById(map[key]).classList.remove('text-primary');
            document.getElementById(map[key]).classList.add('hover:text-primary');
        }
    }
}

updateNavBarProfileStatus();