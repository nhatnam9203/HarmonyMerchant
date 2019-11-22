import React from 'react';
import {
    View,
    Image,
    Dimensions
} from 'react-native';
import moment from 'moment';


import {
    InputForm, Text, Button,
    InputFormPhone, TextInputSuggestion
} from '@components';
import { scaleSzie, localize } from '@utils';
import IMAGE from '@resources';
import styles from '../style';

const { width } = Dimensions.get('window');

export default class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.homePhoneRef = React.createRef();
        this.mobilePhoneRef = React.createRef();
    }

    getAreaPhoneCode = () => {
        const homePhone = this.homePhoneRef.current.state.codeAreaPhone;
        const mobilePhone = this.mobilePhoneRef.current.state.codeAreaPhone;
        return {
            homePhone,
            mobilePhone
        }
    }

    componentDidMount() {
        const {homePhone,mobilePhone} = this.props.phoneCodePrincipal;
        this.homePhoneRef.current.setStateFromParent(homePhone);
        this.mobilePhoneRef.current.setStateFromParent(mobilePhone);
    }


    render() {
        const { language, principalInfo, scrollPrincipalTo, dateOfBirth, uriUpload, updatePrincipalInfo,
            showCalendar, takePhoto, openImageLibrary, isPrincipalSecond,
            updatePhoneCode
        } = this.props;
        const {
            firstName, lastName, position, ownership, homePhone, mobilePhone, addressPrincipal,
            yearAtThisAddress, ssn, email, driverLicense, stateIssued
        } = principalInfo;
        const {
            address, city, state, zip
        } = addressPrincipal;
        return (
            <View accessibilityElementsHidden={true} style={{ flex: 1 }} >
                <View style={{ height: scaleSzie(16) }} />


                <View style={{ flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <InputForm
                            title={localize('Principal Name *', language)}
                            subTitle=""
                            placeholder={localize('First name', language)}
                            value={firstName}
                            onChangeText={(value) => updatePrincipalInfo('firstName', value, '', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 230 : 190)}
                        />
                    </View>
                    <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                        <InputForm
                            title="   "
                            subTitle=""
                            placeholder={localize('Last name', language)}
                            value={lastName}
                            onChangeText={(value) => updatePrincipalInfo('lastName', value, '', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 230 : 190)}
                        />
                    </View>
                </View>

                <InputForm
                    title={localize('Title/Position *', language)}
                    subTitle=""
                    placeholder={localize('Manager', language)}
                    value={position}
                    onChangeText={(value) => updatePrincipalInfo('position', value, '', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 310 : 270)}
                />
                <InputForm
                    title={localize('Ownership (%) *', language)}
                    subTitle=""
                    placeholder=""
                    value={ownership}
                    onChangeText={(value) => updatePrincipalInfo('ownership', value, '', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 390 : 350)}
                />

                <View style={{ flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <InputFormPhone
                            ref={this.homePhoneRef}
                            title={localize('Home Phone', language)}
                            subTitle=""
                            placeholder=""
                            value={homePhone}
                            onChangeText={(value) => updatePrincipalInfo('homePhone', value, '', isPrincipalSecond)}
                            keyboardType="numeric"
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 460 : 420)}
                            onChangePhoneCode={(codeAreaPhone) => updatePhoneCode(codeAreaPhone, 'homePhone', isPrincipalSecond)}
                        />
                    </View>
                    <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                        <InputFormPhone
                            ref={this.mobilePhoneRef}
                            title={`${localize('Mobile Phone', language)} *`}
                            subTitle=""
                            placeholder=""
                            value={mobilePhone}
                            onChangeText={(value) => updatePrincipalInfo('mobilePhone', value, '', isPrincipalSecond)}
                            keyboardType="numeric"
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 460 : 420)}
                            onChangePhoneCode={(codeAreaPhone) => updatePhoneCode(codeAreaPhone, 'mobilePhone', isPrincipalSecond)}
                        />
                    </View>
                </View>

                <InputForm
                    title={localize('Address *', language)}
                    subTitle=""
                    placeholder={localize('Home address', language)}
                    style={{
                        marginBottom: scaleSzie(10)
                    }}
                    value={address}
                    onChangeText={(value) => updatePrincipalInfo('address', value, 'addressPrincipal', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 540 : 500)}
                />
                <View style={{
                    height: scaleSzie(30), marginBottom: scaleSzie(24), justifyContent: 'space-between',
                    flexDirection: 'row', alignItems: 'flex-end'
                }} >
                    <View style={{ width: scaleSzie(180) }} >
                        <InputForm
                            title=""
                            subTitle=""
                            placeholder={localize('City', language)}
                            style={{
                                marginBottom: 0
                            }}
                            value={city}
                            onChangeText={(value) => updatePrincipalInfo('city', value, 'addressPrincipal', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 540 : 500)}
                        />
                    </View>
                    <View style={{ width: scaleSzie(180), height: scaleSzie(30) }} >
                        <TextInputSuggestion
                            value={state}
                            onChangeText={(value) => updatePrincipalInfo('state', value, 'addressPrincipal', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 540 : 500)}
                        />
                    </View>
                    <View style={{ width: scaleSzie(180) }} >
                        <InputForm
                            title=""
                            subTitle=""
                            placeholder="Zip"
                            style={{
                                marginBottom: 0
                            }}
                            value={zip}
                            onChangeText={(value) => updatePrincipalInfo('zip', value, 'addressPrincipal', isPrincipalSecond)}
                            keyboardType="numeric"
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 540 : 500)}
                        />
                    </View>
                </View>
                <View style={{ height: scaleSzie(15) }} />
                <InputForm
                    isOnlyNumber={true}
                    title={localize('Years at This Address *')}
                    subTitle=""
                    placeholder=""
                    value={yearAtThisAddress}
                    onChangeText={(value) => updatePrincipalInfo('yearAtThisAddress', value, '', isPrincipalSecond)}
                    keyboardType="numeric"
                    maxLength={4}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 665 : 625)}
                />
                <InputFormPhone
                    isNotShowDropdown={true}
                    mark='999-99-9999'
                    title={localize('Social Security Number (SSN) *', language)}
                    subTitle=""
                    placeholder=""
                    value={ssn}
                    onChangeText={(value) => updatePrincipalInfo('ssn', value, '', isPrincipalSecond)}
                    keyboardType="numeric"
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 745 : 705)}
                />
                {/* ------ Date of Birth ----- */}
                <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(6) }} >
                    {localize('Date of Birth (dd/mm/yyyy) *', language)}
                </Text>

                <View style={{
                    height: scaleSzie(30), flexDirection: 'row', marginTop: scaleSzie(8), marginBottom: scaleSzie(20),
                }} >
                    <Button
                        onPress={() => showCalendar()}
                        style={{
                            width: scaleSzie(180), backgroundColor: '#F1F1F1', borderWidth: 1, borderColor: '#C5C5C5',
                            flexDirection: 'row'
                        }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(8) }} >
                            <Text style={styles.textNormal} >
                                {`${moment(dateOfBirth).format('MM/DD/YYYY')}`}
                            </Text>
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSzie(2) }} >
                            <View style={{ flex: 1, backgroundColor: '#C5C5C5' }} />
                        </View>
                        <View style={{ width: scaleSzie(40), justifyContent: 'center', alignItems: 'center' }} >
                            <Image source={IMAGE.calendar} style={{ height: scaleSzie(20), width: scaleSzie(20) }} />
                        </View>
                    </Button>
                </View>

                {/* ------------- */}
                <InputForm
                    title={localize('Email Address *')}
                    subTitle=""
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={(value) => updatePrincipalInfo('email', value, '', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 900 : 860)}

                />
                <View style={{ flexDirection: 'row' }} >
                    <View style={{ flex: 1, paddingRight: scaleSzie(20) }} >
                        <InputForm
                            title={localize('Driver License Number *', language)}
                            subTitle=""
                            placeholder=""
                            value={driverLicense}
                            onChangeText={(value) => updatePrincipalInfo('driverLicense', value, '', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 980 : 940)}
                        />
                    </View>
                    <View style={{ width: scaleSzie(180) }} >
                        <InputForm
                            title={localize('State Issued *', language)}
                            subTitle=""
                            placeholder=""
                            value={stateIssued}
                            onChangeText={(value) => updatePrincipalInfo('stateIssued', value, '', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 980 : 940)}
                        />
                    </View>
                </View>

                {/* ------ Take Photo ---- */}

                <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                    {`${localize('Please take or upload photos of Driver License', language)} *`}
                </Text>

                <View style={{
                    alignItems: 'center',
                    padding: scaleSzie(10), marginTop: scaleSzie(18)
                }} >
                    {
                        uriUpload ?
                            <View style={{
                                width: scaleSzie(400), height: scaleSzie(300),
                                overflow: 'hidden', marginBottom: scaleSzie(10)
                            }} >
                                <Image
                                    source={{ uri: uriUpload }}
                                    style={{ width: null, height: null, flex: 1 }}
                                />
                            </View> : <View />
                    }

                    <View style={{
                        width: scaleSzie(400), height: scaleSzie(200),
                        borderWidth: 2, borderColor: '#C5C5C5', borderStyle: "dashed",
                        borderRadius: scaleSzie(14),
                        alignItems: 'center',
                        paddingTop: scaleSzie(5)

                    }} >
                        <Button onPress={() => takePhoto()} >
                            <Image
                                source={IMAGE.camera}
                            />
                        </Button>

                        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }} >
                            <Text style={{
                                color: '#C5C5C5', fontSize: scaleSzie(20), fontWeight: 'bold',
                            }} >
                                {localize('Take a Photo', language)}
                            </Text>

                            <Text style={{
                                color: '#C5C5C5', fontSize: scaleSzie(20),
                            }} >
                                {localize('Or', language)}
                            </Text>
                            <Button
                                onPress={() => openImageLibrary()}
                                style={{
                                    width: scaleSzie(180), height: scaleSzie(40), backgroundColor: '#F1F1F1',
                                    borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4, justifyContent: "center", alignItems: 'center'
                                }} >
                                <Text style={{
                                    color: '#C5C5C5', fontSize: scaleSzie(20),
                                }} >
                                    {localize('Browse File', language)}
                                </Text>
                            </Button>
                        </View>

                    </View>
                </View>

            </View>

        );
    }
}
