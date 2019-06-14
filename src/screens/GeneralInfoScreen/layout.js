import React from 'react';
import {
    View,
} from 'react-native';

import { InputForm, FormInfoParent, Text, Dropdown } from '@components';
import { scaleSzie } from '@utils';

export default class Layout extends React.Component {

    render() {
        const { generalInfo } = this.state;
        const {
            businessName, doingBusiness, tax, businessAddress, businessPhone, email,
            firstName, lastName, position, contactPhone
        } = generalInfo;
        const { prefix, suffix } = tax;
        const { address, city, state, zip } = businessAddress
        return (
            <FormInfoParent
                title="General Information"
                back={() => this.props.navigation.goBack()}
                next={this.nextTab}

            >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <InputForm
                        title="Legal Business Name * "
                        subTitle="(as shown on your income tax return)"
                        placeholder="Legal Business Name"
                        value={businessName}
                        onChangeText={(value) => this.updateGeneralInfo('businessName', value)}
                    />
                    <InputForm
                        title="Doing Business As Name (DBA) *"
                        subTitle=""
                        placeholder="DBA"
                        value={doingBusiness}
                        onChangeText={(value) => this.updateGeneralInfo('doingBusiness', value)}
                    />
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(100) }} >
                            <InputForm
                                title="Federal Tax ID *"
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
                        title="DBA Business Address *"
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
                                data={[{value:'1'},{value:'2'},{value:3},{value:'4'}]}
                                value={state}
                                onChangeText={(value) => this.updateGeneralInfo('state', value, 'businessAddress')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#6A6A6A',
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
                            <InputForm
                                title="Business Phone Number *"
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
                        title="Contact's  Email Address *"
                        subTitle=""
                        placeholder="example@gmail.com"
                        value={email}
                        onChangeText={(value) => this.updateGeneralInfo('email', value)}
                    />

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                title="Contact Name *"
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
                        title="Title/Position *"
                        subTitle=""
                        placeholder="Manager"
                        value={position}
                        onChangeText={(value) => this.updateGeneralInfo('position', value)}
                    />

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                title="Contact's Phone Number *"
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
