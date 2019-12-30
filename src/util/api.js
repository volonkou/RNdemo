
const API_HOST = 'http://serverpro.e4hub.com/api/'

export const api = {
    BPMEAT_HOST: API_HOST,
    //商品相关URL
    Goods: {
        URL: 'goods',
        ALL_GOODS: '?page=',
        GOODS_DETAIL: '?include=category',
        ADVRETISING:"advertising",
        IDS:"?ids="
    },
    //用户相关URL
    USER: {
        // REGISTER:
        REGISTER: 'user/register',
        LOGIN: 'authorizations',
        USER: "user",
        EDIT: 'user/edit',
        LOGOUT: 'authorizations/delete'
    },
    //短信相关URL
    SMS: {
        GET_CODE: 'verifyCode',
        IMG_CODE:"captchas"
    },
    //购物车相关API
    CART: {
        URL: 'cart',
        ID:"/"
    },
    ORDER:{
        URL:"orders",
        PER_PAGE:"?page="
    },
    CATE: {
        URL:"category",
        CATE: "?include=goods"
    },
    AD:"advertising"
};
