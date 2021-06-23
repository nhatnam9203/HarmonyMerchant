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

import { Dropdown, PopupParent, ButtonCustom } from '@components';
import connectRedux from '@redux/ConnectRedux';
import { ScaleSzie, localize, formatWithMoment } from '@utils';

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
            note: ""
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

    setStateFromParent = async (service) => {
        const { staff } = service;
        await this.setState({
            staffId: staff?.staffId || '',
            name: staff?.displayName || '',
            bookingServiceId:  service?.data?.bookingServiceId || '',
            tip: staff?.tip || 0.00,
            serviceIdLocal: service?.data?.serviceId || '',
            price: service?.data?.price || 0.00,
            note: service?.note || ""
        })
    }

    getStaffDataDropdown(staffs) {
        const { appointmentDetail } = this.props;
        let fromTime = new Date();
        if (!_.isEmpty(appointmentDetail)) {
            fromTime = appointmentDetail?.fromTime || new Date();
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
        const { staffId, bookingServiceId, tip, serviceIdLocal, price,note } = this.state;
        const { appointmentDetail } = this.props;
        if (_.isEmpty(appointmentDetail)) {
            this.props.changeStylistBasketLocal(serviceIdLocal, staffId, tip);
        } else {
            this.props.actions.marketing.changeStylist(staffId, bookingServiceId, tip, appointmentDetail.appointmentId, price, 0, note);
        }
        this.props.onRequestClose();
    }

    onFocusToScroll = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: ScaleSzie(number), animated: true })
    }

    // --------------- Render -----------
    render() {
        const { title, visible, listStaffByMerchant, onRequestClose, language } = this.props;
        const { name, tip, price, note } = this.state;
        const dataDropdown = this.getStaffDataDropdown(listStaffByMerchant)
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={ScaleSzie(260)}
                styleTitle={{ fontSize: ScaleSzie(22), fontWeight: "bold" }}
            >
                <View style={{
                    height: ScaleSzie(420), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: ScaleSzie(15), borderBottomRightRadius: ScaleSzie(15),
                    paddingHorizontal: ScaleSzie(16),
                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            ref={this.scrollRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <View style={{ height: ScaleSzie(20) }} />
                            <Text style={{ color: '#6A6A6A', fontSize: ScaleSzie(16), marginBottom: ScaleSzie(5) }} >
                                {`${localize('Staff', language)}`}
                            </Text>
                            {/* ------- Dropdown -------- */}
                            <View style={{ height: ScaleSzie(40), marginBottom: ScaleSzie(10) }} >
                                <Dropdown
                                    label={`${localize('Name', language)}`}
                                    data={dataDropdown}
                                    value={name}
                                    onChangeText={(value, index) => this.changeStylist(value, dataDropdown[index].staffId)}
                                    containerStyle={{
                                        backgroundColor: '#fff',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1
                                    }}
                                    fontSize={ScaleSzie(14)}
                                    extraHeight={ScaleSzie(90)}
                                />
                            </View>
                            {/* ------- Price -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: ScaleSzie(16), marginBottom: ScaleSzie(5) }} >
                                Price ($)
                        </Text>
                            {/* ------- Box Price -------- */}
                            <View style={{
                                height: ScaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: ScaleSzie(10), marginBottom: ScaleSzie(10)
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
                                    style={{ flex: 1, fontSize: ScaleSzie(16), color: '#6A6A6A' }}
                                    value={price}
                                    onChangeText={(price) => this.setState({ price })}
                                    onFocus={() => this.onFocusToScroll(90)}
                                />
                            </View>
                            {/* ------- Tip -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: ScaleSzie(16), marginBottom: ScaleSzie(5) }} >

                                {`${localize('Tip ($)', language)}`}
                            </Text>
                            {/* ------- Box -------- */}
                            <View style={{
                                height: ScaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: ScaleSzie(10)
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
                                    style={{ flex: 1, fontSize: ScaleSzie(16), color: '#6A6A6A' }}
                                    value={tip}
                                    onChangeText={(tip) => this.setState({ tip })}
                                    onFocus={() => this.onFocusToScroll(160)}
                                />
                            </View>
                            {/* ------- Note -------- */}
                            <Text style={{
                                color: '#6A6A6A', fontSize: ScaleSzie(16), marginBottom: ScaleSzie(5),
                                marginTop: ScaleSzie(10)
                            }} >
                                {`Note`}
                            </Text>
                            <View style={{
                                height: ScaleSzie(70), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: ScaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: ScaleSzie(16), color: '#6A6A6A' }}
                                    multiline={true}
                                    value={note}
                                    onChangeText={note => this.setState({ note })}
                                    onFocus={() => this.onFocusToScroll(200)}
                                />
                            </View>
                            {/* ------- Button -------- */}
                            <View style={{ marginTop: ScaleSzie(20), alignItems: 'center', }} >
                                <ButtonCustom
                                    width={ScaleSzie(120)}
                                    height={45}
                                    backgroundColor="#0764B0"
                                    title={`${localize('Submit', language)}`}
                                    textColor="#fff"
                                    onPress={this.submitChangeStylist}
                                    style={{
                                        borderWidth: 1, borderColor: '#C5C5C5',
                                        borderRadius: 4
                                    }}
                                />
                            </View>

                            <View style={{ height: ScaleSzie(200) }} />
                        </ScrollView>
                    </View>
                </View>
            </PopupParent>
        );
    }

    componentWillUnmount() {
        this.keyboardWillHide?.remove();
    }

}

const mapStateToProps = state => ({
    listStaffByMerchant: state.staff.listStaffByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, PopupChangeStylist);

