
import React from 'react';
import {TextInput,Text, View} from 'react-native';
import PropTypes from 'prop-types';


class FormInput extends React.Component {
    constructor(props){
        super(props);
        this.styles = {
            inputContainerStyle:{
                height:60,
                marginTop:15
            },
            inputStyle:{
                color:'#00F5FF',
                height:40,
                backgroundColor:"#00267C",
                paddingLeft:15,
                borderRadius:5,
                marginTop:10,
                fontSize:14,
                letterSpacing:3
            },
            labelStyle: {
                fontSize:14,
                color:"#ffffff",
                marginLeft:5,
                letterSpacing:3
            }
        }
    }


    render() {
        const {label,placeholder,password,onchange,value,defaultValue} = this.props;
        return (
            <View style={this.styles.inputContainerStyle}>
                <View>
                {
                    <Text style={this.styles.labelStyle}>
                        {label}
                    </Text>
                }
                </View>

                <TextInput
                    underlineColorAndroid='transparent'
                    secureTextEntry={password}
                    autoCorrect={false}
                    autoCapitalize='none'
                    placeholder={placeholder}
                    placeholderTextColor={"#00F5FF"}
                    style={this.styles.inputStyle}
                    onChangeText={onchange}
                    value={value}
                    defaultValue={defaultValue}
                />
            </View>

        )
    }
}





FormInput.propTypes = {
    label: PropTypes.string,
    placeholder:PropTypes.string,
    password:PropTypes.bool,
    onchange:PropTypes.func,
    value:PropTypes.string,
    inputTextAlign:PropTypes.string,
    // refName:PropTypes.func,
    defaultValue:PropTypes.string
}


export {FormInput};
