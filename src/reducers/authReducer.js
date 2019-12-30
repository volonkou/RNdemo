
import variables from '../util/variables';


const INITIAL_STATE = {
    user:'',
    token:"",
    authenticated:false,
    authError:null,
};

export default (state = INITIAL_STATE,action) => {

    switch (action.type) {
        /**
         * 用户登陆
         */
        case variables.USER.LOGIN_USER_SUCCESS:
            return {...state,token:action.payload,authenticated:true};
        case variables.USER.LOGIN_USER_FAILED:
            return {...state,authError:action.payload};
        /**
         * 根据token获取用户详情
         */
        case variables.USER.LOGOUT_USER_SUCCESS:
            return INITIAL_STATE;

        default:
            return state;
    }
}
