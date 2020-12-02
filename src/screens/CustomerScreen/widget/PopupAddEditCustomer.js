import React from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent, Dropdown, TextInputSuggestion } from '@components';
import {
    scaleSzie, localize, getIdStateByName, getNameStateById, ListCodeAreaPhone,
    getCodeAreaPhone, checkStateIsValid, checkIsTablet
} from '@utils';

class PopupAddEditCustomer extends React.Component {

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
                    state: '',
                    zip: ""
                },
                referrerPhone: '',
                favourite: '',
                isVip: "Normal"
            },
            customerId: 0,
            codeAreaPhone: '+1',
            codeReferrerPhone: '+1',
            dynamicMarginBottomState: 24

        };
        this.scrollCustomerRef = React.createRef();
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

    setStateFromParent = async customer => {
        await this.setState({
            customerInfo: {
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: getCodeAreaPhone(customer.phone).phone,
                email: customer.email,
                addressPost: {
                    street: customer?.addressPost?.street || "",
                    city: customer?.addressPost?.city || "",
                    state: customer.addressPost.state === 0 ? '' : getNameStateById(this.props.stateCity, customer.addressPost.state),
                    zip: customer?.addressPost?.zip || "",
                },
                referrerPhone: getCodeAreaPhone(customer.referrerPhone).phone,
                favourite: customer.favourite,
                isVip: customer.isVip === 0 ? "Normal" : "VIP"
            },
            customerId: customer.customerId,
            codeAreaPhone: getCodeAreaPhone(customer.phone).areaCode,
            codeReferrerPhone: getCodeAreaPhone(customer.referrerPhone).areaCode,
        })
    }

    setStateDefaultFromParent = async () => {
        await this.setState({
            customerInfo: {
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                addressPost: {
                    street: '',
                    city: '',
                    state: '',
                    zip: ""
                },
                referrerPhone: '',
                favourite: '',
                isVip: "Normal"
            }
        })
    }

    doneAddProduct = () => {
        const { stateCity } = this.props;
        const { customerInfo } = this.state;
        const arrayKey = Object.keys(customerInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length - 1; i++) {
            if (customerInfo[arrayKey[i]] == "" && (arrayKey[i] === 'firstName' || arrayKey[i] === 'lastName' || arrayKey[i] === 'phone')) {
                keyError = arrayKey[i];
                break;
            }

            if (customerInfo.addressPost.state !== "" && !checkStateIsValid(stateCity, customerInfo.addressPost.state)) {
                keyError = "StateInvalid";
                break
            }
        }


        if (keyError != '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            const { addressPost } = customerInfo;
            const temptAddress = {
                ...addressPost,
                state: addressPost.state ? getIdStateByName(this.props.stateCity, addressPost.state) : 0
            };
            const temptCustomerInfo = {
                ...customerInfo,
                phone: customerInfo.phone ? `${this.state.codeAreaPhone}${customerInfo.phone}` : '',
                referrerPhone: customerInfo.referrerPhone ? `${this.state.codeReferrerPhone}${customerInfo.referrerPhone}` : '',
                addressPost: temptAddress,
                isVip: customerInfo.isVip === "Normal" ? 0 : 1
            };
            if (this.props.isSave) {
                this.props.editCustomer(this.state.customerId, temptCustomerInfo);
            } else {
                this.props.addCustomer(temptCustomerInfo);
            }

        }
    }

    scrollCustomerTo(position) {
        this.scrollCustomerRef.current.scrollTo({ x: 0, y: scaleSzie(position), animated: true })
    }

    onChangeText = (value, count = 0) => {
        this.updateCustomerInfo('state', value, 'addressPost');
        this.setState({
            dynamicMarginBottomState: count * 24
        });
    }

    // ----------- render ----------


    render() {
        const { title, visible, onRequestClose, isSave, language } = this.props;
        const temptTitleButton = isSave ? 'Save' : 'Add';

        const { dynamicMarginBottomState } = this.state;
        const { firstName, lastName, phone, email, referrerPhone, favourite, addressPost, isVip } = this.state.customerInfo;
        const { street, city, state, zip } = addressPost;
        const tempHeight = checkIsTablet() ? scaleSzie(390) : scaleSzie(480);

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
            >
                <View style={{
                    height: tempHeight,
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            ref={this.scrollCustomerRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <TouchableOpacity activeOpacity={1}>
                                {/* ----- */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10), marginBottom: scaleSzie(10) }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6) }} >
                                            {`${localize('First Name', language)}*`}
                                        </Text>
                                        <View style={{ height: scaleSzie(30) }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInput
                                                    placeholder="Jerry"
                                                    style={{ flex: 1, fontSize: scaleSzie(16), padding: 0, }}
                                                    value={firstName}
                                                    onChangeText={value => this.updateCustomerInfo('firstName', value)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ width: scaleSzie(10) }} />
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6) }} >
                                            {`${localize('Last Name', language)}*`}
                                        </Text>
                                        <View style={{ height: scaleSzie(30), }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInput
                                                    placeholder="Nguyen"
                                                    style={{ flex: 1, fontSize: scaleSzie(16), padding: 0 }}
                                                    value={lastName}
                                                    onChangeText={value => this.updateCustomerInfo('lastName', value)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* ---- */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6), marginTop: scaleSzie(7) }} >
                                    {`${localize('Phone Number', language)}*`}
                                </Text>
                                <View style={{ height: scaleSzie(30), flexDirection: 'row', marginBottom: scaleSzie(10) }} >
                                    <View style={{ width: scaleSzie(70) }} >
                                        <Dropdown
                                            label={'+1'}
                                            data={ListCodeAreaPhone}
                                            value={this.state.codeAreaPhone}
                                            onChangeText={(codeAreaPhone) => this.setState({ codeAreaPhone })}
                                            containerStyle={{
                                                backgroundColor: '#fff',
                                                borderWidth: 1,
                                                borderColor: '#C5C5C5',
                                                flex: 1
                                            }}
                                        />
                                    </View>
                                    <View style={{ width: scaleSzie(8) }} />
                                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(10) }} >
                                        <TextInputMask
                                            type={'custom'}
                                            options={{
                                                mask: '999-999-9999'
                                            }}
                                            placeholder="012-345-6456"
                                            style={{ flex: 1, fontSize: scaleSzie(16), padding: 0 }}
                                            value={phone}
                                            onChangeText={value => this.updateCustomerInfo('phone', value)}
                                            onFocus={() => this.scrollCustomerTo(60)}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                </View>
                                {/* ---- */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6), marginTop: scaleSzie(7) }} >
                                    {localize('Contact Email', language)}
                                </Text>
                                <View style={{
                                    height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: scaleSzie(10)
                                }} >
                                    <TextInput
                                        placeholder="example@gmail.com"
                                        style={{ flex: 1, fontSize: scaleSzie(16), padding: 0 }}
                                        value={email}
                                        onChangeText={value => this.updateCustomerInfo('email', value)}
                                        onFocus={() => this.scrollCustomerTo(120)}
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
                                        style={{ flex: 1, fontSize: scaleSzie(16), padding: 0 }}
                                        value={street}
                                        onChangeText={value => this.updateCustomerInfo('street', value, 'addressPost')}
                                        onFocus={() => this.scrollCustomerTo(180)}
                                    />
                                </View>
                                {/* ----- */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                    <View style={{ flex: 1 }} >
                                        <View style={{ height: scaleSzie(30), }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInput
                                                    placeholder={localize('City', language)}
                                                    style={{ flex: 1, fontSize: scaleSzie(16), padding: 0 }}
                                                    value={city}
                                                    onChangeText={value => this.updateCustomerInfo('city', value, 'addressPost')}
                                                    onFocus={() => this.scrollCustomerTo(180)}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ width: scaleSzie(10) }} />
                                    {/* -------  */}
                                    <View style={{ flex: 1 }} >
                                        <View style={{ height: scaleSzie(30), }} >
                                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(5) }} >
                                                <TextInput
                                                    placeholder={localize('Zip Code', language)}
                                                    style={{ flex: 1, fontSize: scaleSzie(16), padding: 0 }}
                                                    value={zip}
                                                    onChangeText={value => this.updateCustomerInfo('zip', value, 'addressPost')}
                                                    onFocus={() => this.scrollCustomerTo(220)}
                                                    maxLength={5}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* ----------------- Zip Code --------------- */}
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10), }} >
                                    <View style={{ flex: 1 }} >
                                        <View style={{ height: scaleSzie(30), marginBottom: scaleSzie(dynamicMarginBottomState) }} >
                                            <View style={{ flex: 1 }} >
                                                <TextInputSuggestion
                                                    value={state}
                                                    onChangeText={this.onChangeText}
                                                    onFocus={() => this.scrollCustomerTo(180)}
                                                    resetMarginState={() => this.setState({ dynamicMarginBottomState: 24 })}
                                                    onFocus={() => this.scrollCustomerTo(280)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ width: scaleSzie(10) }} />
                                    <View style={{ flex: 1 }} />
                                </View>


                                {/* ---- Referrer Phone Number */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(6), marginTop: scaleSzie(7) }} >
                                    {localize('Referral Phone', language)}
                                </Text>
                                <View style={{ height: scaleSzie(30), flexDirection: 'row' }} >
                                    <View style={{ width: scaleSzie(70) }} >
                                        <Dropdown
                                            label={'+1'}
                                            data={ListCodeAreaPhone}
                                            value={this.state.codeReferrerPhone}
                                            onChangeText={(codeReferrerPhone) => this.setState({ codeReferrerPhone })}
                                            containerStyle={{
                                                backgroundColor: '#fff',
                                                borderWidth: 1,
                                                borderColor: '#C5C5C5',
                                                flex: 1
                                            }}
                                        />
                                    </View>
                                    <View style={{ width: scaleSzie(8) }} />
                                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(10) }} >
                                        <TextInputMask
                                            type={'custom'}
                                            options={{
                                                mask: '999-999-9999'
                                            }}
                                            placeholder="0123 456 456"
                                            style={{ flex: 1, fontSize: scaleSzie(16), padding: 0 }}
                                            value={referrerPhone}
                                            onChangeText={value => this.updateCustomerInfo('referrerPhone', value)}
                                            onFocus={() => this.scrollCustomerTo(275)}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                </View>
                                {/* ----- Attribute Level ------- */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(2), marginTop: scaleSzie(15) }} >
                                    {localize('Attribute Level', language)}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: scaleSzie(5), marginBottom: scaleSzie(10) }} >
                                    <View style={{ flex: 1, paddingRight: scaleSzie(10) }} >
                                        <View style={{ height: scaleSzie(30), }} >
                                            <View style={{ flex: 1 }} >
                                                <Dropdown
                                                    label={""}
                                                    data={[{ value: "Normal" }, { value: "VIP" }]}
                                                    value={isVip}
                                                    onChangeText={(value) => this.updateCustomerInfo('isVip', value)}
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
                                    <View style={{ flex: 1 }} />
                                </View>

                                {/* ---- */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                    {localize('Note', language)}
                                </Text>
                                <View style={{
                                    height: scaleSzie(110),
                                    backgroundColor: '#F1F1F1',
                                    paddingHorizontal: scaleSzie(10),
                                    paddingBottom: scaleSzie(8),
                                    paddingTop: scaleSzie(8)
                                }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(8) }} >
                                        {localize("Note about customer's favourite", language)}
                                    </Text>
                                    <View style={{ flex: 1, justifyContent: 'flex-end' }} >
                                        <View style={{
                                            flex: 1, backgroundColor: '#fff',
                                            borderWidth: 1, borderColor: '#C5C5C5', borderTopLeftRadius: 4, borderBottomLeftRadius: 4,
                                            paddingHorizontal: scaleSzie(10), paddingVertical: 4
                                        }} >
                                            <TextInput
                                                style={{
                                                    flex: 1, fontSize: scaleSzie(12),
                                                    padding: 0,
                                                    textAlignVertical: "top"
                                                }}
                                                value={favourite}
                                                onChangeText={value => this.updateCustomerInfo('favourite', value)}
                                                onFocus={() => this.scrollCustomerTo(500)}
                                                multiline={true}
                                            />
                                        </View>
                                    </View>
                                </View>
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
    firstName: 'Missing Info: First Name',
    lastName: 'Missing Info: Last Name',
    phone: 'Missing Info: Phone',
    StateInvalid: "State Invalid"
}

export default PopupAddEditCustomer;


