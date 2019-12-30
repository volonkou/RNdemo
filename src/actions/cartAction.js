import variables from '../util/variables';
import {HTTPRequest} from "../util/httpRequest"
import {api} from "../util/api"

const httpRequest = new HTTPRequest(api.BPMEAT_HOST);
// 获取购物车商品总数
export const GetShoppingCartCount = (data) => {
    return (dispatch) => {
        dispatch({
            type: variables.SHOPPING_CART.COUNT,
            payload: data
        });
    }
};

//获取购物车列表
export function getCartList(token){
    httpRequest.setToken(token);
    return httpRequest.get(api.CART.URL);

}

//提交商品到购物车API
export function postCartgoods(data,token){
    httpRequest.setToken(token);
    return httpRequest.post(api.CART.URL,data);

}

//删除购物车商品
export function deleteCartgoods(id,token){
    httpRequest.setToken(token);
    return httpRequest.delete(api.CART.URL+api.CART.ID+id);

}

// 购物车商品加减
export function patchCartgoods(id,data,token){
    httpRequest.setToken(token);
    return httpRequest.patch(api.CART.URL+api.CART.ID+id,data);
}

// 下订单
export function CreateOrider(data, token) {
    httpRequest.setToken(token);
    return httpRequest.post(api.ORDER.URL, data);
}

// 获取所有订单
export function GetOrider(page) {
    return httpRequest.get(api.ORDER.URL+api.ORDER.PER_PAGE+page);
}