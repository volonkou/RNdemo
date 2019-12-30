// 引入路由
import React, {Component} from 'react';
import {TouchableOpacity,Text} from "react-native"
import {createStackNavigator, createBottomTabNavigator, createSwitchNavigator} from 'react-navigation';
import {Icon} from 'react-native-elements';
import IconBadge from "../page/common/Iconbage"
// 引入页面
import Home from "../page/home/container"
import GoodDetail from "../page/home/container/GoodDetail"
import Qrcode from "../page/home/container/qrcode"



import Category from "../page/category/container"
import Cart from "../page/cart/container"


import Mycenter from "../page/my/container"
import Login from "../page/my/container/login"
import Register from "../page/my/container/register"
import Order from "../page/my/container/order"

import Blog from "../page/blog/container"

import  InitPage from "../page/InitPage/index"


// stack中引入每个tab栏中的所有页面
const HomeStack = createStackNavigator({
    home: {
        screen: Home
    },
    gooddetail: {
        screen: GoodDetail
    }

}, {
    navigationOptions: {
        headerTintColor: '#000000'
    }
})

const CategoryStack = createStackNavigator({
    category: {
        screen: Category
    }
}, {
    navigationOptions: {
        headerTintColor: '#000000'
    }
})

const CartStack = createStackNavigator({
    cart: {
        screen: Cart
    },
    Order:{
        screen:Order
    }
}, {
    navigationOptions: {
        headerTintColor: '#000000'
    }
})

const MyStack = createStackNavigator({
    my: {
        screen: Mycenter
    },
    Login:{
        screen:Login
    },
    Register:{
        screen:Register
    },
    Order:{
        screen:Order
    }
}, {
    navigationOptions: {
        headerTintColor: '#000000'
    }
})


const QrStack = createStackNavigator({

    qrcode:{
        screen:Qrcode
    }
},{
    headerMode:'none'
})

// 加载每个tab内容并设置图标
const Tab = createBottomTabNavigator({
        HomeTab: {
            screen: HomeStack,
            navigationOptions: {
                tabBarLabel: "首页",
                tabBarIcon: ({tintColor}) => <Icon name="home" size={24} color={tintColor}/>
            }
        },
        CategoryTab: {
            screen: CategoryStack,
            navigationOptions: {
                tabBarLabel: "分类",
                tabBarIcon: ({tintColor}) => <Icon name="menu" size={24} color={tintColor}/>
            }
        },
        CartTab: {
            screen: CartStack,
            navigationOptions:(navigation)=>( {
                tabBarLabel:"购物车",
                tabBarIcon: ({tintColor}) => {
                    return (
                        <IconBadge tintColor={tintColor}/>
                    )
                }
            })
        },
        BlogTab: {
            screen: Blog,
            navigationOptions: {
                tabBarLabel: "blog",
                tabBarIcon: ({tintColor}) => <Icon type="material-community" name="blogger" size={24} color={tintColor}/>
            }
        },
        MyTab: {
            screen: MyStack,
            navigationOptions: {
                tabBarLabel: "我的",
                tabBarIcon: ({tintColor}) => <Icon name="person" size={24} color={tintColor}/>
            }
        }
    },
    {
        initialRouteName: "HomeTab",
        tabBarOption:
            {
                inactiveTintColor: '#1a1619',
                style:
                    {
                        backgroundColor: '#ffffff',
                    }
                ,
            }
    }
)


const AppNavigator = createSwitchNavigator(
    {
        App: Tab,
        InitPage:InitPage,
        Qr:QrStack
    },
    {
        initialRouteName: 'InitPage',
    })


export {AppNavigator}