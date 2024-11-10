// pagination.js
let currentPage = 1;
const rowPerPage = 6;
let filters={
    type:[],
    brand:[],
    sort:'price-asc',
    page:1,
    rowPerPage:6,
    minPrice:null,
    maxPrice:null,
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
    console.log("Current page set to:", currentPage);
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

function setType(value){
    const types=filters.type;
    const index=types.findIndex((type)=>type===value);
    if(index===-1){
        types.push(value);
    }
    else{
        types.splice(index,1);
    }
}

function setSort(value){
    filters.sort=value;
}

async function handleFilters(type,value){
    if(type==='brand'){
        setBrand(value.toLowerCase());
    }
    if(type==='type'){
        setType(value);
    }
    if(type==='sort'){
        setSort(value);
    }
    if(type==='page'){
        setCurrentPage(value);
    }
    const queryParams= new URLSearchParams(filters).toString();
    window.location.href=`/products/get?${queryParams}`;
    // try{
    //     const data=await fetch(`/products/api/get?${queryParams.toString()}`)
    //     .then(response => response.json());
    //     console.log("Data",data);
    //     console.log(queryParams);
    //     const productsContainer = document.getElementById('products-grid');
    //     productsContainer.innerHTML = '';
    //     data.products.forEach(product => {
    //         const productDiv = document.createElement('div');
    //         productDiv.className = "bg-white shadow rounded overflow-hidden group cursor-pointer flex flex-col justify-between";

    //         productDiv.innerHTML = `
    //             <div>
    //                 <div class="relative">
    //                     <img src="${product.image}" alt="${product.name}" class="w-full cursor-pointer"
    //                         productId="${product.id}"
    //                         onclick="window.location.href='/productDetails/get/${product.productId}'">
    //                 </div>
    //                 <div class="pt-4 pb-3 px-4">
    //                     <a href="#">
    //                         <h4 class="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
    //                             ${product.name}
    //                         </h4>
    //                     </a>
    //                     <div class="flex items-baseline mb-1 space-x-2">
    //                         ${product.salePrice > 0
    //                             ? `<div class="text-xl text-primary font-semibold">$${product.salePrice}</div>
    //                                <div class="text-xl text-gray-500 line-through">$${product.price}</div>`
    //                             : `<div class="text-xl text-gray-500 font-semibold">$${product.price}</div>`
    //                         }
    //                     </div>
    //                     <div class="flex items-center">
    //                         <div class="flex gap-1 text-sm text-yellow-400">
    //                             ${generateRatingStars(Math.floor(product.rating))}
    //                         </div>
    //                         <div class="text-xs text-gray-500 ml-3">(150)</div>
    //                     </div>
    //                 </div>
    //             </div>
    //             <a href="#"
    //                 class="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition">
    //                 Add to cart
    //             </a>
    //         `;
    //         productsContainer.appendChild(productDiv);
    //     });
    // }
    // catch(e){
    //     console.log(e);
    // }
}

function handleSearch(){
    const value=document.getElementById('search').value;
    window.location.href=`/products/search?search=${encodeURIComponent(value)}`;
}


//tech-debt: may cause wrong in future
function controlTypeState() {
    const urlParams = new URLSearchParams(window.location.search);
    const typesFromUrl = urlParams.get('type')?.split(',') || [];
    console.log(typesFromUrl);
    typesFromUrl.forEach(type => {
        const checkbox = document.querySelector(`input[value="${type}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

function controlBrandState() {
    const urlParams = new URLSearchParams(window.location.search);
    const brandsFromUrl = urlParams.get('brand')?.split(',') || [];
    brandsFromUrl.forEach(brand => {
        const checkbox = document.querySelector(`input[value="${brand}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

function updateFiltersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    filters.type = urlParams.get('type') ? urlParams.get('type').split(',').map(type=>type.toLowerCase()) 
    : [];
    filters.brand = urlParams.get('brand') 
    ? urlParams.get('brand').split(',').map(brand => brand.toLowerCase()) 
    : [];
    filters.sort = urlParams.get('sort') || filters.sort;
    filters.page = parseInt(urlParams.get('page')) || filters.page;
    filters.rowPerPage = parseInt(urlParams.get('rowPerPage')) || filters.rowPerPage;
    filters.minPrice = urlParams.get('minPrice') !== 'null' ? parseFloat(urlParams.get('minPrice')) : null;
    filters.maxPrice = urlParams.get('maxPrice') !== 'null' ? parseFloat(urlParams.get('maxPrice')) : null;
}

updateFiltersFromUrl();
controlTypeState();
controlBrandState();
