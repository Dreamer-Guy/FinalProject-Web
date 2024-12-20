


const getBackgroupColor=(type)=>{

    const colorMap = {
      'default':'bg-black',
      'warning':'bg-primary',
      'success':'bg-green-500',
      'error':'bg-red-500',
    };

    return colorMap[type];

};

const getTextColor=(type)=>{
    const colorMap = {
      'default':'text-white',
      'warning':'text-white',
      'success':'text-white',
      'error':'text-white',
    };

    return colorMap[type];
};

const createToastString=(msg,type)=>{
    return `
    <div id="toast" 
        class="fixed bottom-4 right-9 transform  ${getBackgroupColor(type)} ${getTextColor(type)} px-6 py-3 
        rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-300">
        ${msg}
    </div>
    `;
}

const convertStringToHTML=(htmlString)=>{
    const template=document.createElement('template');
    template.innerHTML=htmlString.trim();
    return template.content.firstChild;
};

const createToastElement=(msg,type)=>{
    const toastString=createToastString(msg,type);
    return convertStringToHTML(toastString);
};


const showToast=(msg,type='default',time=3000)=>{
    const toast=createToastElement(msg,type);
    document.body.appendChild(toast);
    toast.classList.remove("opacity-0", "pointer-events-none");
    toast.classList.add("opacity-100");
    setTimeout(() => {
        toast.classList.add("opacity-0", "pointer-events-none");
        toast.classList.remove("opacity-100");
        toast.remove();
    }, time); 
}