import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image,Modal} from 'react-native';
import {connect} from 'react-redux';
import {
    GetShoppingCartCount,
    getCartList,
    deleteCartgoods,
    patchCartgoods,
    CreateOrider
} from "../../../actions/cartAction"
import {getGoodsIds} from "../../../actions/commodityAction"
import {SwipeListView} from 'react-native-swipe-list-view';
import {storage, width,PX} from "../../../util/functions";

class Cart extends Component {

    static navigationOptions = ({navigation}) => ({
        title: '购物车'
    });


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            cartList: "",
            totalPrice: 0,
            isOk: true,
            modalVisible: false,
        };
    }

    componentDidMount() {
        this.GetCartData()
    }

    componentWillReceiveProps() {
        this.GetCartData()
    }

    GetCartData = () => {
        const {token} = this.props
        if (token) {
            getCartList(token).then(res => {
                const data = res.data.data

                if (data.length !== 0) {
                    const IDS = []
                    for (let i = 0; i < data.length; i++) {
                        IDS.push(data[i].id)
                    }
                    this.CountCartData(IDS, data)
                } else {
                    this.setState({
                        cartList: ""
                    })
                }

            }).catch(error => {
                console.log(error)
            })
        } else {
            storage.load({
                key: "ShoppingCart",
                autoSync: true,
                syncInBackground: true
            }).then(res => {
                const data = JSON.parse(res)
                const IDS = []
                for (let i = 0; i < data.length; i++) {
                    IDS.push(data[i].id)
                }

                this.CountCartData(IDS, data)
            }).catch(error => {

            })
        }
    }


    // 提取出获取到数据后商品的计算方法，本地和在线公用
    CountCartData = (id, data) => {
        getGoodsIds(id).then(res => {
            const goodsdata = res.data.data
            let totalPrice = 0
            for (let i = 0; i < goodsdata.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (goodsdata[i].id === data[j].id) {
                        goodsdata[i].quantity = data[j].quantity
                        if (this.props.token) {
                            goodsdata[i].goods_id = data[j].goods_id
                        } else {
                            goodsdata[i].goods_id = data[j].id
                        }
                    }
                }
                totalPrice = totalPrice + Number(goodsdata[i].price) * Number(goodsdata[i].quantity)
            }
            this.setState({
                cartList: goodsdata,
                totalPrice: totalPrice.toFixed(2),
                isOk: true
            })
        }).catch(error => {
        })
    }


    // 购物车商品自加的方法
    addCart = (data) => {
        const {cartList} = this.state
        const {token, totalNum, GetShoppingCartCount} = this.props
        this.setState({
            isOk: false
        })
        for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].id === data.id) {
                cartList[i].quantity++
                if (token) {
                    // 这里将数据提交到API
                    const id = data.id
                    const action = {action: "add"}
                    patchCartgoods(id, action, token).then(res => {
                        GetShoppingCartCount(totalNum + 1)
                        this.setState({
                            isOk: true
                        })
                    }).catch(error => {
                        alert("你操作太频繁了，等一分钟回来再玩！")
                        console.log(error.response)
                        this.setState({
                            isOk: true
                        })
                    })
                } else {
                    storage.load({
                        key: "ShoppingCart",
                        autoSync: true,
                        syncInBackground: true
                    }).then((res) => {
                        this.CountAddReduceCart(res, cartList[i])
                    })
                }
            }
        }
        this.setState({cartList})
    }


    // 购物车商品自减的方法
    reduceCart = (data) => {
        const {cartList} = this.state
        const {token, totalNum, GetShoppingCartCount} = this.props
        this.setState({
            isOk: false
        })
        for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].id === data.id) {
                if (cartList[i].quantity <= 1) {
                    alert("商品不能少于1件！")
                    this.setState({
                        isOk: true
                    })
                } else {
                    cartList[i].quantity--


                    if (token) {
                        // 这里将数据提交到API，这里购物车加减在API上做了限制，一分钟之内只能加和减20次，
                        const id = data.id
                        const action = {action: "reduce"}
                        patchCartgoods(id, action, token).then(res => {
                            GetShoppingCartCount(totalNum - 1)
                            this.setState({
                                isOk: true
                            })
                        }).catch(error => {
                            alert("你操作太频繁了，等一分钟回来再玩！")
                            console.log(error.response)
                            this.setState({
                                isOk: true
                            })
                        })
                    } else {
                        storage.load({
                            key: "ShoppingCart",
                            autoSync: true,
                            syncInBackground: true
                        }).then((res) => {
                            this.CountAddReduceCart(res, cartList[i])
                        })
                    }
                }

            }
        }
        this.setState({cartList})
    }


    // 本地购物车商品自加自减后计算公用方法
    CountAddReduceCart = (res, cartList) => {
        const localdata = JSON.parse(res)
        let totalNum = 0
        for (let j = 0; j < localdata.length; j++) {
            if (cartList.id === localdata[j].id) {
                localdata[j].quantity = cartList.quantity
            }
            totalNum = totalNum + localdata[j].quantity
        }
        this.props.GetShoppingCartCount(totalNum)
        const storageData = JSON.stringify(localdata)
        storage.save({
            key: "ShoppingCart",
            data: storageData
        })
    }


    // 删除购物车方法
    removeCart = (id) => {
        const {cartList} = this.state
        const {token, totalNum, GetShoppingCartCount} = this.props
        const lastdata = []
        for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].id === id) {
                if (token) {
                    // 这里将数据提交到API
                    deleteCartgoods(id, token).then(res => {
                        console.log(res)
                        GetShoppingCartCount(totalNum - Number(cartList[i].quantity))
                    }).catch(error => {
                        console.log(error)
                    })
                } else {
                    GetShoppingCartCount(totalNum - Number(cartList[i].quantity))
                }
            } else {
                lastdata.push(cartList[i])
            }
        }

        // 这里判断无token的情况下将删除购物车之后的数据存到本地
        if (!token) {
            if (lastdata.length === 0) {
                this.props.GetShoppingCartCount(0)
                storage.remove({key: 'ShoppingCart'})
            }
            storageData = JSON.stringify(lastdata)
            storage.save({
                key: "ShoppingCart",
                data: storageData
            })
        }
        this.setState({cartList: lastdata})

    }

    //下订单方法
    PostOrider = (data) => {
        const oriderData = []
        for (var i = 0; i < data.length; i++) {
            const good = {"goods_id": data[i].goods_id, "quantity": data[i].quantity}
            oriderData.push(good)
        }
        const Data = JSON.stringify(oriderData)
        const Goods = {"goods": Data}

        const {token} = this.props
        if (token) {
            CreateOrider(Goods, token).then(res => {
                this.props.GetShoppingCartCount(0)
                this.setState({
                    modalVisible:true
                })

            }).catch(error => {
                console.log(error.response)
            })
        } else {
            this.props.navigation.navigate("Login")
        }

    }

    render() {
        // 判断购物车内是否有商品
        return this.state.cartList && this.state.cartList.length !== 0 ?
            <View style={{flex: 1, backgroundColor: "#ffffff"}}>
                <SwipeListView
                    useFlatList={true}
                    data={this.state.cartList}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={(data, rowMap) => (

                        <View style={{
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: "#E3E3E3",
                            width: width - 30,
                            flexDirection: "row",
                            marginLeft: 15,
                            backgroundColor: "#ffffff",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <TouchableOpacity
                                onPress={() => console.log(data)}
                                activeOpacity={1}
                            >
                                <View style={{flexDirection: "row"}}>
                                    <View style={{
                                        width: 85,
                                        height: 105,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Image source={{uri: data.item.image}} style={{width: 75, height: 95}}/>
                                    </View>
                                    <View style={{marginLeft: 10}}>
                                        <Text>{data.item.title}</Text>
                                        <Text>{data.item.price}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection: "row", alignItems: "center", marginRight: 15,}}>

                                {
                                    this.state.isOk ?
                                        <TouchableOpacity
                                            onPress={() => this.reduceCart(data.item)}
                                        >
                                            <View>
                                                <Text style={{fontSize: 24, color: "red"}}>-</Text>
                                            </View>
                                        </TouchableOpacity> :
                                        <View>
                                            <Text style={{fontSize: 24}}>-</Text>
                                        </View>
                                }
                                <Text style={{marginLeft: 15, marginRight: 15}}>{data.item.quantity}</Text>
                                {
                                    this.state.isOk ?
                                        <TouchableOpacity
                                            onPress={() => this.addCart(data.item)}
                                        >
                                            <View>
                                                <Text style={{fontSize: 24}}>+</Text>
                                            </View>
                                        </TouchableOpacity> :
                                        <View>
                                            <Text style={{fontSize: 24}}>+</Text>
                                        </View>
                                }
                            </View>
                        </View>

                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={{
                            width: 75,
                            height: 107,
                            backgroundColor: "red",
                            alignSelf: "flex-end",
                            marginRight: 15,
                            marginTop: 10
                        }}>
                            <TouchableOpacity
                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                onPress={() => {
                                    this.removeCart(data.item.id)
                                }}
                            >
                                <Text style={styles.backTextWhite}>删除</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    disableRightSwipe={true}
                    rightOpenValue={-75}
                    previewRowKey={'0'}
                />
                <View
                    style={{flexDirection: "row", justifyContent: "space-between", width: width - 30, marginLeft: 15}}>
                    <View>
                        <Text style={{fontSize: 28, color: "red"}}>总数：{this.props.totalNum}</Text>
                        <Text style={{fontSize: 28, color: "red"}}>总价：{this.state.totalPrice}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.PostOrider(this.state.cartList)
                        }}
                    >
                        <View style={{
                            width: 100,
                            height: 50,
                            backgroundColor: "green",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Text style={{fontSize: 24}}>下单</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </View>
            : <View style={{flex: 1, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity
                    style={{
                        width: 200,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: "blue",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    onPress={() => this.props.navigation.navigate("HomeTab")}
                >
                    <Text>去购物</Text>
                </TouchableOpacity>
                {
                    this.render_Modal()
                }
            </View>
    }


// 下单成功返回的提示框
    render_Modal = () => {
        return (
            <Modal
                visible={this.state.modalVisible}
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => this.closeModal()}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}>
                    <View style={{
                        width: width * 0.8,
                        height: 155,
                        backgroundColor: "#ffffffff",
                        justifyContent: "space-between",
                        borderRadius: 5
                    }}>
                        <View style={{width: width * 0.8, justifyContent: "center", alignItems: "center"}}>

                                    <View>
                                        <Text fontSize={17} style={{
                                            fontWeight: "600",
                                            margin: 15,
                                            letterSpacing: 2,
                                            textAlign:"center"
                                        }}>下单成功</Text>
                                        <Text fontSize={13}>您可以查看订单或者继续购物！</Text>
                                    </View>

                        </View>
                        <View style={{flexDirection: "row"}}>
                            <View style={styles.modelbtn}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            modalVisible: false
                                        }, () => {
                                            this.props.navigation.navigate("Order")
                                        })
                                    }}
                                >
                                    <Text fontSize={17} style={{color: "#007AFF"}}>查看订单</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        modalVisible: false
                                    }, () => {
                                        this.props.navigation.navigate("home")
                                    })

                                }}
                            >
                                <View style={[styles.modelbtn, {borderLeftWidth: PX, borderLeftColor: "#707070"}]}>
                                    <Text fontSize={17} style={{color: "#007AFF"}}>继续购物</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

}
const styles = StyleSheet.create({

    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        height: 105
    },
    modelbtn: {
        width: width * 0.4,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: PX,
        borderTopColor: "#707070"
    }
})

function mapStateToProps(state) {
    // console.log(state)
    return {
        token: state.auth.token,
        totalNum: state.cart.totalNum
    }

}

export default connect(mapStateToProps, {GetShoppingCartCount})(Cart)