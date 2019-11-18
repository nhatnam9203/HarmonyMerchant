import React from 'react';
import {
    View,
    Image,
    ScrollView,
    TextInput,
    Dimensions
} from 'react-native';
import moment from 'moment';


import {
    InputForm, FormInfoParent, Text, Dropdown, Button, PopupUpload, DatePicker,
    InputFormPhone, TextInputSuggestion
} from '@components';
import { scaleSzie, localize, getArrayNameStateCity } from '@utils';
import IMAGE from '@resources';
import styles from './style';

const { width } = Dimensions.get('window');

export default class Layout extends React.Component {

    render() {
        const { principalInfo } = this.state;
        const {
            firstName, lastName, position, ownership, homePhone, mobilePhone, addressPrincipal,
            yearAtThisAddress, ssn, email, driverLicense, stateIssued
        } = principalInfo;
        const {
            address, city, state, zip
        } = addressPrincipal;
        const { language, stateCity } = this.props;
        return (
            <FormInfoParent
                title={localize('Principal Information', language)}
                back={() => this.props.navigation.goBack()}
                next={this.nextScreen}

            >
                <ScrollView
                    ref={this.srollPrincipalRef}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ------ Header ------ */}
                    <View style={{
                        width, paddingHorizontal: scaleSzie(15),
                        marginTop: scaleSzie(8)
                    }}  >
                        <Text style={{ color: '#0764B0', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                            Please fill the form below
                            </Text>
                        <View style={{
                            height: scaleSzie(38), backgroundColor: '#0764B0', justifyContent: 'center',
                            paddingLeft: scaleSzie(5), marginTop: scaleSzie(5)
                        }} >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                                {localize('Principal Information', language)}
                            </Text>
                        </View>
                    </View>
                    {/* ------------------------- */}
                    <View style={{ paddingHorizontal: scaleSzie(16), marginTop: scaleSzie(10) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            {localize('Principal Des', language)}
                        </Text>
                    </View>

                    <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                        <View style={{ height: scaleSzie(16) }} />
                        {/* ------------------   Principal 1 ---------------- */}
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ marginTop: scaleSzie(10) }} >
                                <Text style={{
                                    color: '#404040', fontSize: scaleSzie(18), fontWeight: 'bold',
                                    marginBottom: scaleSzie(10)
                                }} >
                                    Principal 1
                            </Text>
                            </View>
                            <View style={{
                                width: scaleSzie(30), justifyContent: "center", alignItems: "center"
                            }} >
                                <Image
                                    source={IMAGE.right_scroll_active}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }} >
                                <View style={{ width: "100%", height: 2, backgroundColor: "#0764B0" }} />
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <InputForm
                                    title={localize('Principal Name *', language)}
                                    subTitle=""
                                    placeholder={localize('First name', language)}
                                    value={firstName}
                                    onChangeText={(value) => this.updatePrincipalInfo('firstName', value)}
                                    onFocus={() => this.scrollPrincipalTo(140)}
                                />
                            </View>
                            <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                                <InputForm
                                    title="   "
                                    subTitle=""
                                    placeholder={localize('Last name', language)}
                                    value={lastName}
                                    onChangeText={(value) => this.updatePrincipalInfo('lastName', value)}
                                    onFocus={() => this.scrollPrincipalTo(140)}
                                />
                            </View>
                        </View>

                        <InputForm
                            title={localize('Title/Position *', language)}
                            subTitle=""
                            placeholder={localize('Manager', language)}
                            value={position}
                            onChangeText={(value) => this.updatePrincipalInfo('position', value)}
                            onFocus={() => this.scrollPrincipalTo(245)}
                        />
                        <InputForm
                            title={localize('Ownership (%) *', language)}
                            subTitle=""
                            placeholder=""
                            value={ownership}
                            onChangeText={(value) => this.updatePrincipalInfo('ownership', value)}
                            onFocus={() => this.scrollPrincipalTo(320)}
                        />

                        <View style={{ flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <InputFormPhone
                                    ref={this.homePhoneRef}
                                    title={localize('Home Phone *', language)}
                                    subTitle=""
                                    placeholder=""
                                    value={homePhone}
                                    onChangeText={(value) => this.updatePrincipalInfo('homePhone', value)}
                                    keyboardType="numeric"
                                    onFocus={() => this.scrollPrincipalTo(395)}
                                />
                            </View>
                            <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                                <InputFormPhone
                                    ref={this.mobilePhoneRef}
                                    title={`${localize('Mobile Phone', language)} *`}
                                    subTitle=""
                                    placeholder=""
                                    value={mobilePhone}
                                    onChangeText={(value) => this.updatePrincipalInfo('mobilePhone', value)}
                                    keyboardType="numeric"
                                    onFocus={() => this.scrollPrincipalTo(395)}
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
                            onChangeText={(value) => this.updatePrincipalInfo('address', value, 'addressPrincipal')}
                            onFocus={() => this.scrollPrincipalTo(470)}
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
                                    onChangeText={(value) => this.updatePrincipalInfo('city', value, 'addressPrincipal')}
                                    onFocus={() => this.scrollPrincipalTo(470)}
                                />
                            </View>
                            {/* <View style={{ width: scaleSzie(180) }} >
                                <Dropdown
                                    label={localize('State', language)}
                                    data={getArrayNameStateCity(stateCity)}
                                    value={state}
                                    onChangeText={(value) => this.updatePrincipalInfo('state', value, 'addressPrincipal')}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
                                        flex: 1
                                    }}
                                />
                            </View> */}
                            <View style={{ width: scaleSzie(180), height: scaleSzie(30) }} >
                                <TextInputSuggestion
                                    value={state}
                                    onChangeText={(value) => this.updatePrincipalInfo('state', value, 'addressPrincipal')}
                                    onFocus={() => this.scrollPrincipalTo(470)}
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
                                    onChangeText={(value) => this.updatePrincipalInfo('zip', value, 'addressPrincipal')}
                                    keyboardType="numeric"
                                    onFocus={() => this.scrollPrincipalTo(470)}
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
                            onChangeText={(value) => this.updatePrincipalInfo('yearAtThisAddress', value)}
                            keyboardType="numeric"
                            maxLength={4}
                            onFocus={() => this.scrollPrincipalTo(590)}
                        />
                        <InputFormPhone
                            // isOnlyNumber={true}
                            isNotShowDropdown={true}
                            title={localize('Social Security Number (SSN) *', language)}
                            subTitle=""
                            placeholder=""
                            value={ssn}
                            onChangeText={(value) => this.updatePrincipalInfo('ssn', value)}
                            keyboardType="numeric"
                            onFocus={() => this.scrollPrincipalTo(665)}
                        />
                        {/* ------ Date of Birth ----- */}
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(6) }} >
                            {localize('Date of Birth (dd/mm/yyyy) *', language)}
                        </Text>

                        <View style={{
                            height: scaleSzie(30), flexDirection: 'row', marginTop: scaleSzie(8), marginBottom: scaleSzie(20),
                        }} >
                            <Button
                                onPress={this.showCalendar}
                                style={{
                                    width: scaleSzie(180), backgroundColor: '#F1F1F1', borderWidth: 1, borderColor: '#C5C5C5',
                                    flexDirection: 'row'
                                }} >
                                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(8) }} >
                                    <Text style={styles.textNormal} >
                                        {`${moment(this.state.dateOfBirth).format('MM/DD/YYYY')}`}
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
                            onChangeText={(value) => this.updatePrincipalInfo('email', value)}
                            onFocus={() => this.scrollPrincipalTo(820)}

                        />
                        <View style={{ flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingRight: scaleSzie(20) }} >
                                <InputForm
                                    // isOnlyNumber={true}
                                    title={localize('Driver License Number *', language)}
                                    subTitle=""
                                    placeholder=""
                                    value={driverLicense}
                                    onChangeText={(value) => this.updatePrincipalInfo('driverLicense', value)}
                                    // keyboardType="numeric"
                                    onFocus={() => this.scrollPrincipalTo(900)}
                                />
                            </View>
                            <View style={{ width: scaleSzie(180) }} >
                                {/* <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(5) }} >
                                {localize('State Issued *', language)}
                            </Text>
                            <Dropdown
                                label={'2000'}
                                data={data}
                                value={stateIssued}
                                onChangeText={(value) => this.updatePrincipalInfo('stateIssued', value)}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    width: scaleSzie(180),
                                    height: scaleSzie(30)
                                }}
                            /> */}
                                <InputForm
                                    // isOnlyNumber={true}
                                    title={localize('State Issued *', language)}
                                    subTitle=""
                                    placeholder=""
                                    value={stateIssued}
                                    onChangeText={(value) => this.updatePrincipalInfo('stateIssued', value)}
                                    // keyboardType="numeric"
                                    onFocus={() => this.scrollPrincipalTo(900)}
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
                                this.state.uriUpload ?
                                    <View style={{
                                        width: scaleSzie(400), height: scaleSzie(300),
                                        overflow: 'hidden', marginBottom: scaleSzie(10)
                                    }} >
                                        <Image
                                            source={{ uri: this.state.uriUpload }}
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
                                <Button onPress={this.takePhoto} >
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
                                        onPress={this.openImageLibrary}
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

                        {/* ------------------   Principal 2 ---------------- */}
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ marginTop: scaleSzie(10) }} >
                                <Text style={{
                                    color: '#404040', fontSize: scaleSzie(18), fontWeight: 'bold',
                                    marginBottom: scaleSzie(10)
                                }} >
                                    Principal 2
                            </Text>
                            </View>
                            <View style={{
                                width: scaleSzie(30), justifyContent: "center", alignItems: "center"
                            }} >
                                <Image
                                    source={IMAGE.right_scroll_active}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }} >
                                <View style={{ width: "100%", height: 2, backgroundColor: "#0764B0" }} />
                            </View>
                        </View>

                        {/* ---------------------- */}
                    </View>
                    <PopupUpload
                        ref={this.uploadVoidCheckRef}
                        visible={this.state.visibleUpload}
                        title={localize('File Upload', language)}
                        message="Do you want to Archive this Category ?"
                        onRequestClose={() => this.setState({ visibleUpload: false })}
                        uri={this.state.uriUpload}
                        saveVoidCheck={this.saveVoidCheck}
                    />
                    {/* ------------- Date Picker ------ */}
                    <DatePicker
                        visible={this.state.showCalendar}
                        onRequestClose={() => this.setState({ showCalendar: false })}
                        title="Day Of Birth"
                        dateCalendar={this.state.dateOfBirth}
                        setDateSelected={this.setDateSelected}
                    />
                    <View style={{ height: scaleSzie(250) }} />
                </ScrollView>
            </FormInfoParent>

        );
    }
}
