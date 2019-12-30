import React from 'react';
import {connect} from 'react-redux';
import {userLoginAction} from "../../../actions/authAction"
import {GetShoppingCartCount, getCartList, postCartgoods} from "../../../actions/cartAction"
import LoginForm from "../component/loginform"
import LinearGradient from 'react-native-linear-gradient';
import {storage} from "../../../util/functions"

class Login extends React.Component {

    handleLogin = (data) => {
        this.props.userLoginAction(data,
            () => {
                this.LoginGetGoods(this.props.token)
                this.props.navigation.goBack()
                this.props.navigation.navigate("HomeTab")
            },
            (a) => {
                const {navigation} = this.props;
                navigation.navigate('Auth')
            });
    }


    LoginGetGoods = (token) => {
        // 先查找本地是否有数据
        storage.load({
            key: "ShoppingCart",
            autoSync: true,
            syncInBackground: true
        }).then(res => {

            const data = JSON.parse(res)
            const goodsData = []
            for (var i = 0; i < data.length; i++) {
                const good = {"goods_id": data[i].id, "quantity": data[i].quantity}
                goodsData.push(good)
            }
            const Data = JSON.stringify(goodsData)
            const carts = {"carts": Data}
            // 登陆完成后将本地购物车的商品提交到API
            postCartgoods(carts, token).then(res => {
            //提交成功之后请求api
                getCartList(token).then(res => {
                    const data = res.data.data
                    //计算商品总数
                    this.CountTotalNum(data)
                    // 提交与请求都成功之后删除本地数据
                    storage.remove({key: 'ShoppingCart'})
                })

            }).catch(error => {
                console.log(error, "22222")
            })

        }).catch(error => {
            // console.log(error)
            getCartList(token).then(res => {
                const data = res.data.data
                this.CountTotalNum(data)
            })
        })


    }
// 商品数量计算
    CountTotalNum = (data) => {
        let totalNum = 0
        for (let i = 0; i < data.length; i++) {
            totalNum = totalNum + data[i].quantity
        }
        this.props.GetShoppingCartCount(totalNum)
    }


    render() {
        return (
            <LinearGradient colors={["#57AFFF", "#2A63BF", "#042289"]} style={{flex: 1}}>
                <LoginForm
                    login={this.handleLogin}
                    navigation={this.props.navigation}
                />
            </LinearGradient>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.auth.token
    }
}


export default connect(mapStateToProps, {userLoginAction, GetShoppingCartCount})(Login)