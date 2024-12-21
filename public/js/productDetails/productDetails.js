let currentPage=1;
const COUNT_PAGE_SHOW=3;

const data={
    user:{},
    productId:"",
    rating:0,
    comment:"",
}

const ejsData={
    user:{},
}

const generateRatingStars=(rating)=>{
    let stars="";
    for(let i=1;i<=5;i++){
        if(i<=rating){
            stars+=`<label
                        onclick="handleRating(${i})"
                        for="rating<%=i%>" class="text-2xl text-yellow-400 cursor-pointer">
                        <i class="fa-solid fa-star"></i>
                    </label>`;
        }
        else{
            stars+=`<label
                        onclick="handleRating(${i})"
                        for="rating<%=i%>" class="text-2xl text-yellow-400 cursor-pointer">
                        <i class="fa-regular fa-star"></i>
                    </label>`;;
        }
    }
    return stars;
}


// const log=()=>{
//     const userHtmlEncodedString = user;
//     const textarea = document.createElement('textarea');
//     textarea.innerHTML = userHtmlEncodedString;
//     const decodedString = textarea.value;
// }

const decodeHtmlDataToObj=(encodedData)=>{
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedData;
    return JSON.parse(textarea.value);
};

const decodeEJSData=()=>{
    ejsData.user = decodeHtmlDataToObj(user);
};

decodeEJSData();

const handleRating=(rating) =>{ 
    data.rating=rating;
    const input_stars=document.getElementById("input-starsRating");
    input_stars.innerHTML=generateRatingStars(rating);
}

const handleAddReview=async()=>{
    const comment=document.getElementById("comment").value;
    data.comment=comment;
    const url=window.location.href;
    const productId=url.split("/").pop();
    const reviewData={
        ...data,
        productId:productId,
        user:ejsData.user._id,
    };
    showSpinnerLoading();
    try{
        const res=await fetch("/reviews/add",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(reviewData)
        });
        hideSpinnerLoading();
        if(res.ok){
            showToast('Review added successfully','default');
            const data=await res.json();
            const {addedReview,reviews,totalReviews,rowPerPage,newProductRating}=data;
            const paginationContainer=$("#paging-btn-container");
            $('#rating-product').text(parseFloat(newProductRating.toFixed(1)));
            if(isInTheLastPage(totalReviews,rowPerPage,currentPage)){
                if(isThereSlotToAddReviewToCurrentPage(totalReviews,rowPerPage,currentPage)){
                    addReviewToCurrentPage(addedReview);
                }
            }
            if(isCreateNewPage(totalReviews,rowPerPage,currentPage)){
                const totalPages=Math.ceil(totalReviews/rowPerPage);
                if(isNeedtoAddLastBtn(Math.ceil(totalReviews/rowPerPage)) && (totalPages-currentPage===2)){
                    addLastBtn(paginationContainer,totalPages);
                    return;
                }
                if(isNeedToAddNextPage(totalReviews,rowPerPage)){
                    addNewPageButton(addedReview,totalPages);
                }
            }
        }   
        else{
            showToast('There is a problem while adding new review!!!','warning');
        }
    } 
    catch(error){
        console.log(error);
    }
}

const isLastBtnExist=(totalPages)=>{
    if(totalPages-currentPage>1){
        return true;
    }
    return false;
};

const isNeedToAddNextPage=(totalReviews,rowPerPage)=>{
    if(Math.ceil(totalReviews/rowPerPage)-1===currentPage && totalReviews-currentPage*rowPerPage===1){
        return true;
    }
    return false;
};

const isThereSlotToAddReviewToCurrentPage=(totalReviews,rowPerPage,currentPage)=>{
    if(totalReviews-rowPerPage*(currentPage-1)<=rowPerPage){
        return true;
    }
    return false;
};

const isInTheLastPage=(totalReviews,rowPerPage,currentPage)=>{
    if(currentPage>=Math.ceil(totalReviews/rowPerPage)){
        return true;
    }
    return false;
};

const isCreateNewPage=(totalReviews,rowPerPage,currentPage)=>{
    if(currentPage<Math.ceil(totalReviews/rowPerPage)){
        return true;
    }
    return false;
};

const addReviewToCurrentPage=(review)=>{
    const reviewsContainer=$("#reviews-container");
    reviewsContainer.append(
    `
    <div class="flex flex-row justify-start items-center gap-4 class">
    <div class="w-[50px] h-[50px]">
        <img 
        class="w-full h-full object-cover rounded-full"
        src="https://github.com/octocat.png?s=200" alt="doing" />
    </div>
    <div>
        <div class="flex flex-row gap-6">
            <h3 class="font-bold">${review.user.fullName}</h3>
            <p class="opacity-50 text-blue-400">${review.createdAt}</p>
        </div>
        <div>
            <div class="flex gap-1 text-sm text-yellow-400">
                ${generateRatingStars(Math.floor(review.rating))}
            </div>
        </div>
        <div>
            <p${review.comment}</p>
        </div>
    </div>
</div>
    `);
};

const addNewPageButton=(review,nextCount)=>{
    const paginationContainer=$("#paging-btn-container");
    paginationContainer.append(
    `
    <button
    onclick="handleReviewPaging(${nextCount})"
    id="review-page-btn-${nextCount}" 
    class="hover:cursor-pointer h-10 w-10 border border-black rounded-lg">${nextCount}</button>
    
    `);
};




const handleChangeQuantity=(quantity)=>{
    const currentQuantity=Number($("#quantity").val());
    if(currentQuantity===1 && Number(quantity)<0){
        return;
    }
    if(currentQuantity===totalStock && Number(quantity)>0){
        showToast("Can't not add, no more product in stock",'warning');
        $("#quantity").val(totalStock);
        return;
    }
    const newValue=currentQuantity+Number(quantity);
    $("#quantity").val(newValue);
};

const handleAddToCart = async (productId,quantityOpt) => {
    try{
        let quantity=1;
        if(isNaN(quantityOpt)){
            showToast('Quantity must be a positive integer','warning');
            return;
        }
        quantity=quantityOpt;
        quantity=Number($("#quantity").val());
        showSpinnerLoading();
        const res=await fetch('/carts/addItems',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId,quantity})
        });
        hideSpinnerLoading();
        const data=await res.json();
        if(res.ok){
            showToast('Item added to cart successfully','default');
            const cartNumber=$('#cart-number');
            cartNumber.text(data.cartNumber);
        }
        else{
            showToast(data.message,'warning');
        }
    }
    catch(e){
        console.log(e);
        showToast(e.message,'warning');
    }
};


const handleReviewPaging=async(page)=>{
    if(Number(page)===currentPage){
        return;
    }
    currentPage=Number(page);
    const url=window.location.href;
    const productId=url.split("/").pop();
    showSpinnerLoading();
    try{
        const res=await fetch(`/reviews/get/${productId}?page=${page}`);
        hideSpinnerLoading();
        if(res.ok){
            const {reviews,rowPerPage,totalPages}=await res.json();
            const reviewsContainer=$("#reviews-container");
            reviewsContainer.empty();
            reviews.forEach((review,i)=>{
                reviewsContainer.append(`
                <div class="flex flex-row justify-start items-center gap-4 class">
                    <div class="w-[50px] h-[50px]">
                        <img 
                        class="w-full h-full object-cover rounded-full"
                        src="https://github.com/octocat.png?s=200" alt="doing" />
                    </div>
                    <div>
                        <div class="flex flex-row gap-6">
                            <h3 class="font-bold">${review.user.fullName}</h3>
                            <p class="opacity-50 text-blue-400">${review.createdAt}</p>
                        </div>
                        <div>
                            <div class="flex gap-1 text-sm text-yellow-400">
                                ${generateRatingStars(review.rating)}
                            </div>
                        </div>
                        <div>
                            <p>${review.comment}</p>
                        </div>
                    </div>
                </div>     
                `);
            });
            const paginationContainer=$("#paging-btn-container");
            paginationContainer.empty();
            if(isNeedToAddFirstBtn()){
                addFirstBtn(paginationContainer);
            }
            let count=currentPage-1>0?currentPage-1:1;
            for(let i=1;i<=COUNT_PAGE_SHOW;i++){
                if(count>totalPages){
                    break;
                }
                paginationContainer.append(`
                    <button
                        onclick="handleReviewPaging(${count})"
                        id="review-page-btn-${count}" 
                        class="hover:cursor-pointer h-10 w-10 border border-black rounded-lg ${count===currentPage?'bg-blue-300':''}">${count}</button>    
                    `);
                count+=1;
            }
            if(isNeedtoAddLastBtn(totalPages)){
                addLastBtn(paginationContainer,totalPages);
            }
        }
        else{
            showToast('There is a problem while fetching reviews','warning');
        }
    }
    catch(e){
        console.log(e);
    }
};

const isNeedToAddFirstBtn=()=>{
    if(currentPage-1>1){
        return true;
    }
    return false;
};

const addFirstBtn=(paginationContainer)=>{
    paginationContainer.append(`
        <button
            onclick="handleReviewPaging(1)"
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
            onclick="handleReviewPaging(${totalPages})"
            id="review-page-btn-${totalPages}" 
            class="hover:cursor-pointer h-10 w-10 border border-black rounded-lg">Last</button>    
        `);
};

const handleSwapImage=(id)=>{
    const mainImage=document.getElementById("product-img");
    const alternative=document.getElementById(id);
    const t=mainImage.src;
    mainImage.src=alternative.src;
    alternative.src=t;
}

