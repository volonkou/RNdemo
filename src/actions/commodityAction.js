
import {api} from "../util/api"
import {HTTPRequest} from "../util/httpRequest"
const httpRequest = new HTTPRequest(api.BPMEAT_HOST);



//获取所有商品列表
export function getGoodsList(page){
    return httpRequest.get(api.Goods.URL+api.Goods.ALL_GOODS+page);

}

//商品详细信息
export function goodsDetail(id){
    return httpRequest.get(api.Goods.URL+'/'+id+api.Goods.GOODS_DETAIL);
}


//多id获取商品
export function getGoodsIds(data){
    return httpRequest.get(api.Goods.URL+api.Goods.IDS+data);
}

//获取广告
export function getAd(){
    return httpRequest.get(api.AD);

}