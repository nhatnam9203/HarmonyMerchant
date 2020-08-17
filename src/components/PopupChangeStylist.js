import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Keyboard,
    TextInput
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import connectRedux from '@redux/ConnectRedux';

import { scaleSzie, formatWithMoment } from '../utils';

class PopupChangeStylist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            staffId: '',
            name: '',
            tip: 0.00,
            price: 0.00,
            bookingServiceId: '',
            serviceIdLocal: '',
            appointmentIdChangeStylist: -1,
            note:""
        };
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

    setStateFromParent = async (service, appointmentId) => {
        const { staff } = service;
        console.log("------ service : ",JSON.stringify(service));
        await this.setState({
            staffId: staff && staff.staffId ? staff.staffId : '',
            name: staff && staff.displayName ? staff.displayName : '',
            bookingServiceId: service.data.bookingServiceId ? service.data.bookingServiceId : '',
            tip: staff && staff.tip ? staff.tip : 0.00,
            serviceIdLocal: service.data.serviceId ? service.data.serviceId : '',
            appointmentIdChangeStylist: appointmentId,
            price: service.data && service.data.price ? service.data.price : 0.00,
            note: service.note ? service.note : ""
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
        const { staffId, bookingServiceId, tip, serviceIdLocal, appointmentIdChangeStylist, price,note } = this.state;
        const { groupAppointment } = this.props;
        if (_.isEmpty(groupAppointment)) {
            this.props.changeStylistBasketLocal(serviceIdLocal, staffId, tip, price);
        } else {
            this.props.actions.marketing.changeStylist(staffId, bookingServiceId, tip, appointmentIdChangeStylist, price, 0,note ,true);

        }
        this.props.onRequestClose();
    }

    onFocusToScroll = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true })
    }

    // --------------- Render -----------

    render() {
        const { title, visible, listStaffByMerchant, onRequestClose, confimYes } = this.props;
        const { name, tip, price ,note} = this.state;
        const dataDropdown = this.getStaffDataDropdown(listStaffByMerchant)
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={scaleSzie(260)}
                styleTitle={{ fontSize: scaleSzie(22), fontWeight: "bold" }}
            >
                <View style={{
                    height: scaleSzie(420), backgroundColor: '#FAFAFA',
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
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                                Stylist
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
                                />
                            </View>
                            {/* ------- Price -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                                Price ($)
                            </Text>
                            {/* ------- Box Price -------- */}
                            <View style={{
                                height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSzie(10), marginBottom: scaleSzie(10)
                            }} >
                                <TextInputMask
                                    // type="only-numbers"
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
                                    onFocus={() => this.onFocusToScroll(90)}
                                />
                            </View>
                            {/* ------- Tip -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                                Tip ($)
                            </Text>
                            {/* ------- Box Tip -------- */}
                            <View style={{
                                height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSzie(10)
                            }} >
                                <TextInputMask
                                    // type="only-numbers"
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
                                    onFocus={() => this.onFocusToScroll(160)}
                                />
                            </View>
                            {/* ------- Note -------- */}
                            <Text style={{
                                color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5),
                                marginTop: scaleSzie(10)
                            }} >
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
                                    onChangeText={note => this.setState({note})}
                                    onFocus={() => this.onFocusToScroll(200)}
                                />
                            </View>

                            {/* ------- Button -------- */}
                            <View style={{ marginTop: scaleSzie(20), alignItems: 'center', }} >
                                <ButtonCustom
                                    width={scaleSzie(120)}
                                    height={45}
                                    backgroundColor="#0764B0"
                                    title="Submit"
                                    textColor="#fff"
                                    onPress={this.submitChangeStylist}
                                    style={{
                                        borderWidth: 1, borderColor: '#C5C5C5',
                                        borderRadius: 4
                                    }}
                                />
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
    groupAppointment: state.appointment.groupAppointment
})

export default connectRedux(mapStateToProps, PopupChangeStylist);

