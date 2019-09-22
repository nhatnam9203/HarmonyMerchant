import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';

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
            tip: '',
            bookingServiceId: ''
        }
    }

    setStateFromParent = async (service) => {
        if (service.staff) {
            const { staff } = service;
            await this.setState({
                staffId: staff.staffId,
                name: staff.displayName,
                bookingServiceId: service.data.bookingServiceId
            })
        }

    }

    getStaffDataDropdown(staffs) {
        const data = [];
        for (let i = 0; i < staffs.length; i++) {
            data.push({
                staffId: staffs[i].staffId,
                value: `${staffs[i].firstName} ${staffs[i].lastName}`
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
        const { staffId, bookingServiceId, tip } = this.state;
        const {appointmentDetail} = this.props;
        this.props.actions.marketing.changeStylist(staffId, bookingServiceId, tip, appointmentDetail.appointmentId);
    }

    // --------------- Render -----------

    render() {
        const { title, visible, listStaffByMerchant, onRequestClose, confimYes } = this.props;
        const { name } = this.state;
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
                                label='Facial'
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
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}

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

