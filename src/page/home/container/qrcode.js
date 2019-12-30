import React, {Component} from "react"
import {View, Text, StyleSheet, Animated, Easing, TouchableOpacity} from "react-native"
import {RNCamera} from 'react-native-camera';
import {Icon} from 'react-native-elements';
import {width} from '../../../util/functions'
import ImagePicker from "react-native-image-picker";
import LocalBarcodeRecognizer from 'react-native-local-barcode-recognizer';
const options = {
    title: '请选择图片来源',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '相册图片',
    maxWidth: 200,
    maxHeight: 200,
    quality: 1,
    allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


class Qrcode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moveAnim: new Animated.Value(-200),
            isFlashOn: false
        }
    }

    componentDidMount() {
        this.startAnimation();
    }


    ChoosePhoto = () => {

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('用户取消了选择！');
            } else if (response.error) {
                console.log("ImagePicker发生错误：" + response.error);
            } else {
                console.log(response.data)
                this.recoginze(response.data);
            }
        });

    }

    recoginze = async (data)=>{

        let result = await LocalBarcodeRecognizer.decode(data,{codeTypes:['ean13','qr']});
        alert(result);
    }



    startAnimation = () => {
        this.state.moveAnim.setValue(-200);
        Animated.timing(
            this.state.moveAnim,
            {
                toValue: 0,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.startAnimation());
    };
    //  识别二维码
    onBarCodeRead = (result) => {
        const {navigate} = this.props.navigation;
        const {data} = result;
        // navigate('gooddetail', {
        //     id: data
        // })
        alert(result.data)
    };

    toggleFlash = () => {
        this.setState({isFlashOn: !this.state.isFlashOn})
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    <TouchableOpacity
                        style={{marginLeft: 10}}
                        onPress={() => {
                            this.props.navigation.navigate("home")
                        }}
                    >
                        <Icon type="Entypo" name="chevron-left" size={35} color="black"/>
                    </TouchableOpacity>
                    <Text>扫描二维码</Text>
                    <TouchableOpacity
                        style={{marginRight: 10}}
                        onPress={() => {
                            this.ChoosePhoto()
                        }}
                    >
                        <Text>相册</Text>
                    </TouchableOpacity>
                </View>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    // 设置开启后摄像头
                    type={RNCamera.Constants.Type.back}
                    // 设置打开闪光灯
                    flashMode={this.state.isFlashOn === true ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                    onBarCodeRead={this.onBarCodeRead}
                >
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle}/>
                        <Animated.View style={[
                            styles.border,
                            {transform: [{translateY: this.state.moveAnim}]}]}/>
                        <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                        <TouchableOpacity
                            style={{marginTop: 20}}
                            onPress={() => {
                                this.toggleFlash()
                            }}
                        >
                            {
                                this.state.isFlashOn ?
                                    <Icon type="ionicon" name="ios-flash-off" size={40} color="#ffffff"/> :
                                    <Icon type="ionicon" name="ios-flash" size={40} color="#ffffff"/>
                            }

                        </TouchableOpacity>
                    </View>
                </RNCamera>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    },
    headerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingTop: 40,
        height: 84,
        width: width,
        backgroundColor: '#fff',
    }
});

export default Qrcode