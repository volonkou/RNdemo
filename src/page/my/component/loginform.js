
import React from 'react';
import {Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {FormInput} from '../../common/FormInput'
import {width} from "../../../util/functions";


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            password:'',
        }
    }

    handleInputChange=(state)=>{
        this.setState(state);
    }

    render() {
        const {login} = this.props;
        return (
            <View style={{width:width-80,marginLeft:40,marginTop:50}}>
                <View style={{marginTop:50}}>
                    <Text style={{fontSize:26,color:"#FFFFFF",letterSpacing:10}}>登录</Text>
                </View>
                <View>
                    <View>
                        <FormInput
                            label='手机号'
                            placeholder='手机号'
                            onchange={(name) => {
                                this.handleInputChange({name})
                            }}
                        />
                    </View>
                    <View>
                        <FormInput
                            label='密码'
                            placeholder='密码'
                            password={true}
                            onchange={(password) => {
                                this.handleInputChange({password})
                            }}
                        />
                    </View>

                </View>
                <TouchableOpacity
                    onPress={()=>{
                        login(this.state)}
                    }
                >
                    <View style={styles.loginBtn}>
                        <Text style={{color:"#ffffff",fontSize:18,letterSpacing:10}}>登录</Text>
                    </View>
                </TouchableOpacity>


                <View style={{marginTop:25}}>
                    <TouchableOpacity
                        style={{width:150,alignSelf:"flex-end"}}
                        onPress={()=>{
                            this.props.navigation.navigate("Register")
                        }}
                    >
                        <Text style={{alignSelf:"flex-end"}}>还没账号？去注册~</Text>
                    </TouchableOpacity>
                </View>
            </View>


        )
    }
}


const styles=StyleSheet.create({
    loginBtn:{
        borderWidth:1,
        borderColor:"#ffffff",
        marginTop:30,
        height:45,
        borderRadius:5,
        alignItems: "center",
        justifyContent: "center",
    }
})

LoginForm.propTypes = {
    login: PropTypes.func.isRequired,
    goToPage:PropTypes.func
}


export default LoginForm;
