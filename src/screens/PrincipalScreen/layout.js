import React from 'react';
import {
    View,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import { InputForm, FormInfoParent, Text, Dropdown, Button, PopupUpload } from '@components';
import { scaleSzie, localize,getArrayNameStateCity } from '@utils';
import IMAGE from '@resources';

let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}
];

export default class Layout extends React.Component {

    render() {
        const { principalInfo } = this.state;
        const {
            firstName, lastName, position, ownership, homePhone, mobilePhone, addressPrincipal,
            yearAtThisAddress, ssn, dateOfBirth, email, driverLicense, stateIssued
        } = principalInfo;
        const {
            address, city, state, zip
        } = addressPrincipal;
        const { day, month, year } = dateOfBirth;
        const { language,stateCity } = this.props;
        return (
            <FormInfoParent
                title={localize('Principal Information', language)}
                back={() => this.props.navigation.goBack()}
                next={this.nextScreen}

            >
                <View style={{ paddingHorizontal: scaleSzie(16), marginTop: scaleSzie(10) }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                        {localize('Principal Des', language)}
                    </Text>
                </View>

                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <Text style={{
                        color: '#404040', fontSize: scaleSzie(18), fontWeight: 'bold',
                        marginBottom: scaleSzie(10)
                    }} >
                        Principal 1 *
                            </Text>

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                title={localize('Principal Name *', language)}
                                subTitle=""
                                placeholder={localize('First name', language)}
                                value={firstName}
                                onChangeText={(value) => this.updatePrincipalInfo('firstName', value)}
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                            <InputForm
                                title="   "
                                subTitle=""
                                placeholder={localize('Last name', language)}
                                value={lastName}
                                onChangeText={(value) => this.updatePrincipalInfo('lastName', value)}

                            />
                        </View>
                    </View>

                    <InputForm
                        title={localize('Title/Position *', language)}
                        subTitle=""
                        placeholder={localize('Manager', language)}
                        value={position}
                        onChangeText={(value) => this.updatePrincipalInfo('position', value)}
                    />
                    <InputForm
                        title={localize('Ownership (%) *', language)}
                        subTitle=""
                        placeholder=""
                        value={ownership}
                        onChangeText={(value) => this.updatePrincipalInfo('ownership', value)}
                    />

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                isOnlyNumber={true}
                                title={localize('Home Phone *', language)}
                                subTitle=""
                                placeholder=""
                                value={homePhone}
                                onChangeText={(value) => this.updatePrincipalInfo('homePhone', value)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                            <InputForm
                                isOnlyNumber={true}
                                title={localize('Mobile Phone', language)}
                                subTitle=""
                                placeholder=""
                                value={mobilePhone}
                                onChangeText={(value) => this.updatePrincipalInfo('mobilePhone', value)}
                                keyboardType="numeric"
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
                            />
                        </View>
                        <View style={{ width: scaleSzie(180), backgroundColor: 'red' }} >
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
                            />
                        </View>
                    </View>

                    <InputForm
                        isOnlyNumber={true}
                        title={localize('Years at This Address *')}
                        subTitle=""
                        placeholder=""
                        value={yearAtThisAddress}
                        onChangeText={(value) => this.updatePrincipalInfo('yearAtThisAddress', value)}
                        keyboardType="numeric"
                        maxLength={4}
                    />
                    <InputForm
                        isOnlyNumber={true}
                        title={localize('Social Security Number (SSN) *', language)}
                        subTitle=""
                        placeholder=""
                        value={ssn}
                        onChangeText={(value) => this.updatePrincipalInfo('ssn', value)}
                        keyboardType="numeric"
                    />
                    {/* ------ thieu ----- */}
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(6) }} >
                        {localize('Date of Birth (dd/mm/yy) *', language)}
                    </Text>
                    <View style={{
                        height: scaleSzie(30), marginBottom: scaleSzie(24),
                        flexDirection: 'row', alignItems: 'flex-end'
                    }} >
                        <View style={{ width: scaleSzie(120) }} >
                            <Dropdown
                                label={localize('day', language)}
                                data={[{ value: '1' }, { value: '2' }, { value: '3' }]}
                                value={day}
                                onChangeText={(value) => this.updatePrincipalInfo('day', value, 'dateOfBirth')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    flex: 1
                                }}
                            />
                        </View>
                        <View style={{ width: scaleSzie(120), marginHorizontal: scaleSzie(20) }} >
                            <Dropdown
                                label={localize('Month', language)}
                                data={[{ value: '1' }, { value: '2' }, { value: '3' }]}
                                value={month}
                                onChangeText={(value) => this.updatePrincipalInfo('month', value, 'dateOfBirth')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    flex: 1
                                }}
                            />
                        </View>
                        <View style={{ width: scaleSzie(120) }} >
                            <Dropdown
                                label={localize('Year', language)}
                                data={[{ value: '1990' }, { value: '1991' }, { value: '1992' }]}
                                value={year}
                                onChangeText={(value) => this.updatePrincipalInfo('year', value, 'dateOfBirth')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    flex: 1
                                }}
                            />
                        </View>
                    </View>

                    {/* ------------- */}
                    <InputForm
                        title={localize('Email Address *')}
                        subTitle=""
                        placeholder="example@gmail.com"
                        value={email}
                        onChangeText={(value) => this.updatePrincipalInfo('email', value)}

                    />
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1, paddingRight: scaleSzie(20) }} >
                            <InputForm
                                isOnlyNumber={true}
                                title={localize('Driver License Number *', language)}
                                subTitle=""
                                placeholder=""
                                value={driverLicense}
                                onChangeText={(value) => this.updatePrincipalInfo('driverLicense', value)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ width: scaleSzie(180), }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(5) }} >
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
                            />
                        </View>
                    </View>

                    {/* ------ Take Photo ---- */}

                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                        {localize('Please take or upload photos of Driver License', language)}
                    </Text>

                    <View style={{
                        alignItems: 'center',
                        padding: scaleSzie(10), marginTop: scaleSzie(18)
                    }} >
                        {
                            this.state.savaFileUpload ?
                                <View style={{
                                    width: scaleSzie(400), height: scaleSzie(200),
                                    overflow: 'hidden'
                                }} >
                                    <Image
                                        source={{ uri: this.state.uriUpload }}
                                        style={{ width: null, height: null, flex: 1 }}
                                    />
                                </View> :

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
                        }
                    </View>

                    {/* ---------------------- */}
                </View>
                <PopupUpload
                    visible={this.state.visibleUpload}
                    title={localize('File Upload', language)}
                    message="Do you want to Archive this Category ?"
                    onRequestClose={() => this.setState({ visibleUpload: false, uriUpload: '' })}
                    uri={this.state.uriUpload}
                    save={this.saveFileUpload}
                />
            </FormInfoParent>

        );
    }
}
