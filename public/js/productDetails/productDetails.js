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
    console.log(reviewData);
    try{
        const res=await fetch("/reviews/add",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(reviewData)
        });
    }
    catch(error){
        console.log(error);
    }
}


const log=()=>{
    const userHtmlEncodedString = user;
    const textarea = document.createElement('textarea');
    textarea.innerHTML = userHtmlEncodedString;
    const decodedString = textarea.value;
}

const decodeHtmlDataToObj=(encodedData)=>{
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedData;
    return JSON.parse(textarea.value);
};

const decodeEJSData=()=>{
    ejsData.user = decodeHtmlDataToObj(user);
    console.log(ejsData.user);
};


decodeEJSData();


const toggleShow=()=>{
    const showMoreView=$(".review-display-more");
    const points=$("#points");
    const showMoreButton=$("#show-more-button");
    console.log(showMoreButton,points,showMoreView);
    showMoreView.toggleClass("hidden");
    points.toggleClass("hidden");
    if(showMoreButton.text().toLowerCase()==="show more"){
        showMoreButton.text("Show less");
    }
    else{
        showMoreButton.text("Show more");
    }
}
