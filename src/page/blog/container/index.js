import React, {Component} from 'react';
import {ScrollView, Text, View, ActivityIndicator, Image} from 'react-native';
import Mock from "mockjs"
import {width} from "../../../util/functions";

class Blog extends Component {

    static navigationOptions = ({navigation}) => ({
        title: 'blog'
    });


    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: ""
        };
    }


    componentDidMount() {

        let data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            'blog|1-20': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1,
                "title": "@ctitle",
                'describe': "@cparagraph",
                'image': "@image('400x200', '@color','@color','@name')",

            }]
        })


        this.setState({
            data: data.blog
        })

    }


    CreateItem = (data) => {
        let Data = []
        for (i in data) {
            Data.push(
                <View key={i} style={{width: width - 30, marginLeft: 15, marginBottom: 50}}>
                    <Text style={{fontSize: 24}}>{data[i].id}.{data[i].title}</Text>
                    <Image
                        style={{width: width - 30, height: width / 2 - 15, marginBottom: 15, marginTop: 5}}
                        source={{uri: data[i].image}}/>
                    <Text style={{fontSize: 18}}>{data[i].describe}</Text>
                </View>
            )
        }
        return Data
    }

    render() {
        const {data} = this.state
        return (
            data ?
                <View  style={{flex: 1, backgroundColor: "#ffffff"}}>
                    <Text style={{fontSize:24, color:"red",alignSelf:"center",marginTop:40}}>博客总数：{data.length}</Text>
                <ScrollView style={{marginTop:15}}>
                    <View>
                        {this.CreateItem(data)}
                    </View>
                </ScrollView>
                </View>
                : <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff"}}>
                    <ActivityIndicator/>
                </View>
        )
    }
}


export default Blog