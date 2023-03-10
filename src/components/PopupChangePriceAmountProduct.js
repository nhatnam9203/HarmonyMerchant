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
import connectRedux from '@redux/ConnectRedux';

import { scaleSize } from '../utils';

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
            this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
        }

    }

    setStateFromParent = async (product, appointmentId) => {
        await this.setState({
            name: product && product.data && product.data.name ? product.data.name : '',
            bookingProductId: product && product.data && product.data.bookingProductId ? product.data.bookingProductId : '',
            price: product && product.data && product.data.price ? product.data.price : 0.00,
            appointmentIdChangeProduct: appointmentId,
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
        const { price, name, quantity, appointmentIdChangeProduct, bookingProductId, productIdLocal } = this.state;
        const { groupAppointment } = this.props;
        if (_.isEmpty(groupAppointment)) {
            this.props.changeProductBasketLocal(productIdLocal, price, quantity ? quantity : 0)
        } else {
            this.props.actions.appointment.updateProductInAppointment(appointmentIdChangeProduct, {
                bookingProductId,
                price,
                quantity: quantity ? quantity : 0
            })
        }
        this.props.onRequestClose();
    }

    onFocusToScroll = (number) => {
        this.scrollRef.current?.scrollTo({ x: 0, y: scaleSize(number), animated: true })
    }

    splitZeroNumber = (str) => {
        let isChecZeroNumber = true;
        let arr = [];
        for (let i = 0; i < str.length; i++) {
            if (!isChecZeroNumber) {
                arr.push(str[i]);
            } else {
                if (str[i] != 0) {
                    isChecZeroNumber = false;
                }
            }
        }
        return arr.join("");
    }

    updateQuantity = async (quantity) => {
       await this.setState({
            quantity: quantity
        })
    }

    // --------------- Render -----------

    render() {
        const { title, visible, onRequestClose, confimYes } = this.props;
        const { name, price, quantity } = this.state;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={scaleSize(260)}
                // style={{ justifyContent: 'flex-start', paddingTop: scaleSize(50) }}
                styleTitle={{ fontSize: scaleSize(22), fontWeight: "bold" }}
            >
                <View style={{
                    height: scaleSize(320), backgroundColor: '#FAFAFA',
                    borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15),
                    paddingHorizontal: scaleSize(16),

                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            ref={this.scrollRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <View style={{ height: scaleSize(20) }} />
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSize(16), marginBottom: scaleSize(5) }} >
                                Name
                            </Text>
                            {/* ------- Box Name -------- */}
                            <View style={{
                                height: scaleSize(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSize(10), marginBottom: scaleSize(10)
                            }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSize(16), color: '#6A6A6A' }}
                                    value={name}
                                    // onChangeText={(price) => this.setState({ price })}
                                    // onFocus={() => this.onFocusToScroll(90)}
                                    editable={false}
                                />
                            </View>
                            {/* ------- Price -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSize(16), marginBottom: scaleSize(5) }} >
                                Price ($)
                        </Text>
                            {/* ------- Box Price -------- */}
                            <View style={{
                                height: scaleSize(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSize(10), marginBottom: scaleSize(10)
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
                                    style={{ flex: 1, fontSize: scaleSize(16), color: '#6A6A6A' }}
                                    value={price}
                                    onChangeText={(price) => this.setState({ price })}
                                    onFocus={() => this.onFocusToScroll(90)}
                                />
                            </View>
                            {/* ------- Tip -------- */}
                            <Text style={{ color: '#6A6A6A', fontSize: scaleSize(16), marginBottom: scaleSize(5) }} >
                                Quantity
                        </Text>
                            {/* ------- Box Tip -------- */}
                            <View style={{
                                height: scaleSize(40), backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5C5C5',
                                paddingHorizontal: scaleSize(10)
                            }} >
                                <TextInputMask
                                    type="only-numbers"
                                    placeholder={`0`}
                                    placeholderTextColor="#6A6A6A"
                                    style={{ flex: 1, fontSize: scaleSize(16), color: '#6A6A6A' }}
                                    value={quantity}
                                    onChangeText={this.updateQuantity}
                                    onFocus={() => this.onFocusToScroll(160)}
                                />
                            </View>
                            {/* ------- Button -------- */}
                            <View style={{ marginTop: scaleSize(20), alignItems: 'center', }} >
                                <ButtonCustom
                                    width={scaleSize(120)}
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
                            <View style={{ height: scaleSize(200) }} />
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
    groupAppointment: state.appointment.groupAppointment
})

export default connectRedux(mapStateToProps, PopupChangePriceAmountProduct);

