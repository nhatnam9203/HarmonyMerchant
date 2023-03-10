import React from 'react';
import {
    View,
    Text,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import {Dropdown} from './react-native-material-dropdown';
import PopupParent from './PopupParent';
import { scaleSize, ListCodeAreaPhone } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupSendLinkInstall extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            customStyle: {},
            loading: false,
            codeAreaPhone:'+1'
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
                paddingTop: scaleSize(80)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });

    }

    render() {
        const { title, visible, isShowButtonEnterPinCode, onRequestClose, confimYes, hideCloseButton } = this.props;
        const { value, customStyle,codeAreaPhone } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View style={{
                    height: scaleSize(150), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15)
                }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: scaleSize(10), marginBottom: scaleSize(4) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSize(18) }} >
                            {'Are you want to install app ?'}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '90%', height: scaleSize(45),
                            flexDirection: 'row'
                        }} >
                            <View style={{ width: scaleSize(70), marginRight: scaleSize(10) }} >
                                <Dropdown
                                    label={'+1'}
                                    data={ListCodeAreaPhone}
                                    value={codeAreaPhone}
                                    onChangeText={(codeAreaPhone) => this.setState({ codeAreaPhone })}
                                    containerStyle={{
                                        backgroundColor: '#fff',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1
                                    }}
                                />
                            </View>
                            <View style={{
                                flex: 1, borderColor: 'rgb(231,231,231)', borderWidth: 3,
                                paddingHorizontal: scaleSize(10),
                            }} >
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '999-999-9999'
                                    }}
                                    style={{
                                        flex: 1, fontSize: scaleSize(18),
                                        padding: 0, margin: 0
                                    }}
                                    placeholder="Your phone number"
                                    keyboardType="numeric"
                                    value={value}
                                    onChangeText={(value) => this.setState({ value })}
                                    onSubmitEditing={() => {
                                        confimYes();
                                    }}
                                />

                            </View>

                        </View>
                    </View>
                    <View style={{
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
                                    title="Send"
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
});

export default connectRedux(mapStateToProps, PopupSendLinkInstall);

