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

import { scaleSzie } from '../utils';

class PopupChangeTip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appointmentId: '',
            tip: 0.00,
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

    setStateFromParent = async (appointmentId, tip) => {
        await this.setState({
            appointmentId,
            tip
        });
    }

    getStaffDataDropdown(staffs) {
        const data = [];
        for (let i = 0; i < staffs.length; i++) {
            if (staffs[i].isDisabled === 0) {
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
        const { price, name, quantity, appointmentIdChangeProduct, bookingProductId, productIdLocal } = this.state;
        const { groupAppointment } = this.props;
        if (_.isEmpty(groupAppointment)) {
            // this.props.changeStylistBasketLocal(serviceIdLocal, staffId, tip, price);
            this.props.changeProductBasketLocal(productIdLocal, price, quantity)
        } else {
            // this.props.actions.marketing.changeStylist(staffId, bookingServiceId, tip, appointmentIdChangeStylist, price, true);
            this.props.actions.appointment.updateProductInAppointment(appointmentIdChangeProduct, {
                bookingProductId,
                price,
                quantity
            })
        }
        this.props.onRequestClose();
    }

    onFocusToScroll = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true })
    }

    // --------------- Render -----------

    render() {
        const { title, visible, onRequestClose, confimYes } = this.props;
        const { tip } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={scaleSzie(260)}
                // style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(50) }}
                styleTitle={{ fontSize: scaleSzie(22), fontWeight: "bold" }}
            >
                <View style={{
                    height: scaleSzie(175), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(16),

                }} >
                    <View style={{ flex: 1 }} >
                        <View style={{ height: scaleSzie(20) }} />
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                            Tip ($)
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
                                value={tip}
                                onChangeText={(tip) => this.setState({ tip })}
                            // onFocus={() => this.onFocusToScroll(90)}
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
    groupAppointment: state.appointment.groupAppointment
})

export default connectRedux(mapStateToProps, PopupChangeTip);

