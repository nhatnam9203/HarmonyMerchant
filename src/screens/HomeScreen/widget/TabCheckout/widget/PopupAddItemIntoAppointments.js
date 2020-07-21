import React, { useState } from 'react';
import {
    View,
    Text,
    Keyboard,
    Image,
    FlatList
} from 'react-native';
import _, { } from 'ramda';

import { ButtonCustom, PopupParent, Button } from '@components';
import connectRedux from '@redux/ConnectRedux';
import { scaleSzie, getCodeAreaPhone } from '@utils';
import ICON from "@resources"

const initalState = {
    codeAreaPhone: '+1',
    phone: "",
    firstName: "",
    lastName: ""
};

class PopupAddItemIntoAppointments extends React.Component {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.scrollRef = React.createRef();
        this.listAppointmentRef = [];
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
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true })
    }

    onRequestClose = () => {
        this.setState(initalState);
        this.props.onRequestClose();
    }

    addRef = (ref) => {
        console.log("----ref : ", ref);
        if (ref) {
            this.listAppointmentRef.push(ref);
        }
    }


    addItemIntoAppointments = () => {
        console.log(this.listAppointmentRef);
    }

    // --------------- Render -----------

    render() {
        const { title, visible, groupAppointment } = this.props;
        const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.onRequestClose}
                width={scaleSzie(200)}
                styleTitle={{ fontSize: scaleSzie(22), fontWeight: "bold" }}
            >
                <View style={{
                    height: scaleSzie(320), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(16),

                }} >
                    <Text style={{
                        textAlign: "center", marginVertical: scaleSzie(15),
                        fontWeight: "600", fontSize: scaleSzie(14), color: "#404040"
                    }} >
                        {`What are appointments you'd like to add into?`}
                    </Text>
                    <View style={{ flex: 1 }} >

                        <FlatList
                            data={appointments}
                            renderItem={({ item, index }) => <ItemAppointment
                                ref={this.addRef}
                                key={`${item.appointmentId}_${index}`}
                                appointment={item}
                            />}
                            keyExtractor={(item, index) => `${item.appointmentId}_${index}`}
                            ListFooterComponent={() => <View style={{ height: scaleSzie(200) }} />}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>


                    <View style={{ alignItems: "center", paddingBottom: scaleSzie(15) }} >
                        <ButtonCustom
                            width={scaleSzie(130)}
                            height={40}
                            backgroundColor="#0764B0"
                            title="Add"
                            textColor="#fff"
                            onPress={this.addItemIntoAppointments}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                borderRadius: scaleSzie(4)
                            }}
                            styleText={{ fontWeight: '600', fontSize: scaleSzie(18) }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

    componentWillUnmount() {
        this.keyboardWillHide.remove();
    }

}

class ItemAppointment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ischeck: false
        }
    }

    toogleIsCheck = () => {
        this.setState(prevSate => ({
            ischeck: !prevSate.ischeck
        }))
    }

    render() {
        const { appointment } = this.props;
        const { ischeck } = this.state;
        const iconIsCheck = ischeck ? ICON.checkBox : ICON.checkBoxEmpty;
        const firstName = appointment.firstName ? appointment.firstName : "";
        const lastName = appointment.lastName ? appointment.lastName : "";
        const code = appointment.code ? appointment.code : "";

        return (
            <Button onPress={this.toogleIsCheck} style={{
                height: scaleSzie(45), flexDirection: "row",
                borderBottomColor: '#C5C5C5', borderBottomWidth: 1, paddingHorizontal: scaleSzie(10),
            }} >
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <Text style={{ fontWeight: "500", fontSize: scaleSzie(14), color: "#404040", marginBottom: scaleSzie(2) }} >
                        {`${firstName} ${lastName}`}
                    </Text>
                    <Text style={{ fontWeight: "300", fontSize: scaleSzie(13), color: "#6A6A6A" }} >
                        {`#${code}`}
                    </Text>
                </View>
                <View style={{ justifyContent: "center" }} >
                    <Image source={iconIsCheck} />
                </View>
            </Button>
        );
    }

}







const mapStateToProps = state => ({
    listStaffByMerchant: state.staff.listStaffByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
    groupAppointment: state.appointment.groupAppointment,
    visiblePopupCustomerInfoBuyAppointment: state.appointment.visiblePopupCustomerInfoBuyAppointment,
    loading: state.app.loading
})

export default connectRedux(mapStateToProps, PopupAddItemIntoAppointments);

