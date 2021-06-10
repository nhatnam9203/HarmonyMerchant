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
                paddingTop: scaleSize(80)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });
    }

    loginWithOfflineMode = () => {
        this.props.actions.app.closePopupEnterPin();
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
                        borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15)
                    }} >
                    <View style={{ height: scaleSize(85), justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '90%', height: scaleSize(45),
                            borderColor: 'rgb(231,231,231)', borderWidth: 3
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
                            />
                        </View>
                    </View>
                    {
                        isOfflineMode ? <View style={{ height: scaleSize(120), }} >
                            <Text style={{
                                color: 'rgb(246,195,49)', fontWeight: 'bold', fontSize: scaleSize(14),
                                textAlign: 'center'
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
                                    width={'30%'}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title={localize('Ask me later', language)}
                                    textColor="#fff"
                                    onPress={() => this.props.actions.app.toogleOfflineMode(false)}
                                    styleText={{
                                        fontSize: scaleSize(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSize(4)
                                    }}
                                />

                                <ButtonCustom
                                    width={'30%'}
                                    height={35}
                                    backgroundColor="#0764B0"
                                    title={localize('OK', language)}
                                    textColor="#fff"
                                    onPress={this.loginWithOfflineMode}
                                    styleText={{
                                        fontSize: scaleSize(14)
                                    }}
                                    style={{
                                        borderRadius: scaleSize(4)
                                    }}
                                />

                            </View>
                        </View> :
                            < View style={{
                                height: scaleSize(45), alignItems: 'center'
                            }} >
                                {
                                    isShowButtonEnterPinCode ? <View style={{
                                        width: '30%', height: scaleSize(35), backgroundColor: '#0764B0',
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
                                            title={localize('Enter', language)}
                                            textColor="#fff"
                                            onPress={() => confimYes()}
                                            styleText={{
                                                fontSize: scaleSize(14)
                                            }}
                                            style={{
                                                borderRadius: scaleSize(4)
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
