import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
    TextInput,
    Dimensions,
    Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import moment from "moment";

import { Button, Text, Dropdown, ButtonCustom, TextInputSuggestion } from '@components';
import { scaleSzie, ListCodeAreaPhone, formatWithMoment, getNameStateById, getCodeAreaPhone,
    checkStateIsValid,getIdStateByName,isValidDate,stringToDate
} from '@utils';
import Configs from "@configs";
import ICON from "@resources";
import PopupChangeCustomerStatus from "./PopupChangeCustomerStatus";
import connectRedux from '@redux/ConnectRedux';

const { width } = Dimensions.get("window");

class EditOrCreateCustomerTab extends React.Component {

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
                isVip: 0,
                gender: "Female",
                birthdate: ""
            },
            customerId: 0,
            codeAreaPhone: '+1',
            codeReferrerPhone: '+1',
            dynamicMarginBottomState: 24,
            visibleChangeStatus: false
        };
        this.scrollLeftCustomerRef = React.createRef();
        this.scrollRightCustomerRef = React.createRef();
    }

    setStateFromParent = (customer) => {
        // console.log("customerInfo : ",JSON.stringify(customer));
        const { stateCity } = this.props;
        this.setState({
            customerInfo: {
                ...customer,
                gender: customer?.gender && customer?.gender != "undefined" ? customer?.gender : "",
                birthdate: formatWithMoment(customer?.birthdate, "MM/DD/YYYY"),
                addressPost: {
                    street: customer?.addressPost?.street || "",
                    city: customer?.addressPost?.city || "",
                    state: customer.addressPost.state === 0 ? '' : getNameStateById(stateCity, customer.addressPost.state),
                    zip: customer?.addressPost?.zip || "",
                },
                phone: getCodeAreaPhone(customer?.phone)?.phone,
                referrerPhone: getCodeAreaPhone(customer?.referrerPhone)?.phone,
            },
            customerId: customer.customerId,
            codeAreaPhone: getCodeAreaPhone(customer.phone).areaCode,
            codeReferrerPhone: getCodeAreaPhone(customer.referrerPhone).areaCode,
        })
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

    onChangeState = (value, count = 0) => {
        this.updateCustomerInfo('state', value, 'addressPost');
        this.setState({
            dynamicMarginBottomState: count * 24
        });
    }

    scrollLeftContentTo = (position) => {
        this.scrollLeftCustomerRef.current.scrollTo({ x: 0, y: scaleSzie(position), animated: true });
    }

    scrollRightContentTo = (position) => {
        this.scrollRightCustomerRef.current.scrollTo({ x: 0, y: scaleSzie(position), animated: true });
    }

    changeCustomerStatus = () => {
        this.setState({
            visibleChangeStatus: true
        })
    }

    closePopupChangeStatus = () => {
        this.setState({
            visibleChangeStatus: false
        })
    }

    saveCustomerInfo = () => {
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

            if (customerInfo.birthdate !== "" && !isValidDate(customerInfo.birthdate)) {
                keyError = "birthdate";
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
                birthdate: customerInfo?.birthdate ? stringToDate(customerInfo?.birthdate) : null
            };


            this.props.submitEditCustomer(temptCustomerInfo);
            this.scrollLeftCustomerRef.current.scrollTo({ x: 0, y: 0, animated: false });
            this.scrollRightCustomerRef.current.scrollTo({ x: 0, y: 0, animated: false });


            // if (this.props.isSave) {
            //     this.props.editCustomer(this.state.customerId, temptCustomerInfo);
            // } else {
            //     this.props.addCustomer(temptCustomerInfo);
            // }

        }

    }


    render() {
        const { codeAreaPhone, codeReferrerPhone, dynamicMarginBottomState, visibleChangeStatus } = this.state;
        const { firstName, lastName, phone, email, referrerPhone, favourite, addressPost, isVip, gender, birthdate } = this.state.customerInfo;
        const { street, city, state, zip } = addressPost;

        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                {/* ------------- Header ------------ */}
                <View style={{
                    height: scaleSzie(45), flexDirection: "row",
                    alignItems: "center", justifyContent: "space-between", marginTop: scaleSzie(10)
                }} >
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(20), fontWeight: "600" }} >
                        {`New customer`}
                    </Text>
                    <Button onPress={this.changeCustomerStatus} style={{
                        width: scaleSzie(85), height: scaleSzie(28), backgroundColor: "#0764B0", borderRadius: scaleSzie(20),
                        justifyContent: "center", alignItems: "center", flexDirection: "row"
                    }} >
                        <Text style={{ color: "#fff", fontSize: scaleSzie(13), marginLeft: scaleSzie(6) }} >
                            {`Normal`}
                        </Text>
                        <Image source={ICON.white_drpdown_status_customer} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                    </Button>
                </View>

                {/* ------------- Line ------------ */}
                <View style={{ height: 1, backgroundColor: "#EEEEEE" }} />

                <View style={{ flex: 1, flexDirection: "row" }} >
                    {/* ------------------ Left Content ------------------ */}
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            ref={this.scrollLeftCustomerRef}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ height: scaleSzie(18) }} />
                            {/* --------- Item -------- */}
                            <FromItem
                                title={`First Name`}
                                isRequired={true}
                                placeholder="First name"
                                value={firstName}
                                onChangeText={value => this.updateCustomerInfo('firstName', value)}
                            />

                            <FromItem
                                title={`Last Name`}
                                isRequired={true}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={value => this.updateCustomerInfo('lastName', value)}
                                onFocus={() => this.scrollLeftContentTo(90)}
                            />

                            <PhoneItem
                                title={`Phone Number`}
                                isRequired={true}
                                placeholder="Enter phone number"
                                codeArea={codeAreaPhone}
                                upddateCodeArea={(codeAreaPhone) => this.setState({ codeAreaPhone })}
                                value={phone}
                                onChangeText={value => this.updateCustomerInfo('phone', value)}
                                onFocus={() => this.scrollLeftContentTo(170)}
                            />

                            <FromItem
                                title={`Contact email`}
                                placeholder="Email address"
                                value={email}
                                onChangeText={value => this.updateCustomerInfo('email', value)}
                                onFocus={() => this.scrollLeftContentTo(240)}
                            />

                            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" }} >
                                {`Gender`}
                            </Text>
                            <View style={{ width: scaleSzie(150), height: scaleSzie(35), marginTop: scaleSzie(10) }} >
                                <Dropdown
                                    label={"Gender"}
                                    data={[
                                        { value: "Male" },
                                        { value: "Female" }
                                    ]}
                                    value={gender}
                                    onChangeText={value => this.updateCustomerInfo('gender', value)}
                                    containerStyle={{
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1
                                    }}
                                />
                            </View>

                            <View style={{ height: scaleSzie(400) }} />
                        </ScrollView>
                    </View>

                    {/* ----------------- Padding ------------ */}
                    <View style={{ width: scaleSzie(30) }} />

                    {/* ------------------ Right Content ------------------ */}
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            ref={this.scrollRightCustomerRef}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ height: scaleSzie(18) }} />
                            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" }} >
                                {`Birthday`}
                            </Text>

                            <View style={{ height: scaleSzie(35), marginTop: scaleSzie(10), marginBottom: scaleSzie(14) }} >
                                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), borderWidth: 1, borderColor: "#CCCCCC", flexDirection: "row", }} >
                                    <TextInputMask
                                        style={{
                                            flex: 1,
                                            fontSize: scaleSzie(14),
                                            color: "#404040",

                                        }}
                                        type={'custom'}
                                        options={{
                                            mask: '99/99/9999'
                                        }}
                                        placeholder="MM/DD/YYYY"
                                        value={birthdate}
                                        onChangeText={value => this.updateCustomerInfo('birthdate', value)}
                                    />
                                    {
                                        birthdate ? <Button
                                            onPress={() => this.updateCustomerInfo('birthdate', "")}
                                            style={{ width: scaleSzie(22), justifyContent: "center", alignItems: "center" }} >
                                            <Image source={ICON.clear_input_customer_info} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                                        </Button> : null
                                    }
                                </View>

                            </View>

                            {/* ------------ Address --------- */}
                            <FromItem
                                title={`Address`}
                                placeholder="Street"
                                style={{
                                    marginBottom: scaleSzie(10)
                                }}
                                value={street}
                                onChangeText={value => this.updateCustomerInfo('street', value, 'addressPost')}
                                onFocus={() => this.scrollRightContentTo(90)}
                            />

                            {/* ----------- City + Zip  ------------- */}
                            <View style={{ height: scaleSzie(35), marginBottom: scaleSzie(10), flexDirection: "row" }} >
                                <View style={{ flex: 1, flexDirection: "row", borderColor: "#CCCCCC", borderWidth: 1, paddingHorizontal: scaleSzie(10) }} >
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            fontSize: scaleSzie(14),
                                            color: "#404040"

                                        }}
                                        placeholder={"City"}
                                        value={city}
                                        onChangeText={value => this.updateCustomerInfo('city', value, 'addressPost')}
                                        onFocus={() => this.scrollRightContentTo(120)}
                                    />
                                    {
                                        city ? <Button
                                            onPress={() => this.updateCustomerInfo('city', "", "addressPost")}
                                            style={{ width: scaleSzie(22), justifyContent: "center", alignItems: "center" }} >
                                            <Image source={ICON.clear_input_customer_info} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                                        </Button> : null
                                    }
                                </View>
                                <View style={{ width: scaleSzie(35) }} />
                                <View style={{ flex: 1, flexDirection: "row", borderColor: "#CCCCCC", borderWidth: 1, paddingHorizontal: scaleSzie(10) }} >
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            fontSize: scaleSzie(14),
                                            color: "#404040"

                                        }}
                                        placeholder={"Zip"}
                                        value={zip}
                                        onChangeText={value => this.updateCustomerInfo('zip', value, 'addressPost')}
                                        onFocus={() => this.scrollRightContentTo(120)}
                                    />
                                    {
                                        zip ? <Button
                                            onPress={() => this.updateCustomerInfo('zip', "", "addressPost")}
                                            style={{ width: scaleSzie(22), justifyContent: "center", alignItems: "center" }} >
                                            <Image source={ICON.clear_input_customer_info} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                                        </Button> : null
                                    }
                                </View>
                            </View>

                            {/* ----------- State  ------------- */}
                            <View style={{ height: scaleSzie(35), flexDirection: "row", marginBottom: scaleSzie(dynamicMarginBottomState) }} >
                                <View style={{ flex: 1, }} >
                                    <TextInputSuggestion
                                        value={state}
                                        onChangeText={this.onChangeState}
                                        resetMarginState={() => this.setState({ dynamicMarginBottomState: 24 })}
                                        // onFocus={() => this.scrollCustomerTo(280)}
                                        onFocus={() => this.scrollRightContentTo(200)}
                                    />

                                </View>
                                <View style={{ width: scaleSzie(35) }} />
                                <View style={{ flex: 1 }} />
                            </View>

                            {/* ------------ Referrer Phone Number --------- */}
                            <PhoneItem
                                title={`Referrer Phone Number`}
                                isRequired={true}
                                placeholder="Enter phone number"
                                codeArea={codeReferrerPhone}
                                upddateCodeArea={(codeReferrerPhone) => this.setState({ codeReferrerPhone })}
                                value={referrerPhone}
                                onChangeText={value => this.updateCustomerInfo('referrerPhone', value)}
                                onFocus={() => this.scrollRightContentTo(250)}
                            />

                            {/* ------------ Note --------- */}
                            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600", marginBottom: scaleSzie(10) }} >
                                {`Note:`}
                            </Text>
                            <View style={{ height: scaleSzie(70), borderColor: "#CCCCCC", borderWidth: 1, padding: scaleSzie(10) }} >
                                <TextInput
                                    style={{
                                        flex: 1, fontSize: scaleSzie(12),
                                        padding: 0,
                                        textAlignVertical: "top"
                                    }}
                                    multiline={true}
                                    value={favourite}
                                    onChangeText={value => this.updateCustomerInfo('favourite', value)}
                                    onFocus={() => this.scrollRightContentTo(330)}
                                />
                            </View>

                            <View style={{ height: scaleSzie(400) }} />
                        </ScrollView>
                    </View>
                </View>


                {/* ------------- Footer ---------------- */}
                <View style={{
                    height: scaleSzie(75), width: width, position: "absolute", bottom: 0, flexDirection: "row",
                    paddingHorizontal: scaleSzie(45), justifyContent: "space-between"
                }} >
                    <ButtonCustom
                        width={scaleSzie(300)}
                        height={55}
                        backgroundColor="#F1F1F1"
                        title="CANCEL"
                        textColor="#404040"
                        onPress={() => { }}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4 }}
                        styleText={{
                            fontSize: scaleSzie(22)
                        }}
                    />

                    <ButtonCustom
                        width={scaleSzie(300)}
                        height={55}
                        backgroundColor="#0764B0"
                        title="SAVE"
                        textColor="#fff"
                        onPress={this.saveCustomerInfo}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4 }}
                        styleText={{
                            fontSize: scaleSzie(22)
                        }}
                    />
                </View>

                <PopupChangeCustomerStatus
                    visible={visibleChangeStatus}
                    onRequestClose={this.closePopupChangeStatus}
                />
            </View>
        );
    }
}

const PhoneItem = ({ title, isRequired, placeholder, style, value, onChangeText, codeArea, upddateCodeArea, onFocus }) => {

    return (
        <View style={[{ marginBottom: scaleSzie(14) }, style]} >
            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" }} >
                {`${title}`}
                {
                    isRequired ? <Text style={{ color: "#FF3B30" }} >
                        {` *`}
                    </Text> : null
                }

            </Text>

            <View style={{ height: scaleSzie(35), marginTop: scaleSzie(10), flexDirection: "row" }} >
                <View style={{ width: scaleSzie(55) }} >
                    <Dropdown
                        label={'+1'}
                        data={ListCodeAreaPhone}
                        value={codeArea}
                        onChangeText={upddateCodeArea}
                        containerStyle={{
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#C5C5C5',
                            flex: 1
                        }}
                    />
                </View>
                <View style={{ width: scaleSzie(8) }} />
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), borderWidth: 1, borderColor: "#CCCCCC", flexDirection: "row", }} >
                    <TextInputMask
                        style={{
                            flex: 1,
                            fontSize: scaleSzie(14),
                            color: "#404040",

                        }}
                        type={'custom'}
                        options={{
                            mask: '999-999-9999'
                        }}
                        placeholder="012-345-6456"
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={onFocus ? onFocus : null}
                    />
                    {
                        value ? <Button
                            onPress={() => onChangeText("")}
                            style={{ width: scaleSzie(22), justifyContent: "center", alignItems: "center" }} >
                            <Image source={ICON.clear_input_customer_info} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                        </Button> : null
                    }
                </View>
            </View>
        </View>
    );
}

const FromItem = ({ title, isRequired, placeholder, style, value, onChangeText, onFocus }) => {

    return (
        <View style={[{ marginBottom: scaleSzie(14) }, style]} >
            <Text style={{ fontSize: scaleSzie(14), color: "#404040", fontWeight: "600" }} >
                {`${title}`}
                {
                    isRequired ? <Text style={{ color: "#FF3B30" }} >
                        {` *`}
                    </Text> : null
                }

            </Text>

            <View style={{
                height: scaleSzie(35), borderWidth: 1, borderColor: "#CCCCCC", marginTop: scaleSzie(10), paddingHorizontal: scaleSzie(10),
                flexDirection: "row",
            }} >
                <TextInput
                    style={{
                        flex: 1,
                        fontSize: scaleSzie(14),
                        color: "#404040",

                    }}
                    placeholder={placeholder ? placeholder : ""}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={onFocus ? onFocus : null}
                />

                {
                    value ? <Button
                        onPress={() => onChangeText("")}
                        style={{ width: scaleSzie(22), justifyContent: "center", alignItems: "center" }} >
                        <Image source={ICON.clear_input_customer_info} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                    </Button> : null
                }
            </View>
        </View>
    );
}


const strings = {
    firstName: 'Missing Info: First Name',
    lastName: 'Missing Info: Last Name',
    phone: 'Missing Info: Phone',
    StateInvalid: "State Invalid",
    birthdate:"Birth Date Invalid"
}

const mapStateToProps = state => ({
    stateCity: state.dataLocal.stateCity,
})



export default connectRedux(mapStateToProps, EditOrCreateCustomerTab);