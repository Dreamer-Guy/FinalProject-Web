
const DEFAULT_MIN_PRICE=0;
const DEFAULT_MAX_PRICE=200;
const DEFAULT_ONSALES=false;
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
        const totalPage=Math.ceil(totalProducts/rowPerPage);
        const newPaginationContainer = document.getElementById('paging-container');
        newPaginationContainer.className='bg-white py-10 text-center dark:bg-dark paging-container';
        newPaginationContainer.innerHTML =`
                    <ul class="flex items-center justify-center gap-2">
                        <li>
                            <button
                                class="flex h-10 min-w-10 items-center justify-center rounded-lg border border-stroke bg-white px-2 text-base font-medium text-dark hover:bg-gray-1 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                <span>
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17.5 9.8125H4.15625L9.46875 4.40625C9.75 4.125 9.75 3.6875 9.46875 3.40625C9.1875 3.125 8.75 3.125 8.46875 3.40625L2 9.96875C1.71875 10.25 1.71875 10.6875 2 10.9688L8.46875 17.5312C8.59375 17.6562 8.78125 17.75 8.96875 17.75C9.15625 17.75 9.3125 17.6875 9.46875 17.5625C9.75 17.2812 9.75 16.8438 9.46875 16.5625L4.1875 11.2188H17.5C17.875 11.2188 18.1875 10.9062 18.1875 10.5312C18.1875 10.125 17.875 9.8125 17.5 9.8125Z"
                                            fill="currentColor" />
                                    </svg>
                                </span>
                            </button>
                        </li>
                        ${Array.from({ length: totalPage }, (_, i) => getPageButton(i)).join('')}
                        <li>
                            <button
                                class="flex h-10 min-w-10 items-center justify-center rounded-lg border border-stroke bg-white px-2 text-base font-medium text-dark hover:bg-gray-1 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18 10L11.5312 3.4375C11.25 3.15625 10.8125 3.15625 10.5312 3.4375C10.25 3.71875 10.25 4.15625 10.5312 4.4375L15.7812 9.78125H2.5C2.125 9.78125 1.8125 10.0937 1.8125 10.4688C1.8125 10.8438 2.125 11.1875 2.5 11.1875H15.8437L10.5312 16.5938C10.25 16.875 10.25 17.3125 10.5312 17.5938C10.6562 17.7188 10.8437 17.7812 11.0312 17.7812C11.2187 17.7812 11.4062 17.7188 11.5312 17.5625L18 11C18.2812 10.7187 18.2812 10.2812 18 10Z"
                                        fill="currentColor" />
                                </svg>
                            </button>
                        </li>
                    </ul>
        `;
    }
    catch(e){
        console.log(e);
    }
}

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

