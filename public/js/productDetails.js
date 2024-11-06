
// const generateRatingStars=(rating)=>{
//     let ratingStars='';
//     for(let i=0;i<5;i++){
//         if(i<rating){
//             ratingStars+='<i class="fa-solid fa-star"></i>';
//         }else{
//             ratingStars+='<i class="fa-regular fa-star"></i>';
//         }
//     }
//     return ratingStars;
// };

// const buildProductDetailsRows = (productDetails = {}) => {
//     var productDetailsRows= '';
//     for (const detail of Object.keys(productDetails)) {
//         if(detail==='description' || detail==='weight' || detail==='productId'){
//             continue;
//         };
//         const row = `
//         <tr>
//             <th class="py-2 px-4 border border-gray-300 w-40 font-medium">${detail}</th>
//             <th class="py-2 px-4 border border-gray-300 ">${productDetails[detail]}</th>
//         </tr>`;
//         productDetailsRows += row;
//     }
//     return productDetailsRows;
// };

// const buildProductDetailsTable = (productDetails = {}) => {
//     const productDetailsRows = buildProductDetailsRows(productDetails);
//     const productDetailsSection = `
//     <table class="table-auto border-collapse w-full text-left text-gray-600 text-sm mt-6">
//         ${productDetailsRows}
//     </table>
//     `;
//     return productDetailsSection;
// };

// const buildProductInfor = (product,productDetails) => {
//     const productDetailsTable = buildProductDetailsTable(productDetails);
//     const productInfor = `
//     <div id="product-infor">
//             <h2 class="text-3xl font-medium uppercase mb-2">${product.name}</h2>
//             <div class="flex items-center mb-4">
//                 <div class="flex gap-1 text-sm text-yellow-400">
//                     ${generateRatingStars(Math.floor(product.rating))}
//                 </div>
//                 <div class="text-xs text-gray-500 ml-3">(150 Reviews)</div>
//             </div>
//             <div class="space-y-2">
//                 <p class="text-gray-800 font-semibold space-x-2">
//                     <span>Availability: </span>
//                     <span class="text-green-600">${product.totalStock}</span>
//                 </p>
//                 <p class="space-x-2">
//                     <span class="text-gray-800 font-semibold">Brand: </span>
//                     <span class="text-gray-600">${product.brand}</span>
//                 </p>
//                 <p class="space-x-2">
//                     <span class="text-gray-800 font-semibold">Type: </span>
//                     <span class="text-gray-600">${product.type}</span>
//                 </p>
//                 <p class="space-x-2">
//                     <span class="text-gray-800 font-semibold">Weight: </span>
//                     <span class="text-gray-600">${productDetails.weight}</span>
//                 </p>
//             </div>
//             <div class="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
//                 <p class="text-gray-800 font-semibold">Price: </p>
//                 <p class="text-xl text-primary font-semibold">${product.salePrice}</p>
//                 <p class="text-base text-gray-400 line-through">${product.price}</p>
//             </div>

//             <div>
//                 <h3 class="text-xl text-gray-800 mb-3 font-medium">Description:</h3>
//                 <p class="mt-4 text-gray-600">${productDetails.description}</p>
//             </div>

//             <div class="mt-4">
//                 <h3 class="text-sm text-gray-800 uppercase mb-1">Quantity</h3>
//                 <div class="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
//                     <div class="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">-</div>
//                     <div class="h-8 w-8 text-base flex items-center justify-center">4</div>
//                     <div class="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none">+</div>
//                 </div>
//             </div>

//             <div class="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
//                 <a href="#"
//                     class="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition">
//                     <i class="fa-solid fa-bag-shopping"></i> Add to cart
//                 </a>
//                 <!-- <a href="#"
//                     class="border border-gray-300 text-gray-600 px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:text-primary transition">
//                     <i class="fa-solid fa-heart"></i> Wishlist
//                 </a> -->
//             </div>

//             <div class="flex gap-3 mt-4 justify-center items-center">
//                 <a href="#"
//                     class="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
//                     <i class="fa-brands fa-facebook-f"></i>
//                 </a>
//                 <a href="#"
//                     class="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
//                     <i class="fa-brands fa-twitter"></i>
//                 </a>
//                 <a href="#"
//                     class="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
//                     <i class="fa-brands fa-instagram"></i>
//                 </a>
//             </div>
//         </div>
//     `;
//     return productInfor;
// };



// $(document).ready(function () {
//     const id = 'P01'; //tech-debt where to get this
//     $.get(`/api/products/get/${id}`, function (productRes) {
//         const product = productRes.data;
//         $.get(`/api/productDetails/get/${id}`, function (productDetailsRes) {
//             const productDetails=productDetailsRes.data;
//             const imgElement=document.getElementById('product-img').setAttribute('src', product.image);
//             $(document.getElementById('product-details-table')).replaceWith(buildProductDetailsTable(productDetails));
//             $(document.getElementById('product-infor')).replaceWith(buildProductInfor(product,productDetails));
//         });
//     });
// });
