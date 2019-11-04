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

import { ButtonCustom, PopupParent } from '@components';
import { scaleSzie } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEnterInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            firstName:'',
            lastName:'',
            customStyle: {},
            loading: false
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    setStateFromParent = async (firstName,lastName) => {
        this.setState({
            firstName,
            lastName
        })
    }

    keyboardDidShow = async () => {
        await this.setState({
            customStyle: {
                justifyContent: 'flex-start',
                paddingTop: scaleSzie(40)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });

    }

    render() {
        const { title, visible, isShowButtonEnterPinCode, onRequestClose, confimYes, hideCloseButton ,message,
            placeholder
        } = this.props;
        const { value, customStyle ,firstName,lastName} = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
            >
                <View style={{
                    height: scaleSzie(210), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: scaleSzie(10), marginBottom: scaleSzie(4) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {message}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '90%', height: scaleSzie(45),
                            borderColor: 'rgb(231,231,231)', borderWidth: 3,
                            paddingHorizontal:scaleSzie(10)
                        }} >
                            <TextInput
                                // type="only-numbers"
                                style={{
                                    flex: 1, fontSize: scaleSzie(18), 
                                    padding: 0, margin: 0
                                }}
                                placeholder={"First Name"}
                                value={firstName}
                                onChangeText={(firstName) => this.setState({ firstName })}
                                onSubmitEditing={() => {
                                    confimYes();
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{
                            width: '90%', height: scaleSzie(45),
                            borderColor: 'rgb(231,231,231)', borderWidth: 3,
                            paddingHorizontal:scaleSzie(10)
                        }} >
                            <TextInput
                                // type="only-numbers"
                                style={{
                                    flex: 1, fontSize: scaleSzie(18), 
                                    padding: 0, margin: 0
                                }}
                                placeholder={"Last Name"}
                                value={lastName}
                                onChangeText={(lastName) => this.setState({ lastName })}
                                onSubmitEditing={() => {
                                    confimYes();
                                }}
                            />
                        </View>
                    </View>
                    <View style={{
                        height: scaleSzie(50), alignItems: 'center'
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
                                    title="Done"
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

export default connectRedux(mapStateToProps, PopupEnterInfo);

