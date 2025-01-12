function handleSearch(){
    const value=document.getElementById('search').value;
    window.location.href=`/products/get?search=${encodeURIComponent(value)}`;
}

document.getElementById('search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

const showPrice=(suggestion)=>{
    if(suggestion.salePrice>0){
       return `
       <div class="font-semibold">$${suggestion.salePrice}</div>
       <div class="line-through text-sm">$${suggestion.price}</div>
       `;
    }
    return `<div class="text-base">$${suggestion.price}</div>`;
};


const createSearchSuggestionHtml=(suggestions)=>{
    const tempContainer=document.createElement('div');
    tempContainer.id='search-suggestion-container';
    tempContainer.classList.add(
        'search-suggestion-container','flex','flex-col','absolute','bg-white','w-full','z-10','top-14','border','border-gray-300',
        'rounded-md','shadow-md','gap-2');
    tempContainer.innerHTML=
    `
    <div class="text-lg font-semibold p-2">Search Suggestions</div>
    `;
    if(suggestions.length===0){
        const suggestionDiv=document.createElement('div');
        suggestionDiv.classList.add('search-suggestion','italic','px-2');
        suggestionDiv.innerHTML=`<div>No suggestions found</div>`;
        tempContainer.appendChild(suggestionDiv);
        return tempContainer;
    };
    suggestions.forEach((suggestion)=>{
        const suggestionDiv=document.createElement('div');
        suggestionDiv.classList.add('search-suggestion','cursor-pointer');
        suggestionDiv.innerHTML=
        `
        <div 
            onclick="window.location.href='/productDetails/get/${suggestion._id}'"
            class="flex flex-row justify-start items-start">
            <div class="w-1/5 flex flex-row justify-center items-center">
                <img src="${suggestion.image}" class="w-16 h-16 object-cover" alt="product image">
            </div>
            <div class="w-4/5 flex flex-col gap-1 justify-start">
                <div>${suggestion.name}</div>
                ${showPrice(suggestion)}
            </div>
        </div>
        `;
        tempContainer.appendChild(suggestionDiv);
    });
    return tempContainer;
}

document.getElementById('search').addEventListener('input',async function (e) {
    let debounceTimer;
    const TIME_OUT_LIMIT=500;
    debounceTimer=setTimeout(async()=>{
        try{
            const res=await fetch(`/products/api/get-suggested?search=${encodeURIComponent(e.target.value.trim())}`);
            const searchSuggestionContainer=document.getElementById('search-suggestion-container');
            if(searchSuggestionContainer){
                searchSuggestionContainer.remove();
            }
            if(e.target.value.trim()===''){
                return;
            }
            const data=await res.json();
            const searchContainer=document.getElementById('search-container');
            searchContainer.appendChild(createSearchSuggestionHtml(data));
        }
        catch(e){
            console.log(e.message);
        }

    },TIME_OUT_LIMIT);
});


document.getElementById('search').addEventListener('keydown', function (e) {
    if(e.key==='Enter'){
        e.preventDefault();
        handleSearch();
    }
});


