import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import connectRedux from '@redux/ConnectRedux';

import { scaleSzie } from '../utils';

class PopupChangeStylist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            staffId: '',
            name: '',
            tip: 0.00,
            bookingServiceId: '',
            serviceIdLocal: ''
        }
    }

    setStateFromParent = async (service) => {
        // console.log('serviec : '+ JSON.stringify(service));
        const { staff } = service;
        await this.setState({
            staffId: staff && staff.staffId ? staff.staffId : '',
            name: staff && staff.displayName ? staff.displayName : '',
            bookingServiceId: service.data.bookingServiceId ? service.data.bookingServiceId : '',
            tip: staff && staff.tip ? staff.tip : 0.00,
            serviceIdLocal: service.data.serviceId ? service.data.serviceId : ''
        })
    }

    getStaffDataDropdown(staffs) {
        const data = [];
        for (let i = 0; i < staffs.length; i++) {
            data.push({
                staffId: staffs[i].staffId,
                value: `${staffs[i].displayName}`
            })
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
        const { staffId, bookingServiceId, tip, serviceIdLocal } = this.state;
        const { appointmentDetail } = this.props;
        if (_.isEmpty(appointmentDetail)) {
            this.props.changeStylistBasketLocal(serviceIdLocal,staffId,tip);
        } else {
            this.props.actions.marketing.changeStylist(staffId, bookingServiceId, tip, appointmentDetail.appointmentId);
        }
        this.props.onRequestClose();

    }

    // --------------- Render -----------

    render() {
        const { title, visible, listStaffByMerchant, onRequestClose, confimYes } = this.props;
        const { name, tip } = this.state;
        const dataDropdown = this.getStaffDataDropdown(listStaffByMerchant)
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={scaleSzie(200)}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(50) }}
            >
                <View style={{
                    height: scaleSzie(250), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(16),
                    paddingTop: scaleSzie(20), paddingBottom: scaleSzie(16)
                }} >
                    <View style={{ flex: 1 }} >
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
                        {/* ------- Tip -------- */}
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                            Price ($)
                        </Text>
                        {/* ------- Box -------- */}
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
                            />
                        </View>
                        {/* ------- Button -------- */}
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }} >
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
                    </View>
                </View>
            </PopupParent>
        );
    }

}



const mapStateToProps = state => ({
    listStaffByMerchant: state.staff.listStaffByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
})



export default connectRedux(mapStateToProps, PopupChangeStylist);

