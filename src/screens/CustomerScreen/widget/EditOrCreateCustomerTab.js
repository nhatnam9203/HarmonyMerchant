import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
    TextInput,
    Dimensions
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { Button, Text, Dropdown, ButtonCustom } from '@components';
import { scaleSzie, ListCodeAreaPhone } from '@utils';
import Configs from "@configs";
import ICON from "@resources";

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
                isVip: "Normal",
                gender: "Female",
                birthday: ""
            },
            customerId: 0,
            codeAreaPhone: '+1',
            codeReferrerPhone: '+1',
            dynamicMarginBottomState: 24

        };
        this.scrollLeftCustomerRef = React.createRef();
        this.scrollRightCustomerRef = React.createRef();

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


    render() {
        const { codeAreaPhone, codeReferrerPhone } = this.state;
        const { firstName, lastName, phone, email, referrerPhone, favourite, addressPost, isVip, gender, birthday } = this.state.customerInfo;
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
                    <View style={{
                        width: scaleSzie(85), height: scaleSzie(28), backgroundColor: "#0764B0", borderRadius: scaleSzie(20),
                        justifyContent: "center", alignItems: "center", flexDirection: "row"
                    }} >
                        <Text style={{ color: "#fff", fontSize: scaleSzie(13), marginLeft: scaleSzie(6) }} >
                            {`Normal`}
                        </Text>
                        <Image source={ICON.white_drpdown_status_customer} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                    </View>
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
                            />

                            <PhoneItem
                                title={`Phone Number`}
                                isRequired={true}
                                placeholder="Enter phone number"
                                codeArea={codeAreaPhone}
                                upddateCodeArea={(codeAreaPhone) => this.setState({ codeAreaPhone })}
                                value={phone}
                                onChangeText={value => this.updateCustomerInfo('phone', value)}
                            />

                            <FromItem
                                title={`Contact email`}
                                placeholder="Email address"
                                value={email}
                                onChangeText={value => this.updateCustomerInfo('email', value)}
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

                            <View style={{ height: scaleSzie(300) }} />
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
                                        value={birthday}
                                        onChangeText={value => this.updateCustomerInfo('birthday', value)}
                                    />
                                    {
                                        birthday ? <Button
                                            onPress={() => this.updateCustomerInfo('birthday', "")}
                                            style={{ width: scaleSzie(22), justifyContent: "center", alignItems: "center" }} >
                                            <Image source={ICON.clear_input_customer_info} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                                        </Button> : null
                                    }
                                </View>

                            </View>

                            {/* ------------ Address --------- */}
                            <FromItem
                                title={`Address`}
                                isRequired={true}
                                placeholder="Street"
                                style={{
                                    marginBottom: scaleSzie(10)
                                }}
                                value={street}
                                onChangeText={value => this.updateCustomerInfo('street', value, 'addressPost')}
                            />

                            {/* ----------- City + State ------------- */}
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
                                <View style={{ flex: 1, borderColor: "#CCCCCC", borderWidth: 1 }} >

                                </View>
                            </View>

                            {/* ----------- Zip code ------------- */}
                            <View style={{ height: scaleSzie(35), marginBottom: scaleSzie(10), flexDirection: "row" }} >
                                <View style={{ flex: 1,flexDirection:"row" ,borderColor: "#CCCCCC", borderWidth: 1, paddingHorizontal: scaleSzie(10) }} >
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            fontSize: scaleSzie(14),
                                            color: "#404040"

                                        }}
                                        placeholder={"Zip"}
                                        value={zip}
                                        onChangeText={value => this.updateCustomerInfo('zip', value, 'addressPost')}
                                    />
                                    {
                                        zip ? <Button
                                            onPress={() => this.updateCustomerInfo('zip', "", "addressPost")}
                                            style={{ width: scaleSzie(22), justifyContent: "center", alignItems: "center" }} >
                                            <Image source={ICON.clear_input_customer_info} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                                        </Button> : null
                                    }
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
                                    // value={favourite}
                                    // onChangeText={value => this.updateCustomerInfo('favourite', value)}
                                    // onFocus={() => this.scrollCustomerTo(500)}
                                    multiline={true}
                                    value={favourite}
                                    onChangeText={value => this.updateCustomerInfo('favourite', value)}
                                />
                            </View>

                            <View style={{ height: scaleSzie(300) }} />
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
                        onPress={() => { }}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4 }}
                        styleText={{
                            fontSize: scaleSzie(22)
                        }}
                    />
                </View>
            </View>
        );
    }
}

const PhoneItem = ({ title, isRequired, placeholder, style, value, onChangeText, codeArea, upddateCodeArea }) => {

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
                height: scaleSzie(35), marginTop: scaleSzie(10),
                //  paddingHorizontal: scaleSzie(10),
                //   borderWidth: 1, borderColor: "#CCCCCC",
                flexDirection: "row",
            }} >
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

const FromItem = ({ title, isRequired, placeholder, style, value, onChangeText }) => {

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


const styles = StyleSheet.create({
    SHADOW: {
        backgroundColor: "#fff",
        borderRadius: scaleSzie(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.6,
                shadowOffset: { width: 0, height: 1 },
            },

            android: {
                elevation: 2,
            },
        })
    },

})

export default EditOrCreateCustomerTab;

