
import client from "../Config/elasticSearch.js";

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
    async getProductById(id){
        const res=await client.get({
            index:PRODUCT_INDEX_NAME,
            id:id
        });
        return {
            _id:res._id,
            ...res._source
        };
    },
    async deleteProductById(id){
        const res=await client.delete({
            index:PRODUCT_INDEX_NAME,
            id:id
        });
        return res;
    },
};

export default elasticSearchService;