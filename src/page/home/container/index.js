import React, {Component} from "react"
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native"
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import {getGoodsList, getAd} from "../../../actions/commodityAction"
import {GetShoppingCartCount} from "../../../actions/cartAction"
import {width, height, storage} from "../../../util/functions"
import {ScrollFlatList} from "../../common/ScrollFlatList";
import GoodsListItem from "../component/goodsListItem"

import Swiper from 'react-native-swiper';

class Home extends Component {

    static navigationOptions = ({navigation}) => ({
        title: '首页',
        headerLeft: ( <View/>),
        headerTitleStyle: {flex: 1, textAlign: 'center'},
        headerRight: (
            <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                    navigation.navigate("qrcode")
                }}
            >
                <Icon type="material-community" name="qrcode-scan" size={24} color="black"/>
            </TouchableOpacity>
        ),
    });

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectListOn: true,
            goodsData: "",
            numColumns: "1",
            adData: ""
        };
    }


    componentDidMount() {

        // 无token情况下本地数据处理
        storage.load({
            key: "ShoppingCart",
            autoSync: true,
            syncInBackground: true
        }).then(res => {
            const data = JSON.parse(res)
            this.CountTotalNum(data)
        }).catch(error => {
            // console.log(error)
        })

        getAd().then(res => {

            this.setState({
                adData: res.data.data
            })
        }).catch(error => {
            console.log(error.respones)
        })

    }

    // 计算购物车商品总数方法
    CountTotalNum = (data) => {
        let totalNum = 0
        for (let i = 0; i < data.length; i++) {
            totalNum = totalNum + data[i].quantity
        }
        this.props.GetShoppingCartCount(totalNum)
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#ffffff"}}>
                <View style={{width: width - 30, marginLeft: 15}}>
                    <View style={{
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <View>
                            <Text style={{fontSize: 26, color: "#000000"}}>商品列表</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            {/*切换商品排列方式*/}
                            {
                                this.state.selectListOn ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                selectListOn: false,
                                                numColumns: "2"
                                            })
                                        }}
                                    >
                                        <Icon type="MaterialIcons" name="view-comfy" size={24} color="#707070"/>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                selectListOn: true,
                                                numColumns: "1"
                                            })
                                        }}
                                    >
                                        <Icon type="Entypo" name="menu" size={24} color="#707070"/>
                                    </TouchableOpacity>
                            }

                        </View>
                    </View>
                    <View
                        style={{width:width,height:120}}
                    >
                        <Swiper
                            style={{}}
                            dotStyle={{
                                height: 10,
                                width: 10,
                                backgroundColor: 'transparent',
                                borderWidth: 1,
                                borderRadius: 6,
                                borderColor: '#000000',
                                marginLeft: 11,
                                marginRight: 11
                            }}
                            activeDotStyle={{
                                height: 10,
                                width: 10,
                                borderRadius: 6,
                                backgroundColor: 'red',
                                marginLeft: 11,
                                marginRight: 11
                            }}
                        >
                            <View style={styles.slide1}>
                                <Text style={styles.text}>Hello Swiper</Text>
                            </View>
                            <View style={styles.slide2}>
                                <Text style={styles.text}>Beautiful</Text>
                            </View>
                            <View style={styles.slide3}>
                                <Text style={styles.text}>And simple</Text>
                            </View>
                        </Swiper>
                    </View>
                    <View style={{height: height - 180}}>
                        {/*滑动加载更多*/}
                        <ScrollFlatList
                        navigation={this.props.navigation}
                        getListFunc={getGoodsList}
                        listItem={GoodsListItem}
                        numColumns={this.state.numColumns}
                        />
                    </View>

                </View>

            </View>
        )
    }
}

// 样式的写法
const styles = StyleSheet.create({
    searchView: {
        backgroundColor: '#E3E3E3',
        height: 35,
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: 20,
        marginTop: 15,
        borderRadius: 8,
        paddingLeft: 5
    },
    selectList: {
        width: 25,
        height: 25,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#707070",
        marginLeft: 10
    },
    slide1: {
        width: width,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        width: width,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        width: width,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})


export default connect(null, {GetShoppingCartCount})(Home)