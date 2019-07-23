import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    Dimensions,
    ScrollView,
    Image
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class PopupAddEditCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customerInfo: {
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                address: {
                    street: '',
                    city: '',
                    state: ''
                },
                referrerPhone: '',
                favourite: ''
            }
        }
    }

    updateCustomerInfo(key, value, keyParent = '') {
        const { customerInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = customerInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...customerInfo, [keyParent]: temptChild };
            this.setState({
                customerInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...customerInfo, [key]: value };
            this.setState({
                customerInfo: temptUpdate
            })
        }
    }

    setProductInfoFromParent = (productInfo) => {
        const { categoriesByMerchant } = this.props;
        this.setState({
            productInfo: {
                productId: productInfo.productId,
                categoryId: getCategoryName(categoriesByMerchant, productInfo.categoryId),
                name: productInfo.name,
                description: productInfo.description,
                sku: productInfo.sku ? productInfo.sku : '',
                quantity: productInfo.quantity ? productInfo.quantity : '',
                minThreshold: productInfo.minThreshold ? productInfo.minThreshold : '',
                maxThreshold: productInfo.maxThreshold ? productInfo.maxThreshold : '',
                price: productInfo.price ? productInfo.price : '',
                status: productInfo.isDisabled === 0 ? 'Active' : 'Disable'
            }
        })
    }

    setDefaultStateFromParent = () => {
        this.setState({
            customerInfo: {
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                address: {
                    street: '',
                    city: '',
                    state: ''
                },
                referrerPhone: '',
                favourite: ''
            }
        })
    }

    doneAddProduct = () => {
        const { customerInfo } = this.state;
        const temptCustomerInfo = {
            ...customerInfo,
        }
        const arrayKey = Object.keys(temptCustomerInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length - 1; i++) {
            if (temptCustomerInfo[arrayKey[i]] == "" && (arrayKey[i] === 'firstName' || arrayKey[i] === 'lastName' || arrayKey[i] === 'phone')) {
                keyError = arrayKey[i];
                break;
            }
        }
        if (keyError != '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            if (this.props.isSave) {
                // this.props.editProduct(temptCustomerInfo);
            } else {
                this.props.addCustomer(temptCustomerInfo);
                // console.log('temptCustomerInfo : ',temptCustomerInfo);
            }

        }
    }


    render() {
        const { title, visible, onRequestClose, isSave, language
        } = this.props;
        const temptHeight = width - scaleSzie(500);
        const temptTitleButton = isSave ? 'Save' : 'Add';

        const { firstName, lastName, phone, email, referrerPhone, favourite, address } = this.state.customerInfo;
        const { street, city, state } = address;
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
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {/* ----- */}
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6) }} >
                                        {`${localize('First Name', language)} *`}
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInput
                                                placeholder="Jerry"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={firstName}
                                                onChangeText={value => this.updateCustomerInfo('firstName', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6) }} >
                                        {`${localize('Last Name', language)} *`}
                                    </Text>
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(20) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInput
                                                placeholder="Nguyen"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={lastName}
                                                onChangeText={value => this.updateCustomerInfo('lastName', value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* ---- */}
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6), marginTop: scaleSzie(7) }} >
                                {localize('Phone Number *', language)}
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                paddingLeft: scaleSzie(10),
                            }} >
                                <TextInputMask
                                    type="only-numbers"
                                    placeholder="0123 456 456"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={phone}
                                    onChangeText={value => this.updateCustomerInfo('phone', value)}
                                />
                            </View>
                            {/* ---- */}
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6), marginTop: scaleSzie(7) }} >
                                {localize('Contact email', language)}
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                paddingLeft: scaleSzie(10),
                            }} >
                                <TextInput
                                    placeholder="example@gmail.com"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={email}
                                    onChangeText={value => this.updateCustomerInfo('email', value)}
                                />
                            </View>
                            {/* ------- */}
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6), marginTop: scaleSzie(7) }} >
                                {localize('Address', language)}
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                paddingLeft: scaleSzie(10),
                            }} >
                                <TextInput
                                    placeholder="Street"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={street}
                                    onChangeText={value => this.updateCustomerInfo('street', value, 'address')}
                                />
                            </View>
                            {/* ----- */}
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                <View style={{ flex: 1 }} >
                                    <View style={{ height: scaleSzie(30), paddingRight: scaleSzie(10) }} >
                                        <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                            <TextInput
                                                placeholder="City"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                value={city}
                                                onChangeText={value => this.updateCustomerInfo('city', value, 'address')}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }} >
                                    <View style={{ height: scaleSzie(30), }} >
                                        <View style={{ flex: 1 }} >
                                            <Dropdown
                                                label='State'
                                                // data={this.filterCategories(categoriesByMerchant)}
                                                data={[{ value: 1 }, { value: 2 }]}
                                                value={state}
                                                onChangeText={(value) => this.updateCustomerInfo('state', value, 'address')}
                                                containerStyle={{
                                                    backgroundColor: '#F1F1F1',
                                                    borderWidth: 1,
                                                    borderColor: '#C5C5C5',
                                                    flex: 1
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* ---- */}
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6), marginTop: scaleSzie(7) }} >
                                {localize('Referrer Phone Number', language)}
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                paddingLeft: scaleSzie(10),
                            }} >
                                <TextInputMask
                                    type="only-numbers"
                                    placeholder="0123 456 456"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    value={referrerPhone}
                                    onChangeText={value => this.updateCustomerInfo('referrerPhone', value)}

                                />
                            </View>
                            {/* ------- */}
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                {localize('Note', language)}
                            </Text>
                            <View style={{
                                height: scaleSzie(110),
                                backgroundColor: '#F1F1F1',
                                paddingHorizontal: scaleSzie(15),
                                paddingBottom: scaleSzie(10),
                                paddingTop: scaleSzie(12)
                            }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                                    Note about customer's favourite
                                </Text>
                                <View style={{ flex: 1, justifyContent: 'flex-end' }} >
                                    <View style={{ height: scaleSzie(40), flexDirection: 'row' }} >
                                        <View style={{
                                            flex: 1, backgroundColor: '#fff',
                                            borderWidth: 1, borderColor: '#C5C5C5', borderTopLeftRadius: 4, borderBottomLeftRadius: 4
                                        }} >

                                        </View>
                                        <View style={{
                                            width: scaleSzie(40), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center',
                                            borderTopRightRadius: 4, borderBottomRightRadius: 4
                                        }} >
                                            <Image
                                                source={IMAGE.arrowNote}
                                                style={{ width: scaleSzie(20), height: scaleSzie(23) }}
                                            />
                                        </View>

                                    </View>
                                </View>

                            </View>
                            {/* -----  */}
                            <View style={{ height: scaleSzie(250) }} />
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={temptTitleButton}
                            textColor="#fff"
                            onPress={this.doneAddProduct}
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


const strings = {
    firstName: 'Mising info : First Name',
    lastName: 'Mising info : Last Name',
    phone: 'Mising info : Phone',
}

export default PopupAddEditCustomer;


