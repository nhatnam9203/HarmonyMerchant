import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSize, localize,checkIsTablet } from '@utils';

class PopupCustomerDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customerInfo: {
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                addressPost: {
                    street: '',
                    city: '',
                    state: 0
                },
                referrerPhone: '',
                favourite: '',
                isVip : 0
            }
        }
    }

    setStateFromParent = async customer => {
       await this.setState({
            customerInfo: customer
        })
    }

    render() {
        const { title, visible, onRequestClose, language} = this.props;
        const {firstName,lastName,phone,email,referrerPhone,favourite,addressPost,isVip} = this.state.customerInfo;
        const {street,city} = addressPost;
        const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(480);

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
            >
                <View style={{
                     height:  tempHeight,
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15),
                    borderBottomRightRadius: scaleSize(15),
                    paddingHorizontal: scaleSize(30)
                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <TouchableOpacity activeOpacity={1}>
                                {/* -------------------- */}
                                <View style={{ marginTop: scaleSize(14), flexDirection: 'row' }} >
                                    <View style={{ flex: 1 }} >
                                        <ItemDetail
                                            title={`${localize('First Name', language)}*`}
                                            value={firstName ? firstName : ""}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <ItemDetail
                                            title={`${localize('Last Name', language)}*`}
                                            value={lastName ? lastName : ""}
                                        />
                                    </View>
                                </View>
                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSize(12) }}
                                    title={`${localize('Phone Number', language)}*`}
                                    value={phone ? phone : ""}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSize(12) }}
                                    title={`${localize('Contact Email', language)}:`}
                                    value={email ? email : ""}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSize(12) }}
                                    title={`${localize('Address', language)}`}
                                    value={`${street} ${city}`}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSize(12) }}
                                    title={`${localize('Referral Phone', language)}`}
                                    value={referrerPhone ? referrerPhone : ""}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSize(12) }}
                                    title={`${localize('Attribute Level', language)}:`}
                                    value={isVip === 0  ? "Normal" : "VIP"  }
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSize(12) }}
                                    title={`${localize('Note', language)}`}
                                    value={favourite ? favourite : ""}
                                />


                                {/* -----  */}
                                <View style={{ height: scaleSize(250) }} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSize(50), alignItems: 'center' }} >
                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={`${localize('Edit', language)}`}
                            textColor="#fff"
                            onPress={() => this.props.showModalEditCustomer(this.state.customerInfo)}
                            style={{ borderRadius: scaleSize(2) }}
                            styleText={{
                                fontSize: scaleSize(14)
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

}

const ItemDetail = ({ title, value, style }) => {
    return (
        <View style={style} >
            <Text style={{ color: '#404040', fontSize: scaleSize(16), marginBottom: scaleSize(10) }} >
                {title}
            </Text>
            <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >
                {value}
            </Text>
        </View>
    );
}


export default PopupCustomerDetail;


