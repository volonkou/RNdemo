import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import {width} from "../../../util/functions"
import {getCategory, getCateItem} from "../../../actions/CategoryAction"


const useWidth = width - (50 * 4) - 30;
const LeftAndBottom = useWidth / 8;

class Category extends React.Component {

    static navigationOptions = ({navigation}) => ({
        title: '分类选购',
        headerBackTitle: null,
        headerTitleStyle: {flex: 1, textAlign: 'center'},
    });


    constructor(props) {
        super(props)
        this.state = {
            Cutdata: "",
            cutId: "",
            ItemData: ""
        }
    }

    componentDidMount() {
        // 默认显示第一个分类的商品
        getCategory().then(res => {
            this.setState({
                Cutdata: res.data.data,
                cutId: res.data.data[0].id
            }, () => {
                this.GetCateItem()
            })
        }).catch(error => {
            console.log(error)
        })


    }

    // 点击分类图标获取分类数据
    GetCateItem() {
        getCateItem(this.state.cutId).then(res => {
            this.setState({
                ItemData: res.data
            })
        })
    }

// 渲染分类列表
    CreateCut() {
        var CutArr = this.state.Cutdata
        let data = [];
        for (var i = 0; i < CutArr.length; i++) {
            const cutItem = CutArr[i]
            data.push(
                <TouchableOpacity
                    style={[{
                        marginLeft: LeftAndBottom,
                        marginRight: LeftAndBottom,
                        marginTop: LeftAndBottom,
                        alignItems: "center",
                        justifyContent: "center"
                    }]}
                    onPress={() => {
                        this.setState({
                            cutId: cutItem.id
                        }, () => {
                            this.GetCateItem()
                        })

                    }}
                    activeOpacity={0.7}
                    key={i}
                >
                    <View
                        style={[styles.imgView, {backgroundColor: cutItem.id === this.state.cutId ? "#EFEFEF" : null}]}>
                        <Text style={styles.text}>{CutArr[i].name}</Text>
                    </View>

                </TouchableOpacity>
            )
        }
        return data;
    }

// 渲染每一个分类下的商品
    CreateItem() {
        const ItemDtata = this.state.ItemData.goods.data
        let data = [];
        for (var i = 0; i < ItemDtata.length; i++) {
            const itemId = ItemDtata[i].id
            data.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => this.props.navigation.navigate("Categooddetail", {
                        id: itemId
                    })}
                >
                    <View style={styles.item1}>
                        <View
                            style={{
                                width: 85,
                                height: 105,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                style={{width: 75, height: 95}}
                                source={{uri: ItemDtata[i].image}}
                            />
                        </View>
                        <View>
                            <Text style={{fontSize: 18, marginTop: 10}}>{ItemDtata[i].title}</Text>
                            <View style={{flexDirection: "row", marginTop: 20}}><Text
                                style={{fontSize: 18}}>价格：</Text><Text
                                style={{fontSize: 18, color: "red"}}>${ItemDtata[i].price}</Text></View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        return data;
    }

    render() {
        if (this.state.ItemData) {
            return (
                <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, backgroundColor: "#ffffff"}}>
                    <View style={styles.container}>
                        <View style={styles.classification}>
                            {this.CreateCut()}
                        </View>
                        <View style={{marginTop: 15}}>
                            {this.CreateItem()}
                        </View>
                    </View>
                </ScrollView>
            )
        } else {
            return (
                <View></View>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        backgroundColor: "white"
    },
    classification: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    imgView: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red"

    },
    img: {
        width: 50,
        height: 50
    },
    item1: {
        marginLeft: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E3E3E3",
        width: width - 30,
        flexDirection: "row"
    }

})


export default Category