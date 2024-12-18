import client from "../../Config/elasticSearch.js";

const INDEX_NAME='products-suggester';
const SUGGEST_FIELD_NAME='name';
const SIZE_OF_SUGGESTIONS=3;
const SUGGESTION_FIELD_NAME='product-suggestions';

const getProductInforForIndexFromModel=(product)=>{
    return {
        name:{
            input:product.name.split(' '),
            weight:1
        },
        price:product.price,
        salePrice:product.salePrice,
        image:product.image,
    }
};

const suggesterService = {

    async getSuggestions(query) {
        const response = await client.search({
            index: INDEX_NAME,
            body: {
                suggest: {
                    [SUGGESTION_FIELD_NAME]: {
                        prefix: query,
                        completion: {
                            field: SUGGEST_FIELD_NAME,
                            size: SIZE_OF_SUGGESTIONS,
                            fuzzy: {
                                fuzziness: 2
                            }
                        }
                    }
                }
            }
        });
        return response.suggest[SUGGESTION_FIELD_NAME][0].options
                        .map(option=>{
                            return {
                                ...option._source,
                                name:option._source.name.input.join(' '),
                            }
                        });
    },

    async SynchronizeAfterOrdering(order) {
        const productInforsMap=order.items.reduce((acc,item)=>{
            const data={
                weight:item.quantity,
            };
            acc[item.productId]=data;
            return acc;
        },{});
        const updateCommand={
            index:INDEX_NAME,
            body:{
                script:{
                    source:`
                    def inputsData=params.productInforsMap[ctx._id];
                    if(ctx._source.containsKey('name') && ctx._source.name.containsKey('weight')){
                        ctx._source.name.weight+=inputsData.weight;
                    }else{
                        ctx._source.name.weight=1;
                    }
                    `,
                    lang:"painless",
                    params:{
                        productInforsMap
                    }
                },
                query:{
                    terms:{
                        _id:order.items.map((item)=>item.productId)
                    }
                }
            }
        };
        return await client.updateByQuery(updateCommand);
    },

    async SynchronizeAfterProductCreation(product){
        const createCommand={
            index:INDEX_NAME,
            refresh:true,
            id:product._id,
            body:getProductInforForIndexFromModel(product),
        };
        await client.index(createCommand);
    },

    async SynchronizeAfterProductDeletion(productId){
        const deleteCommand={
            index:INDEX_NAME,
            body:{
                query:{
                    term:{
                        _id:productId
                    }
                }
            }
        };
        await client.deleteByQuery(deleteCommand);
    },

    async SynchronizeAfterProductUpdate(product){
        console.log(getProductInforForIndexFromModel(product));
        const updateCommand={
            index:INDEX_NAME,
            refresh:true,
            script:{
                source:`
                    ctx._source.name.input=params.product.name.input;
                    ctx._source.price=params.product.price;
                    ctx._source.salePrice=params.product.salePrice;
                    ctx._source.image=params.product.image;
                `,
                lang:"painless",
                params:{
                    product:getProductInforForIndexFromModel(product)
                }
            },
            query:{
                match:{
                    _id:product._id
                }
            }
        };
        return await client.updateByQuery(updateCommand);
    },

    async SynchronizeAllProducts(products){
        const body=products.flatMap((product)=>{
            return [
                {index:{_index:INDEX_NAME,_id:product._id}},
                getProductInforForIndexFromModel(product),
            ];
        });
        const res=await client.bulk({refresh:true,body});
        return res;
    },

};


export default suggesterService;