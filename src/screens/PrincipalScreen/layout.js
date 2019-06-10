import React from 'react';
import {
    View,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import { InputForm, FormInfoParent, Text, Dropdown, Button, PopupUpload } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';

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
        return (
            <FormInfoParent
                title="Principal Information"
                back={() => this.props.navigation.goBack()}
                next={this.nextScreen}

            >
                <View style={{ paddingHorizontal: scaleSzie(16), marginTop: scaleSzie(10) }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                        Provide the following information for each individual who owns, directly or indirectly,
                         25% or more of the equity interest of your business.
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
                                title="Principal Name *"
                                subTitle=""
                                placeholder="First name"
                                value={firstName}
                                onChangeText={(value) => this.updatePrincipalInfo('firstName', value)}
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                            <InputForm
                                title="   "
                                subTitle=""
                                placeholder="Last name"
                                value={lastName}
                                onChangeText={(value) => this.updatePrincipalInfo('lastName', value)}

                            />
                        </View>
                    </View>

                    <InputForm
                        title="Title/Position *"
                        subTitle=""
                        placeholder="Manager"
                        value={position}
                        onChangeText={(value) => this.updatePrincipalInfo('position', value)}
                    />
                    <InputForm
                        title="Ownership (%) *"
                        subTitle=""
                        placeholder=""
                        value={ownership}
                        onChangeText={(value) => this.updatePrincipalInfo('ownership', value)}
                    />

                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <InputForm
                                title="Home Phone *"
                                subTitle=""
                                placeholder=""
                                value={homePhone}
                                onChangeText={(value) => this.updatePrincipalInfo('homePhone', value)}
                            />
                        </View>
                        <View style={{ flex: 1, paddingLeft: scaleSzie(20) }} >
                            <InputForm
                                title="Mobile Phone"
                                subTitle=""
                                placeholder=""
                                value={mobilePhone}
                                onChangeText={(value) => this.updatePrincipalInfo('mobilePhone', value)}
                            />
                        </View>
                    </View>

                    <InputForm
                        title="Address *"
                        subTitle=""
                        placeholder="Home address"
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
                                placeholder="City"
                                style={{
                                    marginBottom: 0
                                }}
                                value={city}
                                onChangeText={(value) => this.updatePrincipalInfo('city', value, 'addressPrincipal')}
                            />
                        </View>
                        <View style={{ width: scaleSzie(180), backgroundColor: 'red' }} >
                            <Dropdown
                                label={'State'}
                                data={data}
                                value={state}
                                onChangeText={(value) => this.updatePrincipalInfo('state', value, 'addressPrincipal')}
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
                                onChangeText={(value) => this.updatePrincipalInfo('zip', value, 'addressPrincipal')}
                            />
                        </View>
                    </View>

                    <InputForm
                        title="Years at This Address *"
                        subTitle=""
                        placeholder=""
                        value={yearAtThisAddress}
                        onChangeText={(value) => this.updatePrincipalInfo('yearAtThisAddress', value)}
                    />
                    <InputForm
                        title="Social Security Number (SSN) *"
                        subTitle=""
                        placeholder=""
                        value={ssn}
                        onChangeText={(value) => this.updatePrincipalInfo('ssn', value)}
                    />
                    {/* ------ thieu ----- */}
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(6) }} >
                        Date of Birth (dd/mm/yy) *
                            </Text>
                    <View style={{
                        height: scaleSzie(30), marginBottom: scaleSzie(24),
                        flexDirection: 'row', alignItems: 'flex-end'
                    }} >
                        <View style={{ width: scaleSzie(120) }} >
                            <Dropdown
                                label={'day'}
                                data={[{ value: '1' }, { value: '2' }, { value: '3' }]}
                                value={day}
                                onChangeText={(value) => this.updatePrincipalInfo('day', value, 'dateOfBirth')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#6A6A6A',
                                    flex: 1
                                }}
                            />
                        </View>
                        <View style={{ width: scaleSzie(120), marginHorizontal: scaleSzie(20) }} >
                            <Dropdown
                                label={'Month'}
                                data={[{ value: '1' }, { value: '2' }, { value: '3' }]}
                                value={month}
                                onChangeText={(value) => this.updatePrincipalInfo('month', value, 'dateOfBirth')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#6A6A6A',
                                    flex: 1
                                }}
                            />
                        </View>
                        <View style={{ width: scaleSzie(120) }} >
                            <Dropdown
                                label={'Year'}
                                data={[{ value: '1990' }, { value: '1991' }, { value: '1992' }]}
                                value={year}
                                onChangeText={(value) => this.updatePrincipalInfo('year', value, 'dateOfBirth')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#6A6A6A',
                                    flex: 1
                                }}
                            />
                        </View>
                    </View>

                    {/* ------------- */}
                    <InputForm
                        title="Email Address *"
                        subTitle=""
                        placeholder="example@gmail.com"
                        value={email}
                        onChangeText={(value) => this.updatePrincipalInfo('email', value)}

                    />
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1, paddingRight: scaleSzie(20) }} >
                            <InputForm
                                title="Driver License Number *"
                                subTitle=""
                                placeholder=""
                                value={driverLicense}
                                onChangeText={(value) => this.updatePrincipalInfo('driverLicense', value)}
                            />
                        </View>
                        <View style={{ width: scaleSzie(180), }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginBottom: scaleSzie(5) }} >
                                State Issued *
                            </Text>
                            <Dropdown
                                label={'2000'}
                                data={data}
                                value={stateIssued}
                                onChangeText={(value) => this.updatePrincipalInfo('stateIssued', value)}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#6A6A6A',
                                    width: scaleSzie(180),
                                    height: scaleSzie(30)
                                }}
                            />
                        </View>
                    </View>

                    {/* ------ Take Photo ---- */}

                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                        Please take or upload photos of Driver License
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
                                            color: '#6A6A6A', fontSize: scaleSzie(20), fontWeight: 'bold',
                                        }} >
                                            Take a Photo
            </Text>

                                        <Text style={{
                                            color: '#6A6A6A', fontSize: scaleSzie(20),
                                        }} >
                                            Or
            </Text>
                                        <Button
                                            onPress={this.openImageLibrary}
                                            style={{
                                                width: scaleSzie(180), height: scaleSzie(40), backgroundColor: '#F1F1F1',
                                                borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4, justifyContent: "center", alignItems: 'center'
                                            }} >
                                            <Text style={{
                                                color: '#6A6A6A', fontSize: scaleSzie(20),
                                            }} >
                                                Browse File
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
                    title="File Upload"
                    message="Do you want to Archive this Category ?"
                    onRequestClose={() => this.setState({ visibleUpload: false, uriUpload: '' })}
                    uri={this.state.uriUpload}
                    save={this.saveFileUpload}
                />
            </FormInfoParent>

        );
    }
}
