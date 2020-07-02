import React from 'react';
import {
    View,
    Text,
    Keyboard,
    ActivityIndicator,
    Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';
import connectRedux from '@redux/ConnectRedux';

class PopupCheckStaffPermission extends React.Component {

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
                paddingTop: scaleSzie(50)
            }
        });
    }

    keyboardDidHide = async () => {
        await this.setState({
            customStyle: {}
        });

    }

    submitPin = () => {
        const { profile,tabName } = this.props;
        const { value } = this.state;
       
        if (value.length === 4) {
            // this.props.actions.staff.loginStaff(profile.merchantCode, value,true);
            this.props.actions.auth.checkStaffPermission(profile.merchantCode, value,tabName);
        } else {
            Alert.alert(`PIN must be 4 digits.`);
        }
    }

    render() {
        const { title, isLoadingCheckStaffPermission, onRequestClose, hideCloseButton,
            visiblePopupCheckStaffPermission
        } = this.props;
        const { value, customStyle } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visiblePopupCheckStaffPermission}
                onRequestClose={() => onRequestClose()}
                hideCloseButton={hideCloseButton}
                style={customStyle}
                // hideCloseButton={true}
            >
                <View style={{
                    height: scaleSzie(150), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: scaleSzie(10), marginBottom: scaleSzie(4) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {'Please enter the authorized PIN number'}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
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
                                placeholder="Your PIN"
                                keyboardType="numeric"
                                maxLength={4}
                                value={value}
                                onChangeText={(value) => this.setState({ value })}
                                onSubmitEditing={this.submitPin}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                    <View style={{
                        height: scaleSzie(45), alignItems: 'center'
                    }} >
                        {
                            isLoadingCheckStaffPermission ? <View style={{
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
                                    title="NEXT"
                                    textColor="#fff"
                                    onPress={this.submitPin}
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
    isLoadingCheckStaffPermission: state.auth.isLoadingCheckStaffPermission,
    visiblePopupCheckStaffPermission: state.auth.visiblePopupCheckStaffPermission,
    profile: state.dataLocal.profile
});

export default connectRedux(mapStateToProps, PopupCheckStaffPermission);

