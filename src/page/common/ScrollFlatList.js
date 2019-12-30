
import React from 'react';
import {View, FlatList, ActivityIndicator, Text} from 'react-native';
import PropTypes from 'prop-types';
import {List} from "react-native-elements";
import {height} from '../../util/functions';
import {NavigationActions} from "react-navigation";
class ScrollFlatList extends React.Component {
    constructor(props) {
        super(props);
        this.onEndReachedCalledDuringMomentum = true;
        this.state = {
            dataList: "",
            currentPage: 1,
            totalPage: 1,
            refreshing: false, //是否加载
            loadingComplete: false,//是否加载完全部数据
        };
        this.styles = {
            listContainer: {
                marginTop: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0
            },
            container: {
                flex: 1,
                justifyContent: 'center',
                height: height
            },
            horizontal: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 10
            }
        }
    }

    componentDidMount() {
        this.getListData(1);
    }

    //获取远程数据
    getListData = (pageNum) => {
        const {getListFunc} = this.props;
        getListFunc(pageNum)
            .then((res) => {
                const {data, meta} = res.data;
                const {current_page, total_pages} = meta.pagination;
                this.setState({
                    refreshing: false,
                    dataList: current_page > 1 ? [...this.state.dataList, ...data] : data,
                    currentPage: current_page,
                    totalPage: total_pages,
                    loadingComplete: current_page === total_pages
                });
            })
            //异常处理
            .catch((error) => {
                console.log('数据加载失败,error:', error.respones)
            })
    }

    //刷新列表，从第一页重新加载数据
    handlePullRefresh = () => {
        this.setState({
            refreshing: true,
            currentPage: 1,
            loadingComplete: false,

        }, () => {
            this.getListData(1)
        });
    }

    // 下滑加载数据
    handleLoadingMore = ({distanceFromEnd}) => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const {loadingComplete, currentPage} = this.state;
            if (!loadingComplete) {
                setTimeout(() => {
                    this.setState({
                        currentPage: currentPage + 1
                    }, () => {
                        this.getListData(this.state.currentPage);
                    })
                }, 700);
            }
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    //没有数据时
    _renderLoadingView = () => {
        return (
            <ActivityIndicator style={{marginTop: 200}}/>
        )
    }

    _renderFlatListFooter = () => {
        const {loadingComplete, dataList} = this.state;
        if (dataList) {
            if (!loadingComplete) {
                return (
                    <ActivityIndicator/>
                )
            }
            else {
                return (
                    <View style={{justifyContent: "center", alignItems: "center", height: 50}}>
                        <Text>
                            没有更多数据
                        </Text>
                    </View>

                )
            }
        } else {
            return (
                <View>

                </View>
            )
        }

    }

    render() {
        const {refreshing, dataList} = this.state;
        const FlatListItem = this.props.listItem;
        return (
            <List containerStyle={this.styles.listContainer}>
                <FlatList
                    data={dataList}
                    numColumns={this.props.numColumns}
                    key={this.props.numColumns}
                    //指定每个item的key值，只能为string，不能是number
                    keyExtractor={item => item.id.toString()}
                    refreshing={refreshing}
                    onRefresh={this.handlePullRefresh}
                    ListEmptyComponent={this._renderLoadingView}
                    showsVerticalScrollIndicator={false}
                    //渲染mei ge
                    renderItem={({item}) => (
                        <FlatListItem
                            item={item}
                            navigation={this.props.navigation}
                            numColumns={this.props.numColumns}
                        />
                    )}

                    ListFooterComponent={this._renderFlatListFooter}
                    onEndReached={this.handleLoadingMore}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false;
                        // console.log('begin');
                    }}
                />
            </List>

        )
    }
}


ScrollFlatList.propTypes = {
    getListFunc: PropTypes.func.isRequired,
    listItem: PropTypes.func.isRequired,
    goToPage: PropTypes.string,
}

export {ScrollFlatList};
