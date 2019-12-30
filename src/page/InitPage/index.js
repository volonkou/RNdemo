import React from 'react';
import {connect} from "react-redux";
import {getLocalToken} from '../../actions/authAction'
import {AsyncStorage, Image, StyleSheet, View} from 'react-native';
import {storage, width, height} from "../../util/functions"
import {GetShoppingCartCount, getCartList, postCartgoods} from "../../actions/cartAction"


class InitPage extends React.Component {
// 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    componentDidMount() {
        setTimeout(() => {
            storage.load({
                key: "token",
                autoSync: true,
                syncInBackground: true
            }).then(res => {
                this.LoginGetGoods(res)
                this.props.getLocalToken(res);
                this.props.navigation.navigate('App');
            }).catch(error => {
                this.props.navigation.navigate('App');
            })
        }, 2000)
    }


    LoginGetGoods = (token) => {
        storage.load({
            key: "ShoppingCart",
            autoSync: true,
            syncInBackground: true
        }).then(res => {
          console.log("出现这个console证明逻辑错误了")
        }).catch(error => {
            // console.log(error,"1111111")
            getCartList(token).then(res => {
                const data = res.data.data
                this.CountTotalNum(data)
            })
        })


    }

    CountTotalNum = (data) => {
        let totalNum = 0
        for (let i = 0; i < data.length; i++) {
            totalNum = totalNum + data[i].quantity
        }
        this.props.GetShoppingCartCount(totalNum)
    }


    render() {
        return (
            <View>
                <Image style={styles.loadingImage} source={require("../../img/swiper4.png")}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    loadingImage: {
        width: width,
        height: height
    }
})


export default connect(null, {getLocalToken,GetShoppingCartCount})(InitPage);