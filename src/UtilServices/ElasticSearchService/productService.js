
import client from "../../Config/elasticSearch.js";

const PRODUCT_INDEX_NAME="products";

const buildPriceRangeQuery=(priceRange)=>{
    const PRICE_PROPERTY_NAME="price";
    const priceRangeQueryArr=priceRange.reduce((acc,price)=>{
        acc.push({
            range:{
                [PRICE_PROPERTY_NAME]:{
                    gte:price.minPrice,
                    lte:price.maxPrice
                }
            }
        });
        return acc;
    },[]);
    return priceRangeQueryArr;
};

const elasticSearchService={
    async search(searchTerm,brands=[],categories=[],priceRange=[{minPrice:0,maxPrice:Number.MAX_SAFE_INTEGER}],sortField='price',sortOrder=1){
        const FIELDS_TO_SEARCH=["name","description"];
        const priceRangeQuery=buildPriceRangeQuery(priceRange);
        const MAX_SIZE=1000;
        const queryCommand={
            index:PRODUCT_INDEX_NAME,
            body:{
                size:MAX_SIZE,
                query:{
                    bool:{
                        filter:[
                            {
                                bool:{
                                    should:priceRangeQuery
                                }
                            }
                        ],
                    }
                },
                sort:[
                    {
                        [sortField]:{
                            order:sortOrder===1?"asc":"desc"
                        }
                    }
                ]
            },
        };
        if(searchTerm && searchTerm.trim().length>0){
            queryCommand.body.query.bool.should=[
                {
                    multi_match:{
                        query:searchTerm,
                        fields:FIELDS_TO_SEARCH,
                        fuzziness:"AUTO",
                    }
                },
                {
                    nested:{
                        path:"brand_id",
                        query:{
                            match:{
                                "brand_id.name":{
                                    query:searchTerm,
                                    fuzziness:"AUTO"
                                }
                            }
                        }
                    }
                },
                {
                    nested:{
                        path:"category_id",
                        query:{
                            match:{
                                "category_id.name":{
                                    query:searchTerm,
                                    fuzziness:"AUTO"
                                }
                            }
                        }
                    }
                }
            ];
            queryCommand.body.query.bool.minimum_should_match=1;
        }
        if(brands.length>0){
            queryCommand.body.query.bool.filter.push({
                nested:{
                    path:"brand_id",
                    query:{
                        terms:{
                            "brand_id.name":brands
                        }
                    }
                }
            });
        }
        if(categories.length>0){
            queryCommand.body.query.bool.filter.push({
                nested:{
                    path:"category_id",
                    query:{
                        terms:{
                            "category_id.name":categories
                        }
                    }
                }
            });
        }
        const res=await client.search(queryCommand);
        return res.hits.hits.map((hit)=>({
            _id:hit._id,
            ...hit._source,
        }));
    },
    async SynchronizeProductsToElastic(products){
        const body=products.flatMap((product)=>[
            {
                index:{
                    _index:"products",
                    _id:product._id
                }
            },
            {
                name:product.name,
                price:product.price,
                salePrice:product.salePrice,
                totalStock:product.totalStock,
                image:product.image,
                rating:product.rating,
                numReviews:product.numReviews,
                description:product.description,
                brand_id:product.brand_id,
                category_id :product.category_id,
                totalStock:product.totalStock,
                createdAt:product.createdAt
            },
        ]);
        const res=await client.bulk({body});
        return res;
    },
    async SynchronizeAfterProductCreation(product){
        const res=await client.index({
            index:PRODUCT_INDEX_NAME,
            id:product._id,
            body:{
                name:product.name,
                price:product.price,
                salePrice:product.salePrice,
                totalStock:product.totalStock,
                image:product.image,
                rating:product.rating,
                numReviews:product.numReviews,
                description:product.description,
                brand_id:product.brand_id,
                category_id :product.category_id,
                createdAt:product.createdAt
            }
        });
    },
    async SynchronizeAfterProductUpdate(product){
        const res=await client.update({
            index:PRODUCT_INDEX_NAME,
            id:product._id,
            body:{
                doc:{
                    name:product.name,
                    price:product.price,
                    salePrice:product.salePrice,
                    totalStock:product.totalStock,
                    image:product.image,
                    rating:product.rating,
                    numReviews:product.numReviews,
                    description:product.description,
                    brand_id:product.brand_id,
                    category_id :product.category_id,
                    createdAt:product.createdAt
                }
            }
        });
    },
    async SynchronizeAfterProductDelete(productId){
        const res=await client.delete({
            index:PRODUCT_INDEX_NAME,
            id:productId
        });
    },
    async SynchronizeAfterBrandUpdate(brand){
        const updateCommand={
            index:PRODUCT_INDEX_NAME,
            refresh:true,
            script:{
                source:`
                    ctx._source.brand_id=params.brand;
                `,
                lang:"painless",
                params:{
                    brand,
                }
            },
            query:{
                nested:{
                    path:"brand_id",
                    query:{
                        match:{
                            "brand_id._id":brand._id
                        }
                    }
                }
            }
        }
        await client.updateByQuery(updateCommand);
    },
    async SynchronizeAfterBrandDelete(brandId){
        const defaultBrand={
            _id:`${brandId}`,
            name:"default",
        }
        const updateCommand={
            index:PRODUCT_INDEX_NAME,
            refresh:true,
            script:{
                source:`
                    ctx._source.brand_id=params.brand;
                `,
                lang:"painless",
                params:{
                    brand:defaultBrand,
                }
            },
            query:{
                nested:{
                    path:"brand_id",
                    query:{
                        match:{
                            "brand_id._id":brandId
                        }
                    }
                }
            }
        };   
        await client.updateByQuery(updateCommand);     
    },
    async SynchronizeAfterCategoryUpdate(category){
        const updateCommand={
            index:PRODUCT_INDEX_NAME,
            refresh:true,
            script:{
                source:`
                    ctx._source.category_id=params.category;
                `,
                lang:"painless",
                params:{
                    category,
                }
            },
            query:{
                nested:{
                    path:"category_id",
                    query:{
                        match:{
                            "category_id._id":category._id
                        }
                    }
                }
            }
        }
        await client.updateByQuery(updateCommand);
    },
    async SynchronizeAfterCategoryDelete(categoryId){
        const defaultCategory={
            _id:`${categoryId}`,
            name:"default",
        };
        const updateCommand={
            index:PRODUCT_INDEX_NAME,
            refresh:true,
            script:{
                source:`
                    ctx._source.category_id=params.category;
                `,
                lang:"painless",
                params:{
                    category:defaultCategory,
                }
            },
            query:{
                nested:{
                    path:"category_id",
                    query:{
                        match:{
                            "category_id._id":categoryId,
                        }
                    }
                }
            }
        }
        await client.updateByQuery(updateCommand);
    },


    // async getProductById(id){
    //     const res=await client.get({
    //         index:PRODUCT_INDEX_NAME,
    //         id:id
    //     });
    //     return {
    //         _id:res._id,
    //         ...res._source
    //     };
    // },
    // async deleteProductById(id){
    //     const res=await client.delete({
    //         index:PRODUCT_INDEX_NAME,
    //         id:id
    //     });
    //     return res;
    // },
};

export default elasticSearchService;