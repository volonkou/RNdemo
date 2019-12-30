
// 整个语句都开启严格模式的语法
"use strict";
import React from "react";
import axios from 'axios';
import querystring from 'query-string';
import {store} from '../store/configureStore';

const getToken = ()=>{
    return store.getState().auth.token;
}


class HTTPRequest  {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
        this.request = axios;
    }

    setToken(token){
        let headers = {};
        // if(token){
            headers = {
                'Authorization':"Bearer "+getToken()
            }
        // }
        this.headers = headers;
    }

    get(url){
        return axios({
            method:'get',
            url:this.baseUrl+url,
            headers:this.headers
        });
    }

    post(url,obj){
            return axios({
                method:'post',
                url:this.baseUrl+url,
                data:obj,
                headers:this.headers
            });
    }
    put(url,obj){
        return axios({
            method:'put',
            url:this.baseUrl+url,
            data:querystring.stringify(obj),
            headers:this.headers
        });

    }
    patch(url,obj){
        return axios({
            method:'patch',
            url:this.baseUrl+url,
            data:obj,
            headers:this.headers
        });
    }
    delete(url,obj){
        this.headers['content-type']='application/x-www-form-urlencoded';
        return axios({
            method:'delete',
            url:this.baseUrl+url,
            data:obj,
            headers:this.headers
        });
    }
}
export {HTTPRequest};
