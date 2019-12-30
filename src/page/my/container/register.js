import React from 'react';
import {connect} from 'react-redux';
import {userLoginAction,userRegister} from "../../../actions/authAction"
import RegisterForm from "../component/registerform"
import LinearGradient from 'react-native-linear-gradient'

class Register extends React.Component{

    static navigationOptions = ({navigation})=>({
        title: '注册账号',
        headerBackTitle:null
    })

    handleRegister = (data) =>{
        userRegister(data).then(res=>{
            console.log(res,"111")
            const loginData={}
            loginData.name=res.data.name
            loginData.password=res.data.phone.substr(-4)

            this.props.userLoginAction(loginData)

        }).catch(error=>{
            console.log(error.response,"22222")
        })
    }




    render(){
        return(
            <LinearGradient colors={["#57AFFF","#2A63BF","#042289"]} style={{flex:1}}>
                <RegisterForm
                    register={this.handleRegister}
                    navigation = {this.props.navigation}
                    />
            </LinearGradient>
        )
    }
}

function mapStateToProps(state) {
    return {
        token:""
    }
}


export default connect(mapStateToProps,{userLoginAction})(Register)