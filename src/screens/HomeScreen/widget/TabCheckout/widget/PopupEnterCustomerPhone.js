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

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie ,ListCodeAreaPhone,getCodeAreaPhone,localize} from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEnterCustomerPhone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            firstName: '',
            lastName: '',
            customStyle: {},
            loading: false,
            codeAreaPhone: '+1',
            phone:''
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    setStateFromParent = async (customerPhone) => {
        this.setState({
            phone:getCodeAreaPhone(customerPhone).phone,
            codeAreaPhone:getCodeAreaPhone(customerPhone).areaCode,
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

    render() {
        const { title, visible, isShowButtonEnterPinCode, onRequestClose, confimYes, hideCloseButton, message,
            placeholder,language
        } = this.props;
        const { phone, customStyle, firstName, codeAreaPhone } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View style={{
                    height: scaleSzie(130), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '90%', height: scaleSzie(45),
                            flexDirection: 'row'
                        }} >
                            <View style={{ width: scaleSzie(70),marginRight:scaleSzie(10) }} >
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
                            <View style={{ flex: 1, borderColor: 'rgb(231,231,231)', borderWidth: 3,
                        paddingHorizontal:scaleSzie(10),
                        }} >
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '999-999-9999'
                                    }}
                                    style={{
                                        flex: 1, fontSize: scaleSzie(18),
                                        padding: 0, margin: 0,
                                    }}
                                    placeholder={localize('Phone number', language)}
                                    value={phone}
                                    onChangeText={(phone) => this.setState({ phone })}
                                    onSubmitEditing={() => {
                                        confimYes();
                                    }}
                                    keyboardType="phone-pad"
                                />
                            </View>

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
                                    title={localize('Done', language)}
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
                </View>
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
});

export default connectRedux(mapStateToProps, PopupEnterCustomerPhone);

