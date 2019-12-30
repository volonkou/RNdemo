import React from 'react';
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, Image} from "react-native";
import {connect} from 'react-redux';
import {goodsDetail} from "../../../actions/commodityAction"
import {GetShoppingCartCount, postCartgoods, getCartList} from "../../../actions/cartAction"
import {storage, width} from "../../../util/functions";
import ToastComponent from "../../common/Toast"


class GoodDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemData: "",
            price: "",
            index: this.props.navigation.state.params.index,
            cartList: [],
            num:1
        }
    }


    componentDidMount() {
        const {id} = this.props.navigation.state.params;
        goodsDetail(id).then(res => {
            const item = res.data;
            this.setState({
                itemData: item
            });
        }).catch(error => {
            console.log(error.response)
        })
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
            const good = [{"goods_id": item.id, "quantity": this.state.num}]
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
                            cartList[i].quantity = parseInt(cartList[i].quantity) + parseInt(this.state.num)
                            result = true
                        }
                    }
                    if (!result) {
                        cartList.push({"id": item.id, "quantity": this.state.num});
                    }
                    this.props.GetShoppingCartCount(totalNum + Number(this.state.num))
                    const storageData = JSON.stringify(cartList)
                    storage.save({
                        key: "ShoppingCart",
                        data: storageData
                    })
                    ToastComponent("加入购物车成功",2000)
                })
            }).catch(() => {
                // 本地没数据执行
                const {cartList} = this.state
                cartList.push({"id": item.id, "quantity": this.state.num})
                const storageData = JSON.stringify(cartList)
                this.props.GetShoppingCartCount(this.state.num)
                storage.save({
                    key: "ShoppingCart",
                    data: storageData
                })
                ToastComponent("加入购物车成功",2000)
            })
        }
    }


    addNum=()=>{
        const {num}=this.state
        this.setState({
            num:num +1
        })
    }

    reduceNum=()=>{
        const {num}=this.state
        if(num<=1){
            alert("不能少于1件！")
        }else{
            this.setState({
                num:num -1
            })
        }
    }


    render() {
        const item = this.state.itemData;
        if (item) {
            return (
                <View style={{backgroundColor: "#ffffff", flex: 1}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View>
                            <View>
                                <Text style={{margin: 15, fontSize: 18, color: "#000000"}}>商品详情</Text>
                            </View>
                            <View style={{width: width - 30, marginLeft: 15}}>
                                <Image source={{uri: item.image}} style={{width: width - 20, height: width}}/>
                                <View>
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: 20,
                                        marginBottom: 10
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: "#000000",
                                            fontWeight: "600",
                                            marginRight: 20
                                        }}>{item.title}</Text>
                                        <Text>{item.sub_title}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={{fontSize: 16, marginRight: 15}}>价格</Text>
                                            <Text style={{color: "red", fontSize: 16}}>${item.price}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flexDirection:"row",width:width-30,justifyContent:"space-between",marginTop:20,marginBottom:15}}>
                                    <View style={{flexDirection:"row"}}>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                this.reduceNum()
                                            }}
                                        >
                                            <View style={styles.countIcon}><Text style={{fontSize:18,color:"#ffffff"}}>-</Text></View>
                                        </TouchableOpacity>
                                        <View style={{width:100,height:35,justifyContent:"center",alignItems:"center",borderTopWidth:1,borderBottomWidth:1}}><Text style={{fontSize:18}}>{this.state.num}</Text></View>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                this.addNum()
                                            }}
                                        >
                                            <View style={styles.countIcon}><Text style={{fontSize:18,color:"#ffffff"}}>+</Text></View>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity

                                        onPress={() => {
                                            this.addShoppingCart(item)
                                        }}>
                                        <View style={{width:150,height:35,justifyContent:"center",alignItems:"center",backgroundColor:"red"}}><Text style={{fontSize:18,color:"#ffffff"}}>加入购物车</Text></View>
                                    </TouchableOpacity>
                                </View>


                                <View style={{marginTop: 20}}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: "#000000",
                                        fontWeight: "600",
                                    }}>详情</Text>
                                    <Text style={{fontSize: 16, marginTop: 15}}>{item.describe}</Text>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </View>
            )
        } else {
            return (
                <View></View>
            )
        }
    }
}


const styles = StyleSheet.create({
    header: {
        width: width - 30,
        marginLeft: 15,
        marginTop: 30,
        marginBottom: 5
    },
    headerBack: {
        width: 25,
        height: 25,
        borderRadius: 15,
        backgroundColor: "#ACACAC",
        alignItems: "center",
        justifyContent: "center"
    },
    centerBase: {
        width: width,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 30,
        paddingRight: 30,
        borderTopWidth: 10,
        borderTopColor: "#E3E3E3",
        paddingBottom: 10,
        paddingTop: 10,
    },
    Message: {
        position: "absolute",
        zIndex: 99,
        marginTop: 10,
        backgroundColor: "black",
        borderRadius: 6,
        padding: 10,
        width: 280,
        marginLeft: width * 0.5 - 140,
    },
    countIcon:{
        width:35,
        height:35,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#000000"
    }
});


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        totalNum: state.cart.totalNum
    }

}

export default connect(mapStateToProps, {GetShoppingCartCount})(GoodDetail)

