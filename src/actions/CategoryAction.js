

import {api} from "../util/api"
import {HTTPRequest} from "../util/httpRequest"
const httpRequest = new HTTPRequest(api.BPMEAT_HOST);


export function getCategory(){
    return httpRequest.get(api.CATE.URL+api.CATE.CATE);
}

export function getCateItem(id){
    return httpRequest.get(api.CATE.URL+"/"+id+api.CATE.CATE);
}

