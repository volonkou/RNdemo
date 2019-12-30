import variables from '../util/variables';
const INITIAL_STATE = {
    totalNum: 0
};



export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // 获取购物车商品总数
        case variables.SHOPPING_CART.COUNT:
            return {...state, totalNum: action.payload};
        case variables.USER.LOGOUT_USER_SUCCESS:
            return {...state, totalNum: action.payload};
        default:
            return state;
    }
}
