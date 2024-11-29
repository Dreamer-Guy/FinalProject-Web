const map={
    'profile':'profile',
    'account':'account',
    'changePassword':'passwords',
    'addresses':'addresses',
    'orders':'orders',
    'carts':'carts',
    'reviews':'reviews',
}



updateNavBarProfileStatus = ()=>{
    const url=window.location.href;
    // for(const key in map){
    //     if(url.includes(key)){
    //         document.getElementById(map[key]).classList.add('text-primary');
    //         document.getElementById(map[key]).classList.remove('hover:text-primary');
    //     }else{
    //         document.getElementById(map[key]).classList.remove('text-primary');
    //         document.getElementById(map[key]).classList.add('hover:text-primary');
    //     }
    // }
    for(const key in map){
        if(url.includes(key)){
            const elements = document.getElementsByClassName(map[key]); // map[key] contains the class name
            for (const element of elements) {
                element.classList.add('text-primary');
                element.classList.remove('hover:text-primary');
            }
        }else{
            const elements = document.getElementsByClassName(map[key]); // map[key] contains the class name
            for (const element of elements) {
                element.classList.remove('text-primary');
                element.classList.add('hover:text-primary');
            }
        }
    }
}

updateNavBarProfileStatus();