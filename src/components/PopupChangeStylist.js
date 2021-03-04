import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Keyboard,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _, { is } from 'ramda';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import connectRedux from '@redux/ConnectRedux';
import { scaleSzie, formatWithMoment } from '../utils';
import ICON from "@resources";
import Button from './Button';

const INIT_STATE = {
    staffId: '',
    name: '',
    tip: 0.00,
    price: 0.00,
    bookingServiceId: '',
    serviceIdLocal: '',
    appointmentIdChangeStylist: -1,
    note: "",
    extras: []
}

class PopupChangeStylist extends React.Component {

    constructor(props) {
        super(props);
        this.state = INIT_STATE;
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        // this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.handleKeyboardWillHide);
    }

    handleKeyboardWillHide = async () => {

        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        }

    }

    setStateFromParent = async (service, appointmentId) => {
        const { servicesByMerchant } = this.props;
        const { staff } = service;
        let extras = [];

        for (let i = 0; i < servicesByMerchant.length; i++) {
            if (servicesByMerchant[i]?.serviceId === service?.data?.serviceId) {
                extras = servicesByMerchant[i]?.extras ? [...servicesByMerchant[i]?.extras] : [];
                break;
            }
        }

        const arrSelectedExtra = service?.extras || [];
        for (let i = 0; i < arrSelectedExtra.length; i++) {
            for (let j = 0; j < extras.length; j++) {
                if (extras[j]?.extraId === arrSelectedExtra[i]?.data?.extraId) {
                    extras[j] = { ...extras[j], isSelect: true };
                    break;
                }
            }
        }

        await this.setState({
            staffId: staff && staff.staffId ? staff.staffId : '',
            name: staff && staff.displayName ? staff.displayName : '',
            bookingServiceId: service.data.bookingServiceId ? service.data.bookingServiceId : '',
            tip: staff && staff.tip ? staff.tip : 0.00,
            serviceIdLocal: service.data.serviceId ? service.data.serviceId : '',
            appointmentIdChangeStylist: appointmentId,
            price: service.data && service.data.price ? service.data.price : 0.00,
            note: service.note ? service.note : "",
            extras: [...extras]
        })
    }

    getStaffDataDropdown(staffs) {
        const { groupAppointment } = this.props;
        const { appointmentIdChangeStylist } = this.state;
        let fromTime = new Date();

        if (!_.isEmpty(groupAppointment)) {
            const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
            const appointmentDetail = appointments.find(appointment => appointment.appointmentId === appointmentIdChangeStylist);
            fromTime = appointmentDetail && appointmentDetail.fromTime ? appointmentDetail.fromTime : new Date();
        }
        const data = [];
        const dayNameOfWeek = formatWithMoment(fromTime, "dddd");

        for (let i = 0; i < staffs.length; i++) {
            if (staffs[i].isDisabled === 0 && staffs[i].isActive && (staffs[i].workingTimes[dayNameOfWeek]).isCheck) {
                data.push({
                    staffId: staffs[i].staffId,
                    value: `${staffs[i].displayName}`
                });
            }
        };
        return data;
    }

    changeStylist = async (name, id) => {
        await this.setState({
            staffId: id,
            name
        })
    }

    submitChangeStylist = () => {
        const { staffId, bookingServiceId, tip, serviceIdLocal, appointmentIdChangeStylist, price, note } = this.state;
        const { groupAppointment } = this.props;
        if (_.isEmpty(groupAppointment)) {
            this.props.changeStylistBasketLocal(serviceIdLocal, staffId, tip, price);
        } else {
            this.props.actions.marketing.changeStylist(staffId, bookingServiceId, tip, appointmentIdChangeStylist, price, 0, note, true);

        }
        this.props.onRequestClose();
    }

    onFocusToScroll = (number) => () => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true })
    }

    onRequestClose = () => {
        this.setState(INIT_STATE);
        this.props.onRequestClose();
    }

    selectExtra = (extra) => () => {
        const { extras } = this.state;
        const tempExtra = [...extras];
        for (let i = 0; i < tempExtra.length; i++) {
            if (tempExtra[i]?.extraId === extra?.extraId) {
                tempExtra[i]["isSelect"] = !tempExtra[i]?.isSelect;
                break;
            }
        }
        this.setState({
            extras: tempExtra
        })

    }

    // --------------- Render -----------

    render() {
        const { title, visible, listStaffByMerchant, confimYes } = this.props;
        const { name, tip, price, note, extras } = this.state;
        const dataDropdown = this.getStaffDataDropdown(listStaffByMerchant)
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.onRequestClose}
                width={scaleSzie(280)}
                styleTitle={{ fontSize: scaleSzie(20), fontWeight: "600" }}
            >
                <View style={{
                    height: scaleSzie(420), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30),

                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            ref={this.scrollRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <TouchableOpacity activeOpacity={1} >
                                <View style={{ height: scaleSzie(20) }} />
                                <Text style={[styles.txt_title,]} >
                                    {`Staff`}
                                </Text>
                                {/* ------- Dropdown -------- */}
                                <View style={{ height: scaleSzie(40), marginBottom: scaleSzie(10) }} >
                                    <Dropdown
                                        label='Name'
                                        data={dataDropdown}
                                        value={name}
                                        onChangeText={(value, index) => this.changeStylist(value, dataDropdown[index].staffId)}
                                        containerStyle={{
                                            backgroundColor: '#fff',
                                            borderWidth: 1,
                                            borderColor: '#C5C5C5',
                                            flex: 1
                                        }}
                                        fontSize={scaleSzie(14)}
                                        extraHeight={scaleSzie(90)}
                                    />
                                </View>
                                {/* ------- Price -------- */}
                                <Text style={[styles.txt_title,]} >
                                    {`Price ($)`}
                                </Text>
                                {/* ------- Box Price -------- */}
                                <View style={{
                                    height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingHorizontal: scaleSzie(10), marginBottom: scaleSzie(10)
                                }} >
                                    <TextInputMask
                                        type={'money'}
                                        options={{
                                            precision: 2,
                                            separator: '.',
                                            delimiter: ',',
                                            unit: '',
                                            suffixUnit: ''
                                        }}
                                        style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                        value={price}
                                        onChangeText={(price) => this.setState({ price })}
                                        onFocus={this.onFocusToScroll(110)}
                                    />
                                </View>
                                {/* ------- Tip -------- */}
                                <Text style={[styles.txt_title,]} >
                                    {`Tip ($)`}
                                </Text>
                                {/* ------- Box Tip -------- */}
                                <View style={{
                                    height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingHorizontal: scaleSzie(10)
                                }} >
                                    <TextInputMask
                                        type={'money'}
                                        options={{
                                            precision: 2,
                                            separator: '.',
                                            delimiter: ',',
                                            unit: '',
                                            suffixUnit: ''
                                        }}
                                        style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                        value={tip}
                                        onChangeText={(tip) => this.setState({ tip })}
                                        onFocus={this.onFocusToScroll(185)}
                                    />
                                </View>

                                {/* ----------- Extra ----------- */}
                                <Text style={[styles.txt_title, { marginTop: scaleSzie(10) }]} >
                                    {`Extra`}
                                </Text>

                                {
                                    extras.map((extra, index) => <ExtraItem
                                        key={`${extra?.extraId}_${index}`}
                                        extra={extra}
                                        selectExtra={this.selectExtra(extra)}
                                    />)
                                }

                                {/* ------- Note -------- */}
                                <Text style={[styles.txt_title, { marginTop: scaleSzie(10) }]} >
                                    {`Note`}
                                </Text>
                                <View style={{
                                    height: scaleSzie(70), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingHorizontal: scaleSzie(10)
                                }} >
                                    <TextInput
                                        style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                        multiline={true}
                                        value={note}
                                        onChangeText={note => this.setState({ note })}
                                        onFocus={this.onFocusToScroll(400)}
                                    />
                                </View>

                                {/* ------- Button -------- */}
                                <View style={{ marginTop: scaleSzie(20), alignItems: 'center', }} >
                                    <ButtonCustom
                                        width={scaleSzie(120)}
                                        height={45}
                                        backgroundColor="#0764B0"
                                        title="SUBMIT"
                                        textColor="#fff"
                                        onPress={this.submitChangeStylist}
                                        style={{
                                            borderWidth: 1, borderColor: '#C5C5C5',
                                            borderRadius: 4
                                        }}
                                        styleText={{ fontWeight: "400", fontSize: scaleSzie(16) }}
                                    />
                                </View>
                                <View style={{ height: scaleSzie(250) }} />
                            </TouchableOpacity>
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


const ExtraItem = ({ extra, selectExtra }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                marginBottom: scaleSzie(10),
                alignItems: "center",
            }}
        >
            <Button onPress={selectExtra} style={{ width: scaleSzie(18), height: scaleSzie(18)}} >
                <Image source={extra?.isSelect ? ICON.checkBox : ICON.checkBoxEmpty} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
            </Button>

            <View style={{ width: scaleSzie(36), height: scaleSzie(36), marginLeft: scaleSzie(14), marginRight: scaleSzie(10) }} >
                {
                    extra?.imageUrl ?
                        <Image source={{ uri: extra?.imageUrl }} style={{ width: scaleSzie(36), height: scaleSzie(36) }} />
                        :
                        <Image source={ICON.extra_holder} style={{ width: scaleSzie(36), height: scaleSzie(36) }} />
                }
            </View>
            <Text style={{ flex: 1, color: "#404040", fontWeight: "600", fontSize: scaleSzie(14) }} >
                {extra?.name}
            </Text>
            <View style={{ width: 10 }} />
            <View style={{
                width: scaleSzie(100), flexDirection: "row", justifyContent: "space-between", alignItems: "center",
            }} >
                <Text numberOfLines={2} style={{ color: "#404040", fontSize: scaleSzie(12), fontWeight: "300" }} >
                    {`15 min`}
                </Text>

                <Text style={{ color: "#404040", fontSize: scaleSzie(12), fontWeight: "600" }} >
                    {`$ ${extra?.price || `0.00`}`}
                </Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    txt_title: {
        color: "#404040",
        fontSize: scaleSzie(15),
        fontWeight: "500",
        marginBottom: scaleSzie(8),
        marginTop: scaleSzie(8)
    }
})

const mapStateToProps = state => ({
    listStaffByMerchant: state.staff.listStaffByMerchant,
    groupAppointment: state.appointment.groupAppointment,
    servicesByMerchant: state.service.servicesByMerchant
})

export default connectRedux(mapStateToProps, PopupChangeStylist);

