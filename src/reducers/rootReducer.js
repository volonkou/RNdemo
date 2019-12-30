
import {combineReducers} from 'redux';
import cartReducer from "./cartReducer";
import AuthReducer from './authReducer';
const rootReducer = combineReducers({
    cart:cartReducer,
    auth:AuthReducer,
});



export default rootReducer;
