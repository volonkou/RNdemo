
import {api} from "../util/api"
import variables from "../util/variables";
import Toast from '../page/common/Toast'
import {HTTPRequest} from "../util/httpRequest"
import {setToken,removeToken} from "../util/functions"

const httpRequest = new HTTPRequest(api.BPMEAT_HOST,"token");



// 登陆
export const userLoginAction = (data,successCallback,failCallback) =>{
    return(dispatch)=>{
        httpRequest.post(api.USER.LOGIN,data)
            .then(response=>{
                const data = response.data;
                setToken(data.access_token);
                dispatch({
                    type:variables.USER.LOGIN_USER_SUCCESS,
                    payload:data.access_token
                });
                successCallback();
            })
            .catch(error=>{
                console.log(error.response)
                if(error.response.status===401){
                    Toast(error.response.data.message,3000)
                }
                dispatch({
                    type:variables.USER.LOGIN_USER_FAILED,
                    payload:error.response.data,
                });
                failCallback(error.response.data)
            });
    }
};

// 注册
export function userRegister(data){
    return httpRequest.post(api.USER.USER,data);
}


// 获取手机验证码
export function getSMSCode(data) {
    return httpRequest.post(api.SMS.GET_CODE,data)
}

// 获取图形验证码
export function getImgCode(data) {
    console.log(data,"11111")
    return httpRequest.post(api.SMS.IMG_CODE,data)
}

// 初始化时检测到本地有token，存到redux
export function getLocalToken(token) {
    return {
        type:variables.USER.LOGIN_USER_SUCCESS,
        payload:token
    }

}


//注销
export function authLogout(){
    return(dispatch)=>{
                removeToken();
                dispatch({
                    type:variables.USER.LOGOUT_USER_SUCCESS,
                    payload:0,
                });
    }

}
// 获取用户信息
export function getUserDetail(token){
    httpRequest.setToken(token);
    return httpRequest.post(api.USER.USER);
}