

const DEFAULT_MIN_PRICE=0;
const DEFAULT_MAX_PRICE=200;
const DEFAULT_ONSALES=false;
const COUNT_PAGE_SHOW=3;
let currentPage = 1;
const rowPerPage = 6;
let filters={
    search:"",
    category:[],
    brand:[],
    sort:'price-asc',
    page:1,
    rowPerPage:6,
    priceRange:[],
    onSales:false,//true or false
};

const generateRatingStars = (rating) => {
    let ratingStars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            ratingStars += '<i class="fa-solid fa-star"></i>';
        } else {
            ratingStars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return ratingStars;
};



function setCurrentPage(page) {
    filters.page = page;
    currentPage=page;
}


function setBrand(value){
    const brands=filters.brand;
    const index=brands.findIndex((brand)=>brand===value);
    if(index===-1){
        brands.push(value);
    }
    else{
        brands.splice(index,1);
    }
}

function setCategory(value){
    const categories=filters.category;
    const index=categories.findIndex((category)=>category===value);
    if(index===-1){
        categories.push(value);
    }
    else{
        categories.splice(index,1);
    }
}

function setSort(value){
    filters.sort=value;
}

function setPrice(min,max){
    const index=filters.priceRange.findIndex((price)=>price===`${min}-${max}`);
    if(index===-1){
        filters.priceRange.push(`${min}-${max}`);
    }
    else{
        filters.priceRange.splice(index,1);
    }
}

function setOnSales(){
    if(filters.onSales==='true'){
        filters.onSales=false;
    }
    else{
        filters.onSales=true;
    }
}

function setSearch(value){
    const searchDiv=document.getElementById('search');
    if(searchDiv.value.trim().length===0){
        searchDiv.value=value;
    }
    filters.search=value;
}

async function handleFilters(type,value,value2_optional){
    if(type==='brand'){
        setCurrentPage(1);
        setBrand(value.toLowerCase());
    }
    if(type==='category'){
        setCurrentPage(1);
        setCategory(value);
    }
    if(type==='sort'){
        setSort(value);
    }
    if(type==='page'){
        setCurrentPage(Number(value));
    }
    if(type==='price'){
       
        setPrice(value,value2_optional);
    }
    if(type==='onSales'){
        setOnSales();
    }
    if(type==='search'){
        value=$('#search').val();
        setSearch(value);
    }
    if(type!=='page'){
        setCurrentPage(1);
    }
    const queryParams= new URLSearchParams(filters).toString();
    const newUrl=`${window.location.pathname}?${queryParams}`;
    window.history.replaceState(null,'',newUrl);
    try{
        const data=await fetch(`/products/api/get?${queryParams.toString()}`)
        .then(response => response.json());
        const products=data.products;
        const totalProducts=data.totalProducts;
        const productsContainer = document.getElementById('products-grid');
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = "bg-white shadow rounded overflow-hidden group cursor-pointer flex flex-col justify-between";
            productDiv.innerHTML = `
                <div>
                    <div class="relative">
                        <img src="${product.image}" alt="${product.name}" class="product-img cursor-pointer"
                            productId="<%= product._id %>"
                            onclick="window.location.href='/productDetails/get/${product._id}'">
                    </div>
                </div>
                <div>
                    <div class="pt-4 pb-3 px-4">
                        <a href="#">
                            <h4
                                class="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                                ${product.name}
                            </h4>
                        </a>
                        <div class="flex items-baseline mb-1 space-x-2">
                            ${product.salePrice>0?
                                `<div class="text-xl text-primary font-semibold">$${product.salePrice}
                                </div>
                                <div class="text-xl text-gray-500 line-through">$${product.price}
                                </div>
                                `
                                :`<div class="text-xl text-gray-500 font-semibold">$${product.price}
                                </div>`
                            }
                        </div>
                        <div class="flex items-center">
                            <div class="flex gap-1 text-sm text-yellow-400">
                                ${generateRatingStars(Math.floor(product.rating))}
                            </div>
                            <div class="text-xs text-gray-500 ml-3">(150)</div>
                        </div>
                    </div>
                    <button onclick="handleAddToCart('${product._id}',1)"
                        class="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
                        Add to cart
                    </button>
                </div>
            `;
            productsContainer.appendChild(productDiv);
        });
        const totalPages=Math.ceil(totalProducts/rowPerPage);
        const paginationContainer = $('#paging-container');
        paginationContainer.empty();
        if(isNeedToAddFirstBtn()){
            addFirstBtn(paginationContainer);
        }
        let count=currentPage-1>0?currentPage-1:1;
        for(let i=0;i<COUNT_PAGE_SHOW;i++){
            if(count>totalPages){
                break;
            }
            paginationContainer.append(`
                <button
                    onclick="handleFilters('page',${count})"
                    id="review-page-btn-${count}" 
                    class="hover:cursor-pointer h-10 w-10 border border-black rounded-lg ${count===currentPage?'bg-blue-500':'bg-blue-200'}">${count}</button>    
                `);
            count+=1;
        }
        if(isNeedtoAddLastBtn(totalPages)){
            addLastBtn(paginationContainer,totalPages);
        }
    }
    catch(e){
        console.log(e);
    }
}
const isNeedToAddFirstBtn=()=>{
    if(currentPage-1>1){
        return true;
    }
    return false;
};

const addFirstBtn=(paginationContainer)=>{
    paginationContainer.append(`
        <button
            onclick="handleFilters('page','1')"
            id="review-page-btn-1" 
            class="hover:cursor-pointer h-10 w-10 border border-black rounded-lg">First</button>    
        `);
};

const isNeedtoAddLastBtn=(totalPages)=>{
    if(totalPages-currentPage>1){
        return true;
    }
    return false;
};

const addLastBtn=(paginationContainer,totalPages)=>{
    paginationContainer.append(`
        <button
            id="last-btn"
            onclick="handleFilters('page',${totalPages})"
            id="review-page-btn-${totalPages}" 
            class="hover:cursor-pointer h-10 w-10 border border-black rounded-lg">Last</button>    
        `);
};

const readQueryParams=()=>{
    const queryParams=window.location.search;
    const urlParams = new URLSearchParams(queryParams);
    const categoryQuery=urlParams.get('category')||"";
    const brandQuery=urlParams.get('brand')||"";
    const categories=categoryQuery.split(',');
    const brands=brandQuery.split(',');
    const search=urlParams.get('search')||"";
    setSearch(search);
    categories.forEach(category => {    
        const checkbox = document.querySelector(`input[name='cat-${category}']`);
        if (checkbox) {
            setCategory(category);
            checkbox.checked = true; 
        }
    });
    brands.forEach(brand => {
        const checkbox = document.querySelector(`input[name='brand-${brand}']`);
        if (checkbox) {
            setBrand(brand);
            checkbox.checked = true; 
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    readQueryParams();
});



const getPageButton=(i)=>{
    return `
    <li>
        <button onclick="handleFilters('page','${i + 1}')" id="page-${i + 1}" class="flex h-10 min-w-10 items-center justify-center rounded-lg border 
        border-stroke bg-blue-100 px-2 text-base font-medium text-dark hover:bg-gray-1 
        dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10
        ${i+1===currentPage?'bg-blue-500':''}">
            ${i + 1}
        </button>
    </li>
    `;
};


document.querySelector('#search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleFilters('search');
    }
});

