const mockCartData = [
    {
        _id: '673d536477729f46dde0ef3g',
        userId: '673d536477729f46dde0ef3b',
        items: [
            {
                productId: '673061039c8c95649b045ccf',
                quantity: 2
            },
            {
                productId: '673061039c8c95649b045cd0',
                quantity: 1
            },
            {
                productId: '673061039c8c95649b045cd1',
                quantity: 1
            },
            {
                productId: '673061039c8c95649b045cd2',
                quantity: 1
            },
        ],
        __v: 0
    },
    {
        _id: '67469079628b5ce1a1b2f7e7',
        userId: '6740b734075c2937232d7cc3',
        items: [
            {
                productId: '673061039c8c95649b045ccf',
                quantity: 1
            },
            {
                productId: '673061039c8c95649b045cd0',
                quantity: 2
            },
            {
                productId: '673061039c8c95649b045cd1',
                quantity: 3
            },
        ],
        __v: 0
    }
]


const mockCartService = {
    getCartByUserId: async (userId) => {
        const cart = mockCartData.find(cart => cart.userId === userId);
        return cart || null; 
    },

}

export default mockCartService;