import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEnterPin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            customStyle: {},
            loading: false
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    setStateFromParent = async (value) => {
        this.setState({
            value
        })
    }

    keyboardDidShow = async () => {
        await this.setState({
            customStyle: {
                justifyContent: 'flex-start',
                paddingTop: scaleSzie(80)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });

    }

    loginWithOfflineMode =() =>{
        this.props.actions.app.closePopupEnterPin();
    }

    render() {
        const { title, visibleEnterPin, isOfflineMode, onRequestClose, confimYes, hideCloseButton,isShowButtonEnterPinCode } = this.props;
        const { value, customStyle, loading } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visibleEnterPin}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View style={{
                    // height: scaleSzie(130), 
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ height: scaleSzie(85), justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '90%', height: scaleSzie(45),
                            borderColor: 'rgb(231,231,231)', borderWidth: 3
                        }} >
                            <TextInputMask
                                type="only-numbers"
                                style={{
                                    flex: 1, fontSize: scaleSzie(18), textAlign: 'center',
                                    padding: 0, margin: 0
                                }}
                                placeholder="Your pin code"
                                keyboardType="numeric"
                                maxLength={4}
                                value={value}
                                onChangeText={(value) => this.setState({ value })}
                                onSubmitEditing={() => {
                                    confimYes();
                                }}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                    {
                        isOfflineMode ? <View style={{ height: scaleSzie(120), }} >
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSzie(14),
                                textAlign: 'center'
                            }} >
                                Please check your internet !
                        </Text>
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSzie(14),
                                textAlign: 'center'
                            }} >
                                Or
                        </Text>
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSzie(14),
                                textAlign: 'center'
                            }} >
                                Do you want use offline mode ?
                        </Text>
                            <View style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'space-around',
                                alignItems: 'center'
                            }} >
                                <ButtonCustom
                                    width={'30%'}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title="Ask me later"
                                    textColor="#fff"
                                    onPress={() => this.props.actions.app.toogleOfflineMode(false)}
                                    styleText={{
                                        fontSize: scaleSzie(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSzie(4)
                                    }}
                                />

                                <ButtonCustom
                                    width={'30%'}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title="OK"
                                    textColor="#fff"
                                    onPress={this.loginWithOfflineMode}
                                    styleText={{
                                        fontSize: scaleSzie(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSzie(4)
                                    }}
                                />

                            </View>
                        </View> :
                            < View style={{
                                height: scaleSzie(45), alignItems: 'center'
                            }} >
                                {
                                    isShowButtonEnterPinCode ? <View style={{
                                        width: '30%', height: scaleSzie(35), backgroundColor: '#0764B0',
                                        justifyContent: 'center', alignItems: 'center'
                                    }} >
                                        <ActivityIndicator
                                            size="large"
                                            color="#fff"
                                        />
                                    </View> : <ButtonCustom
                                            width={'30%'}
                                            height={35}
                                            backgroundColor="#0764B0"
                                            title="Enter"
                                            textColor="#fff"
                                            onPress={() => confimYes()}
                                            styleText={{
                                                fontSize: scaleSzie(14)
                                            }}
                                            style={{
                                                borderRadius: scaleSzie(4)
                                            }}
                                        />
                                }

                            </View>
                    }


                </View>
            </PopupParent >
        );
    }



    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

}


const mapStateToProps = state => ({
    language: state.dataLocal.language,
    isShowButtonEnterPinCode: state.staff.isShowButtonEnterPinCode,
    visibleEnterPin: state.app.visibleEnterPin,
    isOfflineMode: state.app.isOfflineMode
});

export default connectRedux(mapStateToProps, PopupEnterPin);

