import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import Button from './Button';
import PopupScanCode from './PopupScanCode';
import { scaleSzie, ListCodeAreaPhone } from '../utils';
import connectRedux from '@redux/ConnectRedux';
import IMAGE from '../resources';

class PopupActiveGiftCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            customStyle: {},
            loading: false,
            codeAreaPhone: '+1',
            visibleScanCode: false,
            scancode:""
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

    scanCodeGiftCard = () => {
        this.setState({
            visibleScanCode: true
        })
    }

    onRequestCloseScanCode = () => {
        this.setState({
            visibleScanCode: false
        })
    }

    resultScanCode = async (data) => {
        await this.setState({
            visibleScanCode: false,
            scancode:data
        })
    }

    submitSerialCode = () => {
        this.props.submitSerialCode("10120191220000003");
    }


    render() {
        const { title, visible, isShowButtonEnterPinCode, onRequestClose, confimYes, hideCloseButton,
            visiblePopupActiveGiftCard
        } = this.props;
        const { value, customStyle, scancode } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visiblePopupActiveGiftCard}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View style={{
                    height: scaleSzie(150), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: scaleSzie(10), marginBottom: scaleSzie(4) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {'Enter gift card serial number'}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '80%', height: scaleSzie(45),
                            flexDirection: 'row'
                        }} >
                            <View style={{
                                flex: 1, borderColor: 'rgb(231,231,231)', borderWidth: 2,
                                paddingHorizontal: scaleSzie(10),
                            }} >
                                <TextInput
                                    style={{
                                        flex: 1, fontSize: scaleSzie(18),
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        padding: 0, margin: 0
                                    }}
                                    placeholder="Your gift card"
                                    keyboardType="numeric"
                                    value={scancode}
                                    onChangeText={(scancode) => this.setState({ scancode })}
                                    onSubmitEditing={() => {
                                        confimYes();
                                    }}
                                />
                            </View>
                            <Button
                                onPress={this.scanCodeGiftCard}
                                style={{
                                    width: scaleSzie(50), backgroundColor: "#F1F1F1", borderColor: 'rgb(231,231,231)', borderWidth: 2,
                                    borderLeftWidth: 0, justifyContent: "center", alignItems: "center"
                                }} >
                                <Image source={IMAGE.scancode} />

                            </Button>

                        </View>
                    </View>
                    <View style={{
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
                                    title="Active"
                                    textColor="#fff"
                                    onPress={this.submitSerialCode}
                                    styleText={{
                                        fontSize: scaleSzie(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSzie(4)
                                    }}
                                />
                        }

                    </View>
                </View>
                <PopupScanCode
                    visible={this.state.visibleScanCode}
                    onRequestClose={this.onRequestCloseScanCode}
                    resultScanCode={this.resultScanCode}
                />
            </PopupParent>
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
    visiblePopupActiveGiftCard: state.appointment.visiblePopupActiveGiftCard
});

export default connectRedux(mapStateToProps, PopupActiveGiftCard);

