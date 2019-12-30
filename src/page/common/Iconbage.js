import React from 'react';
import {Text, View} from 'react-native';
import {connect} from "react-redux";
import {Icon} from 'react-native-elements';

class IconBadge extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
    }

    renderNum = (totalNum) => {
        if (totalNum > 0) {
            return (
                <View style={{
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    right: 0,
                    top:-5,
                    zIndex:9
                }}>
                    <Text style={{fontSize: 10, color: "#ffffff"}}>{totalNum}</Text>
                </View>
            )
        }
    }

    render() {
        const {totalNum, tintColor} = this.props
        return (
            <View style={{}}>
                {
                    this.renderNum(totalNum)
                }
                <View>
                    <Icon type="Entypo" name="shopping-cart" size={24} color={tintColor}/>
                </View>
            </View>
        )
    }


}

function mapStateToProps(state) {
    return {
        totalNum: state.cart.totalNum
    }

}

export default connect(mapStateToProps)(IconBadge);