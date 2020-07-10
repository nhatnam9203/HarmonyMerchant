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

import connectRedux from '@redux/ConnectRedux';
import { ButtonCustom, PopupParent } from '@components';

import { scaleSzie } from '@utils';

class PopupChangePriceAmountProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: 0.00,
            bookingProductId: "",
            appointmentIdChangeProduct: "",
            productIdLocal: "",
            quantity: 0
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

    setStateFromParent = async (product, appointmentId) => {
        await this.setState({
            name: product && product.data && product.data.name ? product.data.name : '',
            bookingProductId: product && product.data && product.data.bookingProductId ? product.data.bookingProductId : '',
            price: product && product.data && product.data.price ? product.data.price : 0.00,
            quantity: product && product.quanlitySet ? product.quanlitySet : 0,
            productIdLocal: product.data.productId ? product.data.productId : '',
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
        const { price, quantity, bookingProductId, productIdLocal } = this.state;
        const {  appointmentDetail } = this.props;
        if (_.isEmpty(appointmentDetail)) {
            this.props.changeProductBasketLocal(productIdLocal, price, quantity)
        } else {
            this.props.actions.appointment.updateProductInAppointment(appointmentDetail.appointmentId, {
                bookingProductId,
                price,
                quantity: quantity ? quantity : 0
            }, false)
        }
        this.props.onRequestClose();
    }

    onFocusToScroll = (number) => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(number), animated: true })
    }

    // --------------- Render -----------

    render() {
        const { title, visible, listStaffByMerchant, onRequestClose, confimYes } = this.props;
        const { name, tip, price, quantity } = this.state;
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
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(16), marginBottom: scaleSzie(5) }} >
                                Name
                            </Text>
                            {/* ------- Box Name -------- */}
                            <View style={{
                                height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSzie(10), marginBottom: scaleSzie(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                    value={name}
                                    // onChangeText={(price) => this.setState({ price })}
                                    // onFocus={() => this.onFocusToScroll(90)}
                                    editable={false}
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
                                Quantity
                        </Text>
                            {/* ------- Box Tip -------- */}
                            <View style={{
                                height: scaleSzie(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSzie(10)
                            }} >
                                <TextInputMask
                                    type="only-numbers"
                                    placeholder={0}
                                    placeholderTextColor="#6A6A6A"
                                    style={{ flex: 1, fontSize: scaleSzie(16), color: '#6A6A6A' }}
                                    value={quantity}
                                    onChangeText={(quantity) => this.setState({ quantity })}
                                    onFocus={() => this.onFocusToScroll(160)}
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
    appointmentDetail: state.appointment.appointmentDetail,
    groupAppointment: state.appointment.groupAppointment
})

export default connectRedux(mapStateToProps, PopupChangePriceAmountProduct);

