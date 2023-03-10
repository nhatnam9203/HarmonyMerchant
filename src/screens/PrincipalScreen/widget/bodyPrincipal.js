import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import {
    InputForm, Text, Button,
    InputFormPhone, TextInputSuggestion
} from '@components';
import { scaleSize, localize, formatWithMoment } from '@utils';
import IMAGE from '@resources';
import styles from '../style';

export default class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.homePhoneRef = React.createRef();
        this.mobilePhoneRef = React.createRef();
    }

    getAreaPhoneCode = () => {
        const homePhone = this.homePhoneRef.current?.state.codeAreaPhone;
        const mobilePhone = this.mobilePhoneRef.current?.state.codeAreaPhone;
        return {
            homePhone,
            mobilePhone
        }
    }

    componentDidMount() {
        const { homePhone, mobilePhone } = this.props.phoneCodePrincipal;
        this.homePhoneRef.current?.setStateFromParent(homePhone);
        this.mobilePhoneRef.current?.setStateFromParent(mobilePhone);
    }


    render() {
        const { language, principalInfo, scrollPrincipalTo, dateOfBirth, uriUpload, updatePrincipalInfo,
            showCalendar, takePhoto, openImageLibrary, isPrincipalSecond,
            updatePhoneCode, dynamicMarginBottomStatePrincipal, dynamicMarginBottomDAStateIssuedPrincipal
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
                <View style={{ height: scaleSize(16) }} />


                <View style={{ flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <InputForm
                            title={`${localize('Principal Name', language)}*`}
                            subTitle=""
                            placeholder={localize('First Name', language)}
                            value={firstName}
                            onChangeText={(value) => updatePrincipalInfo('firstName', value, '', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 230 : 190)}
                        />
                    </View>
                    <View style={{ flex: 1, paddingLeft: scaleSize(20) }} >
                        <InputForm
                            title="   "
                            subTitle=""
                            placeholder={localize('Last Name', language)}
                            value={lastName}
                            onChangeText={(value) => updatePrincipalInfo('lastName', value, '', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 230 : 190)}
                        />
                    </View>
                </View>

                <InputForm
                    title={`${localize('Title/Position', language)}*`}
                    subTitle=""
                    placeholder={localize('President/Manager/Owner', language)}
                    value={position}
                    onChangeText={(value) => updatePrincipalInfo('position', value, '', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 310 : 270)}
                />
                <InputForm
                    title={`${localize('Ownership', language)} (%)*`}
                    subTitle=""
                    placeholder=""
                    value={ownership}
                    onChangeText={(value) => updatePrincipalInfo('ownership', value, '', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 390 : 350)}
                    isOnlyNumber={true}
                />

                <View style={{ flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        <InputFormPhone
                            ref={this.homePhoneRef}
                            title={`${localize('Home Phone', language)}`}
                            subTitle=""
                            placeholder=""
                            value={homePhone}
                            onChangeText={(value) => updatePrincipalInfo('homePhone', value, '', isPrincipalSecond)}
                            keyboardType="numeric"
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 460 : 420)}
                            onChangePhoneCode={(codeAreaPhone) => updatePhoneCode(codeAreaPhone, 'homePhone', isPrincipalSecond)}
                        />
                    </View>
                    <View style={{ flex: 1, paddingLeft: scaleSize(20) }} >
                        <InputFormPhone
                            ref={this.mobilePhoneRef}
                            title={`${localize('Mobile Phone', language)}*`}
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
                    title={`${localize('Address', language)}*`}
                    subTitle=""
                    placeholder={localize('Home Address', language)}
                    style={{
                        marginBottom: scaleSize(10)
                    }}
                    value={address}
                    onChangeText={(value) => updatePrincipalInfo('address', value, 'addressPrincipal', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 540 : 500)}
                />
                <View style={{
                    height: scaleSize(30), marginBottom: scaleSize(dynamicMarginBottomStatePrincipal), justifyContent: 'space-between',
                    flexDirection: 'row', alignItems: 'flex-end'
                }} >
                    <View style={{ width: scaleSize(180) }} >
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
                    <View style={{ width: scaleSize(180), height: "100%" }} >
                        <TextInputSuggestion
                            value={state}
                            onChangeText={(value, count) => {
                                updatePrincipalInfo('state', value, 'addressPrincipal', isPrincipalSecond);
                                this.props.updateMarginTopState(count);
                            }}
                            resetMarginState={() => this.props.resetMarginTopState()}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 540 : 500)}
                        />
                    </View>
                    <View style={{ width: scaleSize(180) }} >
                        <InputForm
                            title=""
                            subTitle=""
                            placeholder="Zip Code"
                            style={{
                                marginBottom: 0
                            }}
                            value={zip}
                            onChangeText={(value) => updatePrincipalInfo('zip', value, 'addressPrincipal', isPrincipalSecond)}
                            // keyboardType="numeric"
                            //  maxLength={10}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 540 : 500)}
                        />
                    </View>
                </View>
                <View style={{ height: scaleSize(15) }} />
                <InputForm
                    isOnlyNumber={true}
                    title={`${localize('Years at This Address')}*`}
                    subTitle=""
                    placeholder=""
                    value={yearAtThisAddress}
                    onChangeText={(value) => updatePrincipalInfo('yearAtThisAddress', value, '', isPrincipalSecond)}
                    keyboardType="numeric"
                    maxLength={2}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 665 : 625)}
                />
                <InputFormPhone
                    isNotShowDropdown={true}
                    mark='999-99-9999'
                    title={`${localize('Social Security Number (SSN)', language)}*`}
                    subTitle=""
                    placeholder="000-00-0000"
                    value={ssn}
                    onChangeText={(value) => updatePrincipalInfo('ssn', value, '', isPrincipalSecond)}
                    keyboardType="numeric"
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 745 : 705)}
                />
                {/* ------ Date of Birth ----- */}
                <Text style={{ color: '#404040', fontSize: scaleSize(14), marginBottom: scaleSize(6), fontWeight: "600" }} >
                    {`${localize('Date of Birth', language)} (mm/dd/yyyy)*`}
                </Text>

                <View style={{
                    height: scaleSize(30), flexDirection: 'row', marginTop: scaleSize(8), marginBottom: scaleSize(20),
                }} >
                    <Button
                        onPress={() => showCalendar()}
                        style={{
                            width: scaleSize(180), backgroundColor: '#F1F1F1', borderWidth: 1, borderColor: '#C5C5C5',
                            flexDirection: 'row'
                        }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSize(8) }} >
                            <Text style={styles.textNormal} >
                                {`${formatWithMoment(dateOfBirth, 'MM/DD/YYYY')}`}
                            </Text>
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSize(2) }} >
                            <View style={{ flex: 1, backgroundColor: '#C5C5C5' }} />
                        </View>
                        <View style={{ width: scaleSize(40), justifyContent: 'center', alignItems: 'center' }} >
                            <Image source={IMAGE.calendar} style={{ height: scaleSize(20), width: scaleSize(20) }} />
                        </View>
                    </Button>
                </View>

                {/* ------------- */}
                <InputForm
                    title={`${localize('Email Address')}*`}
                    subTitle=""
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={(value) => updatePrincipalInfo('email', value, '', isPrincipalSecond)}
                    onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 900 : 860)}

                />
                <View style={{
                    flexDirection: 'row', marginBottom: scaleSize(dynamicMarginBottomDAStateIssuedPrincipal),
                }} >
                    <View style={{ flex: 1, paddingRight: scaleSize(20) }} >
                        <InputForm
                            title={`${localize('Driver License Number', language)}*`}
                            subTitle=""
                            placeholder=""
                            value={driverLicense}
                            onChangeText={(value) => updatePrincipalInfo('driverLicense', value, '', isPrincipalSecond)}
                            onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 980 : 940)}
                        />
                    </View>
                    <View style={{ width: scaleSize(180), }} >
                        <Text style={[{ color: '#404040', fontSize: scaleSize(14), marginBottom: scaleSize(5), fontWeight: "600" }]} >
                            {`${localize('State Issued', language)}*`}
                        </Text>
                        <View style={{ height: scaleSize(30) }} >
                            <TextInputSuggestion
                                value={stateIssued}
                                onChangeText={(value, count) => {
                                    updatePrincipalInfo('stateIssued', value, '', isPrincipalSecond);
                                    this.props.updateMarginTopStateIssued(count);
                                }}
                                resetMarginState={() => this.props.resetMarginTopStateIssued()}
                                onFocus={() => scrollPrincipalTo(isPrincipalSecond ? 980 : 940)}
                            />
                        </View>
                    </View>
                </View>

                {/* ------ Take Photo ---- */}

                <Text style={{ color: '#404040', fontSize: scaleSize(14), fontWeight: "600" }} >
                    {`${localize('Please take or upload photos of Driver License', language)}*`}
                </Text>
                <View style={{
                    alignItems: 'center',
                    padding: scaleSize(10), marginTop: scaleSize(18)
                }} >
                    {
                        uriUpload ?
                            <View style={{
                                width: scaleSize(400), height: scaleSize(300),
                                overflow: 'hidden', marginBottom: scaleSize(10)
                            }} >
                                <Image
                                    source={{ uri: uriUpload }}
                                    style={{ width: null, height: null, flex: 1 }}
                                />
                            </View> : <View />
                    }

                    <View style={{
                        width: scaleSize(400), height: scaleSize(200),
                        borderWidth: 2, borderColor: '#C5C5C5', borderStyle: "dashed",
                        borderRadius: scaleSize(14),
                        alignItems: 'center',
                        paddingTop: scaleSize(5)

                    }} >
                        <Button onPress={() => takePhoto()} >
                            <Image
                                source={IMAGE.camera}
                            />
                        </Button>

                        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }} >
                            <Text style={{
                                color: '#C5C5C5', fontSize: scaleSize(20), fontWeight: 'bold',
                            }} >
                                {localize('Take a Photo', language)}
                            </Text>

                            <Text style={{
                                color: '#C5C5C5', fontSize: scaleSize(20),
                            }} >
                                {localize('Or', language)}
                            </Text>
                            <Button
                                onPress={() => openImageLibrary()}
                                style={{
                                    width: scaleSize(180), height: scaleSize(40), backgroundColor: '#F1F1F1',
                                    borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4, justifyContent: "center", alignItems: 'center'
                                }} >
                                <Text style={{
                                    color: '#C5C5C5', fontSize: scaleSize(20),
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
