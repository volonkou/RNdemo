import React, {Component} from 'react';
import { View} from 'react-native';
import {GetOrider} from "../../../actions/cartAction"
import OrderItem from "../component/orderItem"
import {ScrollFlatList} from "../../common/ScrollFlatList";

class Order extends Component {


    render() {
        return (

            <View style={{flex: 1, backgroundColor: "#ffffff"}}>
                {/*滑动加载更多*/}
                <ScrollFlatList
                    navigation={this.props.navigation}
                    getListFunc={GetOrider}
                    listItem={OrderItem}
                />
            </View>

        )
    }
}




export default Order