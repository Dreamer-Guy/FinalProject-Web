// pagination.js
let currentPage = 1;
const rowPerPage = 6;
let filters={
    type:[],
    brand:[],
};


let sort='price-asc';

function setCurrentPage(page) {
    currentPage = page;
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
    sort=value;
}


function handleFilterTypes(value){
    setType(value);
    console.log("Types:",filters.type);
}

function handleFilterBrands(event){
    const value=event.target.value;
    setBrand(value);
    console.log("Brands:",filters.brand);
}

function handleSort(event){
    const value=event.target.value;
    setSort(value);
    console.log("Sort:",sort);
}

function handlePageChange(event){
    const page=parseInt(event.target.value);
    setCurrentPage(page);
}