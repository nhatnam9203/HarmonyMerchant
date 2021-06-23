import React from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    Keyboard,
    ActivityIndicator,
} from 'react-native';


import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import Button from './Button';
import PopupScanCode from './PopupScanCode';
import { ScaleSzie } from '../utils';
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
            scancode: ""
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    setStateFromParent = async () => {
        await this.setState({
            scancode: ""
        })
    }


    keyboardDidShow = async () => {
        await this.setState({
            customStyle: {
                justifyContent: 'flex-start',
                paddingTop: ScaleSzie(80)
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

    resultScanCode = async (e) => {
        await this.setState({
            visibleScanCode: false,
            scancode: `${e.data}`.trim()
        })
    }

    submitSerialCode = () => {
        const { scancode } = this.state;
        if (scancode === '') {
            alert("Enter your code!")
        } else {
            this.props.submitSerialCode(`${scancode}`);
        }
    }


    render() {
        const { title, onRequestClose, hideCloseButton,
            visiblePopupActiveGiftCard, loading
        } = this.props;
        const {  customStyle, scancode } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visiblePopupActiveGiftCard}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View style={{
                    height: ScaleSzie(150), backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15)
                }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: ScaleSzie(10), marginBottom: ScaleSzie(4) }} >
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(18) }} >
                            {'Enter gift card serial number'}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '80%', height: ScaleSzie(45),
                            flexDirection: 'row'
                        }} >
                            <View style={{
                                flex: 1, borderColor: 'rgb(231,231,231)', borderWidth: 2,
                                paddingHorizontal: ScaleSzie(10),
                            }} >
                                <TextInput
                                    style={{
                                        flex: 1, fontSize: ScaleSzie(15),
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        padding: 0, margin: 0
                                    }}
                                    placeholder="Your gift card"
                                    keyboardType="numeric"
                                    value={scancode}
                                    onChangeText={(scancode) => this.setState({ scancode })}
                                    onSubmitEditing={this.submitSerialCode}
                                />
                            </View>
                            <Button
                                onPress={this.scanCodeGiftCard}
                                style={{
                                    width: ScaleSzie(50), backgroundColor: "#F1F1F1", borderColor: 'rgb(231,231,231)', borderWidth: 2,
                                    borderLeftWidth: 0, justifyContent: "center", alignItems: "center"
                                }} >
                                <Image source={IMAGE.scancode} />

                            </Button>

                        </View>
                    </View>
                    <View style={{
                        height: ScaleSzie(45), alignItems: 'center'
                    }} >
                        {
                            loading ? <View style={{
                                width: '30%', height: ScaleSzie(35), backgroundColor: '#0764B0',
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
                                    title="Add card"
                                    textColor="#fff"
                                    onPress={this.submitSerialCode}
                                    styleText={{
                                        fontSize: ScaleSzie(14)
                                    }}
                                    style={{
                                        borderRadius: ScaleSzie(4)
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
        this.keyboardDidShowListener?.remove();
        this.keyboardDidHideListener?.remove();
    }

}


const mapStateToProps = state => ({
    language: state.dataLocal.language,
    isShowButtonEnterPinCode: state.staff.isShowButtonEnterPinCode,
    visiblePopupActiveGiftCard: state.appointment.visiblePopupActiveGiftCard,
    loading: state.app.loading
});

export default connectRedux(mapStateToProps, PopupActiveGiftCard);

// 10120061202600003