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
import { scaleSzie, ListCodeAreaPhone, getCodeAreaPhone } from '@utils';

const initalState = {
    codeAreaPhone: '+1',
    phone: "",
    firstName: "",
    lastName: ""
};

class PopupChangeCustomerInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.handleKeyboardWillHide);
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
            phone : phoneNumber
        });
    }

    onFocusToScroll = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true })
    }

    onRequestClose = () => {
        this.setState(initalState);
        this.props.actions.appointment.switchVisibleEnterCustomerPhonePopup(false);
    }

    // --------------- Render -----------

    render() {
        const { title, visibleEnterCustmerPhonePopup, loading, confimYes } = this.props;
        const { codeAreaPhone, phone, firstName, lastName } = this.state;

        return (
            <PopupParent
                title={title}
                visible={visibleEnterCustmerPhonePopup}
                onRequestClose={this.onRequestClose}
                width={scaleSzie(260)}
                styleTitle={{ fontSize: scaleSzie(22), fontWeight: "bold" }}
            >
                <View style={{
                    height: scaleSzie(320), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(16),

                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            ref={this.scrollRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <View style={{ height: scaleSzie(20) }} />
                            {/* ------- Price -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14), marginBottom: scaleSzie(5), fontWeight: "600" }} >
                                {`First Name`}
                            </Text>
                            {/* ------- Box Price -------- */}
                            <View style={{
                                height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSzie(10), marginBottom: scaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                    value={firstName}
                                    onChangeText={(firstName) => this.setState({ firstName })}
                                    placeholder=""
                                />
                            </View>
                            {/* ------- Tip -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14), marginBottom: scaleSzie(5), fontWeight: "600" }} >
                                {`Last Name`}
                            </Text>
                            {/* ------- Box Tip -------- */}
                            <View style={{
                                height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSzie(10), marginBottom: scaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                    value={lastName}
                                    onChangeText={(lastName) => this.setState({ lastName })}
                                    onFocus={() => this.onFocusToScroll(80)}
                                    placeholder=""
                                />
                            </View>

                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14), marginBottom: scaleSzie(5), fontWeight: "600" }} >
                                {`Phone Number`}
                            </Text>

                            {/* ----------- Enter Phone ---------- */}
                            <View style={{
                                height: scaleSzie(45), flexDirection: 'row'
                            }} >
                                <View style={{ width: scaleSzie(70), marginRight: scaleSzie(10) }} >
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
                                    paddingHorizontal: scaleSzie(10), backgroundColor: "#fff"
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
                                        placeholder={'Phone number'}
                                        value={phone}
                                        onChangeText={(phone) => this.setState({ phone })}
                                        onSubmitEditing={this.submitCustomerInfo}
                                        keyboardType="phone-pad"
                                        onFocus={() => this.onFocusToScroll(155)}
                                    />
                                </View>

                            </View>
                            {/* ------- Button -------- */}
                            <View style={{ marginTop: scaleSzie(20), alignItems: 'center', }} >
                                {
                                    loading ? <View style={{
                                        width: scaleSzie(120), height: scaleSzie(45), backgroundColor: '#0764B0',
                                        justifyContent: 'center', alignItems: 'center'
                                    }} >
                                        <ActivityIndicator
                                            size="large"
                                            color="#fff"
                                        />
                                    </View> : <ButtonCustom
                                            width={scaleSzie(120)}
                                            height={45}
                                            backgroundColor="#0764B0"
                                            title="Submit"
                                            textColor="#fff"
                                            onPress={this.submitCustomerInfo}
                                            style={{
                                                borderWidth: 1, borderColor: '#C5C5C5',
                                                borderRadius: scaleSzie(4)
                                            }}
                                        />
                                }

                            </View>
                            <View style={{ height: scaleSzie(200) }} />
                        </ScrollView>
                    </View>
                </View>
            </PopupParent>
        );
    }

    componentWillUnmount() {
        this.keyboardWillHide.remove();
    }


}



const mapStateToProps = state => ({
    listStaffByMerchant: state.staff.listStaffByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
    groupAppointment: state.appointment.groupAppointment,
    visibleEnterCustmerPhonePopup: state.appointment.visibleEnterCustmerPhonePopup,
    loading: state.app.loading
})

export default connectRedux(mapStateToProps, PopupChangeCustomerInfo);

