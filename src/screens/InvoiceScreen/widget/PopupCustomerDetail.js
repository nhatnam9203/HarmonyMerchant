import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie, localize, getNameStateById } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

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
                favourite: ''
            }
        }
    }

    setStateFromParent = customer => {
        this.setState({
            customerInfo: customer
        })
    }

    render() {
        const { title, visible, onRequestClose, language
        } = this.props;
        const temptHeight = width - scaleSzie(500);
        const {firstName,lastName,phone,email,referrerPhone,favourite,addressPost} = this.state.customerInfo;
        const {street,city,state} = addressPost;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(temptHeight),
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity activeOpacity={1}>
                                {/* -------------------- */}
                                <View style={{ marginTop: scaleSzie(14), flexDirection: 'row' }} >
                                    <View style={{ flex: 1 }} >
                                        <ItemDetail
                                            title={`${localize('First Name', language)} *`}
                                            value={firstName}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} >
                                        <ItemDetail
                                            title={`${localize('Last Name', language)} *`}
                                            value={lastName}
                                        />
                                    </View>
                                </View>
                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSzie(12) }}
                                    title={`${localize('Phone Number', language)} *`}
                                    value={phone}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSzie(12) }}
                                    title={`${localize('Contact email', language)}:`}
                                    value={email}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSzie(12) }}
                                    title={`${localize('Address', language)}`}
                                    value={`${street} ${city}`}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSzie(12) }}
                                    title={`${localize('Referrer Phone Number', language)}`}
                                    value={referrerPhone}
                                />

                                {/* -------------------- */}
                                <ItemDetail
                                    style={{ marginTop: scaleSzie(12) }}
                                    title={`${localize('Note', language)}`}
                                    value={favourite}
                                />

                                {/* -----  */}
                                <View style={{ height: scaleSzie(250) }} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={'Edit'}
                            textColor="#fff"
                            onPress={() => this.props.showModalEditCustomer(this.state.customerInfo)}
                            style={{ borderRadius: scaleSzie(2) }}
                            styleText={{
                                fontSize: scaleSzie(14)
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
            <Text style={{ color: '#404040', fontSize: scaleSzie(16), marginBottom: scaleSzie(10) }} >
                {title}
            </Text>
            <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                {value}
            </Text>
        </View>
    );
}


export default PopupCustomerDetail;


