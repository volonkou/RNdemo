import React from 'react';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Text, TouchableOpacity, Image, StyleSheet} from "react-native";
import {GetShoppingCartCount, postCartgoods, getCartList} from "../../../actions/cartAction"
import {storage, width} from "../../../util/functions";

class GoodsListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            cartList: []
        }
    }



    // 计算购物车总数方法
    CountTotalNum = (data) => {
        let totalNum = 0
        for (let i = 0; i < data.length; i++) {
            totalNum = totalNum + data[i].quantity
        }
        this.props.GetShoppingCartCount(totalNum)
    }


    addShoppingCart = (item) => {
        const {token, totalNum} = this.props
        if (token) {
            const good = [{"goods_id": item.id, "quantity": 1}]
            const Data = JSON.stringify(good)
            const carts = {"carts": Data}
            // 用户登陆的情况下将加入购物车的数据提交到API
            postCartgoods(carts, token).then(res => {
                // 获取api购物车列表数据
                getCartList(token).then(res => {
                    const data = res.data.data
                    //计算购物车商品总数
                    this.CountTotalNum(data)
                })
            }).catch(error => {
                console.log(error, "22222")
            })
        } else {
            storage.load({
                key: "ShoppingCart",
                autoSync: true,
                syncInBackground: true
            }).then((res) => {
                // 本地有数据执行
                this.setState({
                    cartList: JSON.parse(res)
                }, () => {
                    const {cartList} = this.state
                    let result = false;
                    for (let i = 0; i < cartList.length; i++) {
                        if (cartList[i].id === item.id) {
                            cartList[i].quantity = parseInt(cartList[i].quantity) + parseInt(1)
                            result = true
                        }
                    }
                    if (!result) {
                        cartList.push({"id": item.id, "quantity": 1});
                    }
                    this.props.GetShoppingCartCount(totalNum + 1)
                    const storageData = JSON.stringify(cartList)
                    storage.save({
                        key: "ShoppingCart",
                        data: storageData
                    })
                })
            }).catch(() => {
                // 本地没数据执行
                const {cartList} = this.state
                cartList.push({"id": item.id, "quantity": 1})
                const storageData = JSON.stringify(cartList)
                this.props.GetShoppingCartCount(1)
                storage.save({
                    key: "ShoppingCart",
                    data: storageData
                })
            })
        }
    }




    render() {
        const {item, navigation, numColumns} = this.props;
        return (
            <View style={numColumns === "1" ? styles.item1 : styles.item2}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("gooddetail", {
                        id: item.id
                    })}
                >
                    {/*商品不同的排列方式，加载不同的样式*/}
                    <View style={{flexDirection:numColumns === "1" ?"row":"column"}}>
                        <View
                            style={{
                                width: numColumns === "1" ?85:(width - 60) / 2,
                                height: 105,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                style={{width: 75, height: 95}}
                                source={{uri: item.image}}
                            />
                        </View>
                        <View style={{height:70,justifyContent:"space-between",marginLeft:10}}>
                            <Text style={{fontSize: 18, marginTop: 10}}>{item.title}</Text>
                            <View style={{flexDirection: "row"}}>
                                <Text style={{fontSize: 18}}>价格：</Text>
                                <Text style={{fontSize: 18, color: "red"}}>${item.price}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={numColumns === "1"?{marginRight:20}:styles.cart}>
                    <TouchableOpacity
                        onPress={() => {
                            this.addShoppingCart(item)
                        }}>
                        <Icon type="Entypo" name="shopping-cart" color="red" size={30}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

GoodsListItem.propTypes = {
    item: PropTypes.object.isRequired,
    navigation: PropTypes.object,
    index: PropTypes.number,
}

const styles = StyleSheet.create({
    item1: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E3E3E3",
        width: width - 30,
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    item2: {
        marginLeft: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E3E3E3",
        width: (width - 60) / 2,
        marginRight: 15,
        flexDirection:"column"
    },cart:{
        marginBottom:10,
        marginTop:20
    }

})
function mapStateToProps(state) {
    return {
        token: state.auth.token,
        totalNum: state.cart.totalNum
    }

}

export default connect(mapStateToProps, {GetShoppingCartCount})(GoodsListItem);
