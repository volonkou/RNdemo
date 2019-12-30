import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, TextInput, Image, Modal} from 'react-native';
import {getImgCode, getSMSCode} from "../../../actions/authAction"
import PropTypes from 'prop-types';
import Toast from '../../common/Toast'
import {FormInput} from '../../common/FormInput'
import {width} from "../../../util/functions";


class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            verify_code: '',
            isSend: false,
            num: 60,
            modalVisible: false,
            captcha_key: "",
            captcha_code: "",
            captcha_image_content: "",
            key: ""
        }
    }

    Timer() {
        var num = this.state.num
        const timer = setInterval(() => {
            num--
            if (num == 0) {
                this.setState({
                    isSend: false,
                    num: 60
                })
                clearInterval(timer)
            } else {
                this.setState({
                    num: num
                })
            }
        }, 1000)
    }

    GetImgCode = (data) => {
        const Data = {}
        Data.phone = data
        getImgCode(Data).then(res => {
            this.setState({
                modalVisible: true,
                captcha_key: res.data.captcha_key,
                captcha_image_content: res.data.captcha_image_content
            })


        }).catch(error => {
            console.log(error.response)
        })
    }


    HandleSubmit = () => {
        const {captcha_code, captcha_key} = this.state
        const data = {}
        data.captcha_code = captcha_code
        data.captcha_key = captcha_key
        getSMSCode(data).then(res => {
            Toast('验证码已发送', 3000);
            this.setState({
                key:res.data.key
            })
        }).catch(error => {
            Toast(error.response.data.message, 3000);
            console.log(error.response)
        })

        this.setState({
            isSend: true,
            modalVisible: false
        })
        this.Timer()
    }

    HandleRegister(){
        const {verify_code,key}=this.state
        const data={}
         data.verify_code=verify_code
        data.key=key
        this.props.register(data)
    }


    render() {
        const ImgCode = this.state.captcha_image_content


        return (
            <View style={{width: width - 80, marginLeft: 40,marginTop:50}}>
                <View style={{marginTop: 30, flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={{fontSize: 26, color: "#FFFFFF", letterSpacing: 10}}>注册</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate("Login")
                        }}
                    >
                        <Text>登录</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <View>
                        <View style={{marginTop: 15}}>
                            <Text style={styles.labelStyle}>
                                手机号
                            </Text>
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder={"手机号"}
                                placeholderTextColor={"#00F5FF"}
                                onChangeText={(phone) => {
                                    this.setState({
                                        phone
                                    })
                                }}
                            />
                            {
                                this.state.phone ?
                                    <View>
                                        {
                                            this.state.isSend ?
                                                <View>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color: "gray"
                                                    }}>{this.state.num}s后重新获取</Text>
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.GetImgCode(this.state.phone)

                                                    }
                                                    }
                                                >
                                                    <Text style={{color: "#ffffff", fontSize: 12}}>获取验证码</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                    :
                                    <View>
                                        <Text style={{color: "gray", fontSize: 12}}>获取验证码</Text>
                                    </View>
                            }
                        </View>
                    </View>


                    <View>
                        <FormInput
                            label='验证码'
                            placeholder='验证码'
                            onchange={(verify_code) => {
                                this.setState({
                                    verify_code
                                })
                            }}
                        />
                    </View>


                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.HandleRegister()
                    }
                    }
                >
                    <View style={styles.loginBtn}>
                        <Text style={{color: "#ffffff", fontSize: 18, letterSpacing: 10}}>注册</Text>
                    </View>
                </TouchableOpacity>


                {
                    this.state.modalVisible ?
                        <Modal
                            visible={this.state.modalVisible}
                            animationType={'slide'}
                            transparent={true}
                            onRequestClose={() => this.closeModal()}
                        >
                            <View style={{
                                flex: 1,
                                // justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: 'rgba(0,0,0,0.6)'
                            }}>
                                <View style={{
                                    width: width * 0.8,
                                    height: 155,
                                    backgroundColor: "#ffffffff",
                                    // justifyContent: "space-between",
                                    alignItems: "center",
                                    borderRadius: 5,
                                    marginTop: 200
                                }}>


                                    <Text style={{marginTop: 15}}>
                                        请输入图形验证码
                                    </Text>
                                    <View style={styles.inputView}>
                                        <TextInput
                                            style={styles.inputStyle}
                                            placeholder={"图形验证码"}
                                            placeholderTextColor={"#00F5FF"}
                                            onChangeText={(captcha_code) => {
                                                this.setState({
                                                    captcha_code
                                                })
                                            }}
                                        />
                                        <View>
                                            <TouchableOpacity
                                                onPress={()=>{
                                                    this.GetImgCode(this.state.phone)
                                                }}
                                            >
                                                <Image
                                                    style={{width: 100, height: 30}}
                                                    source={{uri: ImgCode}}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => this.HandleSubmit()}
                                    >
                                        <View
                                            style={{
                                                width: 100,
                                                height: 30,
                                                borderRadius: 15,
                                                borderWidth: 1,
                                                borderColor: "#00267C",
                                                marginTop: 20,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                            <Text>提交</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal> : null
                }

            </View>


        )
    }
}


const styles = StyleSheet.create({
    loginBtn: {
        borderWidth: 1,
        borderColor: "#ffffff",
        marginTop: 30,
        height: 45,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    inputStyle: {
        color: '#00F5FF',
        height: 40,
        width: 180,
        paddingLeft: 15,
        fontSize: 14,
        letterSpacing: 3
    },
    inputView: {
        flexDirection: "row",
        height: 40,
        marginTop: 15,
        borderRadius: 5,
        backgroundColor: "#00267C",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 10
    },
    labelStyle: {
        fontSize: 14,
        color: "#ffffff",
        marginLeft: 5,
        letterSpacing: 3
    }
})

RegisterForm.propTypes = {
    register: PropTypes.func.isRequired,
}


export default RegisterForm;
