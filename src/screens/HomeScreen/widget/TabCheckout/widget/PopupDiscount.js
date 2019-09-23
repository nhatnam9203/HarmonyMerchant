import React from 'react';
import {
    View,
    Image,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSzie } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            percent: '',
            discount: ''
        };
        this.customDiscountRef = React.createRef();
        this.customFixedAmountRef = React.createRef();
    }


    submitCustomPromotion = () => {
        const { appointmentDetail } = this.props;
        const customDiscountPercent = this.customDiscountRef.current.state.percent;
        const customFixedAmount = this.customFixedAmountRef.current.state.discount;
        this.props.actions.marketing.customPromotion(customDiscountPercent, customFixedAmount, appointmentDetail.appointmentId);
        this.props.actions.marketing.closeModalDiscount();
    }

    // ------ Render -----

    render() {
        const { title, visible, onRequestClose, discount, visibleModalDiscount,
            appointmentDetail
        } = this.props;
        let total = 0;
        for (let i = 0; i < discount.length; i++) {
            total = total + discount[i].discount;
        }
        return (
            <PopupParent
                title={title}
                visible={visibleModalDiscount}
                onRequestClose={() => this.props.actions.marketing.closeModalDiscount()}
                width={600}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(380), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                }} >
                    <View style={{ height: scaleSzie(260) }} >
                        <ScrollView >
                            <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: scaleSzie(25) }} >
                                {
                                    discount.map((promo, index) => <ItemCampaign
                                        key={index}
                                        title={promo.merchantPromotion.campaignName}
                                        discount={promo.discount}
                                    />
                                    )
                                }
                                {/* ----------- Row 1 ----------- */}
                                <CustomDiscount
                                    ref={this.customDiscountRef}
                                    customDiscountPercent={appointmentDetail.customDiscountPercent}
                                />
                                {/* ----------- Row 2 ----------- */}
                                <CustomDiscountFixed 
                                    ref={this.customFixedAmountRef}
                                    customDiscountFixed={appointmentDetail.customDiscountFixed}
                                />
                                <View style={{ height: scaleSzie(100) }} />
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                    {/* ---------- Total ------- */}
                    <View style={{
                        flexDirection: 'row', height: scaleSzie(60),
                        paddingHorizontal: scaleSzie(25)
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center' }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(30), fontWeight: 'bold' }} >
                                Total Discount
                            </Text>
                        </View>
                        <View style={{ justifyContent: 'center' }} >
                            <Text style={{ color: '#4CD964', fontSize: scaleSzie(30), fontWeight: 'bold' }} >
                                {`- ${total}$`}
                            </Text>
                        </View>
                    </View>

                    {/* ----------- Button Add ---- */}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSzie(12) }} >
                        <ButtonCustom
                            width={scaleSzie(125)}
                            height={45}
                            backgroundColor="#0764B0"
                            title="Done"
                            textColor="#fff"
                            onPress={this.submitCustomPromotion}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

}

const ItemCampaign = ({ title, discount }) => {

    return (
        <View style={{
            flexDirection: 'row', height: scaleSzie(55),
            borderBottomColor: '#707070', borderBottomWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                    {title}
                </Text>
            </View>
            <View style={{ justifyContent: 'center' }} >
                <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                    {`-${discount}$`}
                </Text>
            </View>
        </View>
    );
}

class CustomDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            percent: this.props.customDiscountPercent
        }
    }

    render() {
        return (
            <View style={{
                flexDirection: 'row', height: scaleSzie(55),
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                        Custom Discount by
                    </Text>
                    {/* ------- Text percent ----- */}
                    <View style={{
                        width: scaleSzie(120), height: scaleSzie(40),
                        borderColor: '#707070', borderWidth: 1, marginLeft: scaleSzie(20), borderRadius: scaleSzie(4),
                        flexDirection: 'row', marginLeft: scaleSzie(20)
                    }} >
                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                            <TextInputMask
                                type="only-numbers"
                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                value={this.state.percent}
                                onChangeText={percent => this.setState({ percent })}
                                keyboardType="numeric"
                                placeholderTextColor="#A9A9A9"
                                maxLength={3}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', paddingRight: scaleSzie(5) }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                %
                            </Text>
                        </View>
                    </View>
                    {/* -------  ----- */}
                </View>
                <View style={{ justifyContent: 'center' }} >
                    <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                        0$
                     </Text>
                </View>
            </View>
        );
    }

}

class CustomDiscountFixed extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            discount : this.props.customDiscountFixed
        }
    }

    render(){
        return(
            <View style={{
                flexDirection: 'row', height: scaleSzie(55), borderBottomColor: '#707070', borderBottomWidth: 1
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                        Custom Discount by fixed amount
                </Text>
                </View>
                <View style={{ justifyContent: 'center' }} >
                    {/* ------- Text discount ----- */}
                    <View style={{
                        width: scaleSzie(120), height: scaleSzie(40),
                        borderColor: '#707070', borderWidth: 1, marginLeft: scaleSzie(20), borderRadius: scaleSzie(4),
                        flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                            <TextInputMask
                                type="only-numbers"
                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                value={this.state.discount}
                                onChangeText={discount => this.setState({ discount })}
                                keyboardType="numeric"
                                placeholderTextColor="#A9A9A9"
                                maxLength={3}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', paddingRight: scaleSzie(5) }} >
                            <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                                $
                            </Text>
                        </View>
                    </View>
                    {/* -------  ----- */}
                </View>
            </View>
        );
    }

}

const mapStateToProps = state => ({
    discount: state.marketing.discount,
    visibleModalDiscount: state.marketing.visibleModalDiscount,
    appointmentDetail: state.appointment.appointmentDetail
})



export default connectRedux(mapStateToProps, PopupDiscount);

