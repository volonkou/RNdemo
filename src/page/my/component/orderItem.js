import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import {width} from "../../../util/functions";

class OrderItem extends Component {


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    GetGoods=(data)=>{
        // console.log(data)
        let GoodsData=[]
          for(i in data){
              GoodsData.push(
                  <View key={i} style={{marginTop:10}}>
                      <Text>商品ID:{data[i].goods_id}</Text>
                      <Text>商品单价:{data[i].price}</Text>
                      <Text>商品数量:{data[i].quantity}</Text>
                      <Text>商品总价:{data[i].total_price}</Text>
                  </View>
              )
          }
          
          return GoodsData
    }

    render() {
        const {item, navigation} = this.props;
        return (
            <View style={{width:width-30,marginLeft:15}}>
                <View>
                    <Text>订单ID#{item.id}</Text>
                    <Text>订单日期：{item.created_at}</Text>
                </View>
                <View style={{marginBottom:40}}>
                    {
                        this.GetGoods(item.goods)
                    }
                    <Text style={{color:"red"}}>订单总价：{item.money}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

});



export default OrderItem