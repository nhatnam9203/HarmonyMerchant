import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Keyboard,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import connectRedux from '@redux/ConnectRedux';
import { ScaleSzie, ListCodeAreaPhone, getCodeAreaPhone } from '@utils';

const initalState = {
    codeAreaPhone: '+1',
    phone: "",
    firstName: "",
    lastName: "",
    customStyle: {},
};

class EnterCustomerPhonePopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
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

    handleKeyboardWillHide = async () => {

        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        }

    }

    setStateFromParent = async (firstName, lastName, phone) => {
        await this.setState({
            firstName,
            lastName,
            phone: getCodeAreaPhone(phone).phone,
            codeAreaPhone: getCodeAreaPhone(phone).areaCode,
        })
    }


    changeStylist = async (name, id) => {

    }

    submitCustomerInfo = () => {
        const { codeAreaPhone, phone, firstName, lastName } = this.state;
        const phoneNumber = `${codeAreaPhone}${phone}`;

        this.props.actions.appointment.getCustomerBuyAppointment(phoneNumber, {
            customerId: 0,
            firstName,
            lastName,
            phone: phoneNumber
        });
    }

    onFocusToScroll = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: ScaleSzie(number), animated: true })
    }

    onRequestClose = () => {
        this.setState(initalState);
        this.props.actions.appointment.switchVisibleEnterCustomerPhonePopup(false);
    }

    // --------------- Render -----------

    render() {
        const { title, visibleEnterCustmerPhonePopup, loading, confimYes } = this.props;
        const { codeAreaPhone, phone, customStyle } = this.state;

        return (
            <PopupParent
                title={title}
                visible={visibleEnterCustmerPhonePopup}
                onRequestClose={this.onRequestClose}
                width={420}
                styleTitle={{ fontSize: ScaleSzie(18), fontWeight: "600" }}
                style={customStyle}
            >
                <View style={{
                    // height: ScaleSzie(320),
                    backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15),
                    paddingHorizontal: ScaleSzie(22),
                    paddingTop: ScaleSzie(30), paddingBottom: ScaleSzie(20)
                }} >
                    {/* ----------- Enter Phone ---------- */}
                    <View style={{ height: ScaleSzie(45), flexDirection: 'row' }} >
                        <View style={{ width: ScaleSzie(70), marginRight: ScaleSzie(10) }} >
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
                            paddingHorizontal: ScaleSzie(10), backgroundColor: "#fff"
                        }} >
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '999-999-9999'
                                }}
                                style={{
                                    flex: 1, fontSize: ScaleSzie(18),
                                    padding: 0, margin: 0,
                                }}
                                placeholder={'Phone number'}
                                value={phone}
                                onChangeText={(phone) => this.setState({ phone })}
                                onSubmitEditing={this.submitCustomerInfo}
                                keyboardType="phone-pad"
                            />
                        </View>

                    </View>
                    {/* ------- Button -------- */}
                    <View style={{ marginTop: ScaleSzie(20), alignItems: 'center', }} >
                        {
                            loading ? <View style={{
                                width: ScaleSzie(120), height: ScaleSzie(45), backgroundColor: '#0764B0',
                                justifyContent: 'center', alignItems: 'center'
                            }} >
                                <ActivityIndicator
                                    size="large"
                                    color="#fff"
                                />
                            </View> : <ButtonCustom
                                width={ScaleSzie(120)}
                                height={40}
                                backgroundColor="#0764B0"
                                title="NEXT"
                                textColor="#fff"
                                onPress={this.submitCustomerInfo}
                                style={{
                                    borderWidth: 1, borderColor: '#C5C5C5',
                                    borderRadius: 5
                                }}
                                styleText={{ fontWeight: "600", fontSize: ScaleSzie(16) }}
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
    listStaffByMerchant: state.staff.listStaffByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
    groupAppointment: state.appointment.groupAppointment,
    visibleEnterCustmerPhonePopup: state.appointment.visibleEnterCustmerPhonePopup,
    loading: state.app.loading
})

export default connectRedux(mapStateToProps, EnterCustomerPhonePopup);

