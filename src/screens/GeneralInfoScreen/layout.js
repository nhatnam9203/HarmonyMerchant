import React from 'react';
import {
    View,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { InputForm, FormInfoParent, Text, Dropdown ,InputFormPhone} from '@components';
import { scaleSzie, localize,getArrayNameStateCity } from '@utils';

export default class Layout extends React.Component {

    render() {
        const { generalInfo } = this.state;
        const {
            businessName, doingBusiness, tax, businessAddress, businessPhone, email,
            firstName, lastName, position, contactPhone
        } = generalInfo;
        const { prefix, suffix } = tax;
        const { address, city, state, zip } = businessAddress;
        const { language ,stateCity} = this.props;
        return (
            <FormInfoParent
                title={localize('General Information', language)}
                back={() => this.props.navigation.goBack()}
                next={this.nextTab}

            >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <InputForm
                        title={localize('Legal Business Name * ', language)}
                        subTitle={localize('(as shown on your income tax return)', language)}
                        placeholder={localize('Legal Business Name *', language)}
                        value={businessName}
                        onChangeText={(value) => this.updateGeneralInfo('businessName', value)}
                    />
                    <InputForm
                        title={localize('Doing Business As Name (DBA) *', language)}
                        subTitle=""
                        placeholder="DBA"
                        value={doingBusiness}
                        onChangeText={(value) => this.updateGeneralInfo('doingBusiness', value)}
                    />
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(100) }} >
                            <InputForm
                                title={localize('Federal Tax ID *', language)}
                                subTitle=""
                                placeholder=""
                                value={prefix}
                                onChangeText={(value) => this.updateGeneralInfo('prefix', value, 'tax')}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ width: scaleSzie(20), justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(20) }} >
                                -
                                </Text>
                        </View>
                        <View style={{ width: scaleSzie(250) }} >
                            <InputForm
                                title="   "
                                subTitle=""
                                placeholder=""
                                value={suffix}
                                onChangeText={(value) => this.updateGeneralInfo('suffix', value, 'tax')}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <InputForm
                        title={localize('DBA Business Address *', language)}
                        subTitle="(no P.O. Box)"
                        placeholder="DBA address"
                        style={{
                            marginBottom: scaleSzie(10)
                        }}
                        value={address}
                        onChangeText={(value) => this.updateGeneralInfo('address', value, 'businessAddress')}
                    />
                    <View style={{
                        height: scaleSzie(30), marginBottom: scaleSzie(24), justifyContent: 'space-between',
                        flexDirection: 'row', alignItems: 'flex-end'
                    }} >
                        <View style={{ width: scaleSzie(180) }} >
                            <InputForm
                                title=""
                                subTitle=""
                                placeholder="City"
                                style={{
                                    marginBottom: 0
                                }}
                                value={city}
                                onChangeText={(value) => this.updateGeneralInfo('city', value, 'businessAddress')}
                            />
                        </View>
                        <View style={{ width: scaleSzie(180), backgroundColor: 'red' }} >
                            <Dropdown
                                label={'State'}
                                data={getArrayNameStateCity(stateCity)}
                                value={state}
                                onChangeText={(value) => this.updateGeneralInfo('state', value, 'businessAddress')}
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
                                onChangeText={(value) => this.updateGeneralInfo('zip', value, 'businessAddress')}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                        <View style={{ flex: 1 }} >
                            <InputFormPhone
                                ref={this.businessPhoneRef}
                                title={localize('Business Phone Number *', language)}
                                subTitle=""
                                placeholder=""
                                value={businessPhone}
                                onChangeText={(value) => this.updateGeneralInfo('businessPhone', value)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>

                    <InputForm
                        title={localize('Contact is  Email Address *', language)}
                        subTitle=""
                        placeholder="example@gmail.com"
                        value={email}
                        onChangeText={(value) => this.updateGeneralInfo('email', value)}
                    />

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                title={localize('Contact Name *', language)}
                                subTitle=""
                                placeholder="First name"
                                value={firstName}
                                onChangeText={(value) => this.updateGeneralInfo('firstName', value)}
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                            <InputForm
                                title="   "
                                subTitle=""
                                placeholder="Last name"
                                value={lastName}
                                onChangeText={(value) => this.updateGeneralInfo('lastName', value)}
                            />
                        </View>
                    </View>
                    <InputForm
                        title={localize('Title/Position *', language)}
                        subTitle=""
                        placeholder="Manager"
                        value={position}
                        onChangeText={(value) => this.updateGeneralInfo('position', value)}
                    />

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            {/* <InputForm
                                isOnlyNumber={true}
                                title={localize('Contact is Phone Number *', language)}
                                subTitle=""
                                placeholder=""
                                value={contactPhone}
                                onChangeText={(value) => this.updateGeneralInfo('contactPhone', value)}
                                keyboardType="numeric"
                            /> */}
                             <InputFormPhone
                                ref={this.contactPhoneRef}
                                title={localize('Contact Phone Number *', language)}
                                subTitle=""
                                placeholder=""
                                value={contactPhone}
                                onChangeText={(value) => this.updateGeneralInfo('contactPhone', value)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                </View>
            </FormInfoParent>

        );
    }
}
