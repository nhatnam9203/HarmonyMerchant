import React from 'react';
import {
    View,
    Text,
    Image,
    FlatList
} from 'react-native';
import _, { } from 'ramda';

import { ButtonCustom, PopupParent, Button } from '@components';
import connectRedux from '@redux/ConnectRedux';
import { ScaleSzie } from '@utils';
import ICON from "@resources"

const initalState = {
    visible: false,
    mainAppointmentId: 0,
    data: {
        services: [],
        extras: [],
        products: [],
        giftCards: []
    }
};

class PopupAddItemIntoAppointments extends React.Component {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.scrollRef = React.createRef();
        this.listAppointmentRef = [];
    }


    handleKeyboardWillHide = async () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        }
    }

    setStateFromParent = async (data, mainAppointmentId) => {
        await this.setState({
            visible: true,
            data,
            mainAppointmentId
        })
    }

    onRequestClose = () => {
        this.setState(initalState);

    }

    addRef = (ref) => {
        if (ref) {
            this.listAppointmentRef.push(ref);
        }
    }

    addItemIntoAppointments = async () => {
        const { data, mainAppointmentId } = this.state;
        let isNotCheck = true;
        for (let i = 0; i < this.listAppointmentRef.length; i++) {
            const ref = this.listAppointmentRef[i];
            if (ref.state.ischeck) {
                isNotCheck = false;
                const appointmentId = ref?.props?.appointment?.appointmentId || 0;
                if (data.services.length > 0) {
                    const staffId = ref?.props?.appointment?.staffId || 0;
                    if (staffId) {
                        const tempService = { ...data.services[0], staffId };
                        this.props.actions.appointment.addItemIntoMultiAppointment({ ...data, services: [tempService] }, appointmentId, mainAppointmentId, true);
                    } else {
                        this.props.actions.appointment.addItemIntoMultiAppointment(data, appointmentId, mainAppointmentId, true);
                    }
                } else {
                    this.props.actions.appointment.addItemIntoMultiAppointment(data, appointmentId, mainAppointmentId, true);
                }
            }
        }

        if (isNotCheck) {
            alert("Choose at least the one to add into!")
        } else {
            await this.setState({
                visible: false,
            })
        }
    }

    // --------------- Render -----------

    render() {
        const { title, groupAppointment } = this.props;
        const { visible } = this.state;
        const appointments = groupAppointment?.appointments || [];

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.onRequestClose}
                width={ScaleSzie(250)}
                styleTitle={{ fontSize: ScaleSzie(22), fontWeight: "bold" }}
            >
                <View style={{
                    height: ScaleSzie(320), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15),
                    paddingHorizontal: ScaleSzie(16),

                }} >
                    <Text style={{
                        textAlign: "center", marginTop: ScaleSzie(15),
                        fontWeight: "600", fontSize: ScaleSzie(14), color: "#404040"
                    }} >
                        {`Please choose the client to add`}
                    </Text>
                    <Text style={{
                        textAlign: "center", marginBottom: ScaleSzie(15),
                        fontWeight: "600", fontSize: ScaleSzie(14), color: "#404040"
                    }} >
                        {`this service/product.`}
                    </Text>
                    <View style={{ flex: 1 }} >

                        <FlatList
                            data={appointments}
                            renderItem={({ item, index }) => <ItemAppointment
                                ref={this.addRef}
                                key={`${item.appointmentId}_${index}`}
                                appointment={item}
                                index={index + 1}
                            />}
                            keyExtractor={(item, index) => `${item.appointmentId}_${index}`}
                            ListFooterComponent={() => <View style={{ height: ScaleSzie(50) }} />}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>


                    <View style={{ alignItems: "center", paddingBottom: ScaleSzie(15) }} >
                        <ButtonCustom
                            width={ScaleSzie(130)}
                            height={40}
                            backgroundColor="#0764B0"
                            title="Add"
                            textColor="#fff"
                            onPress={this.addItemIntoAppointments}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                borderRadius: ScaleSzie(4)
                            }}
                            styleText={{ fontWeight: '600', fontSize: ScaleSzie(18) }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.visible !== this.state.visible && !this.state.visible) {
            this.listAppointmentRef = [];
        }
    }

    componentWillUnmount() {
        this.listAppointmentRef = [];
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
        const { appointment, index } = this.props;
        const { ischeck } = this.state;
        const iconIsCheck = ischeck ? ICON.checkBox : ICON.checkBoxEmpty;
        const firstName = appointment.firstName ? appointment.firstName : "";
        const lastName = appointment.lastName ? appointment.lastName : "";
        const code = appointment.code ? appointment.code : "";

        return (
            <Button onPress={this.toogleIsCheck} style={{
                height: ScaleSzie(45), flexDirection: "row",
                borderBottomColor: '#C5C5C5', borderBottomWidth: 1, paddingHorizontal: ScaleSzie(10),
            }} >
                <View style={{ justifyContent: "center", paddingRight: ScaleSzie(10) }} >
                    <Text style={{ fontWeight: "bold", fontSize: ScaleSzie(12), color: "#404040" }} >
                        {`${index}.`}
                    </Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <Text style={{ fontWeight: "500", fontSize: ScaleSzie(14), color: "#404040", marginBottom: ScaleSzie(2) }} >
                        {`${firstName} ${lastName}`}
                    </Text>
                    <Text style={{ fontWeight: "300", fontSize: ScaleSzie(13), color: "#6A6A6A" }} >
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
    visibleEnterCustmerPhonePopup: state.appointment.visibleEnterCustmerPhonePopup,
    loading: state.app.loading
})

export default connectRedux(mapStateToProps, PopupAddItemIntoAppointments);

