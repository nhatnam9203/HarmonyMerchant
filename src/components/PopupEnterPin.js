import React from 'react';
import {
    View,
    Text,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import KeyboardNumeric from "./KeyboardNumeric";
import { scaleSize, localize } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEnterPin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            customStyle: {},
            loading: false
        };
        this.viewShotRef = React.createRef();
    }


    setStateFromParent = async (value) => {
        this.setState({
            value
        })
    }

    loginWithOfflineMode = () => {
        this.props.actions.app.closePopupEnterPin();
    }

    onChangeValue = (number) => {
        if (number === ".") return;
        let { value } = this.state;
        if (number === "x") {
            value = value.substring(0, value.length - 1);
        } else {
            if (value.toString().length < 4) {
                value += number;
            }
        }
        this.setState({ value })
    }

    // -------------- Render --------------

    render() {
        const { title, visibleEnterPin, isOfflineMode, onRequestClose, confimYes, hideCloseButton, isShowButtonEnterPinCode,
            language
        } = this.props;
        const { value, customStyle, loading } = this.state;

        return (
            <PopupParent
                title={title}
                visible={visibleEnterPin}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSize(15),
                        borderBottomRightRadius: scaleSize(15),
                        minHeight: scaleSize(450),
                        maxHeight: scaleSize(530)
                    }} >
                    <View style={{ alignItems: 'center', paddingTop: scaleSize(18) }} >
                        <Text style={{
                            textAlign: 'center', fontSize: scaleSize(18),
                            color: '#404040', fontWeight: '600',
                            marginBottom : scaleSize(15)
                        }}
                        >
                            {`${localize('Enter your PIN code', language)}`}
                        </Text>
                        <View style={{
                            width: '90%', height: scaleSize(45),
                            borderColor: '#dddddd', borderWidth: 2
                        }} >

                            <TextInputMask
                                type="only-numbers"
                                style={{
                                    flex: 1, fontSize: scaleSize(18), textAlign: 'center',
                                    padding: 0, margin: 0
                                }}
                                placeholder={localize('Your pin code', language)}
                                keyboardType="numeric"
                                maxLength={4}
                                value={value}
                                onChangeText={(value) => this.setState({ value })}
                                onSubmitEditing={() => {
                                    confimYes();
                                }}
                                secureTextEntry={true}
                                editable={false}
                                showSoftInputOnFocus={false}
                            />
                        </View>
                        <KeyboardNumeric onPress={this.onChangeValue} />
                    </View>
                    {
                        isOfflineMode ? <View style={{ height: scaleSize(120), }} >
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSize(14),
                                textAlign: 'center',
                                marginTop : scaleSize(5)
                            }} >
                                {`${localize('Please check your internet', language)} !`}
                            </Text>
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSize(14),
                                textAlign: 'center'
                            }} >
                                Or
                        </Text>
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSize(14),
                                textAlign: 'center'
                            }} >
                                {`${localize('Do you want use offline mode', language)}?`}
                            </Text>
                            <View style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'space-around',
                                alignItems: 'center'
                            }} >
                                <ButtonCustom
                                    width={'35%'}
                                    height={40}
                                    backgroundColor="#0764B0"
                                    title={localize('Ask me later', language)}
                                    textColor="#fff"
                                    onPress={() => this.props.actions.app.toogleOfflineMode(false)}
                                    styleText={{
                                        fontSize: scaleSize(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSize(4),
                                        marginTop: scaleSize(15)
                                    }}
                                />

                                <ButtonCustom
                                    width={'35%'}
                                    height={40}
                                    backgroundColor="#0764B0"
                                    title={localize('OK', language)}
                                    textColor="#fff"
                                    onPress={this.loginWithOfflineMode}
                                    styleText={{
                                        fontSize: scaleSize(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSize(4),
                                        marginTop: scaleSize(15)
                                    }}
                                />

                            </View>
                        </View> :
                            < View style={{
                                height: scaleSize(45), alignItems: 'center'
                            }} >
                                {
                                    isShowButtonEnterPinCode ? <View style={{
                                        width: '35%', height: scaleSize(40), backgroundColor: '#0764B0',
                                        justifyContent: 'center', alignItems: 'center',
                                        marginTop: scaleSize(15)
                                    }} >
                                        <ActivityIndicator
                                            size="large"
                                            color="#fff"
                                        />
                                    </View> : <ButtonCustom
                                            width={'35%'}
                                            height={40}
                                            backgroundColor="#0764B0"
                                            title={localize('Submit', language)}
                                            textColor="#fff"
                                            onPress={() => confimYes()}
                                            styleText={{
                                                fontSize: scaleSize(14)
                                            }}
                                            style={{
                                                borderRadius: scaleSize(4),
                                                marginTop: scaleSize(15)
                                            }}
                                        />
                                }

                            </View>
                    }
                </View>
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
    isOfflineMode: state.network.isOfflineMode
});

export default connectRedux(mapStateToProps, PopupEnterPin);
