import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {authLogout} from "../../../actions/authAction"

class Mycenter extends Component {

    static navigationOptions = ({navigation})=>({
        title:'个人中心',
        headerLeft:( <View/>),
        headerTitleStyle:{flex:1,textAlign:'center'},
        headerRight:(
            <View/>
        ),
    });


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener('didFocus', () => {
                const {authenticated} = this.props;

                if (!authenticated) {
                    this.props.navigation.navigate('Login')
                }
            }
        )

    }
    componentWillUnmount() {
        // 移除监听
        this.viewDidAppear.remove();
    }



    render() {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate("Order")
                    }}
                >
                    <View style={styles.btnView}>
                        <Text>全部订单</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.props.authLogout()
                    this.props.navigation.navigate("HomeTab")
                }}>
                    <View style={styles.btnView}>
                        <Text>注销</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btnView:{
        width: 100,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#00267C",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});

function mapStateToProps({auth}) {
    return {
        authenticated: auth.authenticated,
        token: auth.token
    }

}


export default connect(mapStateToProps, {authLogout})(Mycenter)