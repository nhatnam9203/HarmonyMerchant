import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text'

import {
    Dropdown,
    Text, ButtonCustom
} from '@components';
import { scaleSzie, localize, Roles, Status } from '@utils';
import { ItemAdminInfo, } from '../componentTab';
import ItemWorkingTime from '../ItemWorkingTime';
import ItemScalary from '../ItemScalary';

let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}
];

class Layout extends React.Component {

    renderBody() {
        const { address, firstName, lastName, displayName,
            cellphone, email, pin, confirmPin, roles,
            driverlicense, socialSecurityNumber, professionalLicense,
            status
        } = this.state.user;
        const { street, city, state } = address;
        const { nameRole } = roles;
        const { language } = this.props;
        return (
            <View style={styles.body} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ height: scaleSzie(30) }} />
                    <ItemAdminInfoDoubleItem
                        title={`${localize('Name', language)} *`}
                        placeholder={localize('First Name', language)}
                        value={firstName}
                        onChangeText={(value) => this.updateUserInfo('firstName', value)}
                    >
                        <View style={{
                            flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingLeft: scaleSzie(5),
                            marginLeft: scaleSzie(5)
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                                placeholder={localize('Last Name', language)}
                                value={lastName}
                                onChangeText={value => this.updateUserInfo('lastName', value)}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    <ItemAdminInfoDoubleItem
                        title={`${localize('Display Name', language)} *`}
                        placeholder={localize('Display Name', language)}
                        value={displayName}
                        onChangeText={(value) => this.updateUserInfo('displayName', value)}
                    />

                    <ItemAdminInfo
                        title={localize('Address', language)}
                        placeholder={localize('Street', language)}
                        value={street}
                        onChangeText={(value) => this.updateUserInfo('street', value, 'address')}
                    />

                    <ItemAdminInfoDoubleItem
                        title=""
                        placeholder={localize('City', language)}
                        value={city}
                        onChangeText={(value) => this.updateUserInfo('city', value, 'address')}
                    >
                        <View style={{
                            flex: 1,
                            marginLeft: scaleSzie(5)
                        }} >
                            <Dropdown
                                label={localize('State', language)}
                                data={data}
                                value={state}
                                onChangeText={(value) => this.updateUserInfo('state', value, 'address')}
                                containerStyle={styles.dropdown}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    <ItemAdminInfo
                        type={true}
                        title={`${localize('Cell phone', language)}*`}
                        placeholder={localize('Phone number', language)}
                        value={cellphone}
                        onChangeText={(value) => this.updateUserInfo('cellphone', value)}

                    />
                    <ItemAdminInfo
                        title={`${localize('Contact email', language)}*`}
                        placeholder={localize('Email', language)}
                        value={email}
                        onChangeText={(value) => this.updateUserInfo('email', value)}
                    />
                    <ItemAdminInfo
                        type={true}
                        title={`${localize('Create PIN', language)}*`}
                        placeholder="****"
                        value={pin}
                        onChangeText={(value) => this.updateUserInfo('pin', value)}
                        secureTextEntry={true}
                        maxLength={4}
                    />
                    <ItemAdminInfo
                        title={`${localize('Confirm PIN', language)}*`}
                        placeholder="****"
                        value={confirmPin}
                        onChangeText={(value) => this.updateUserInfo('confirmPin', value)}
                        secureTextEntry={true}
                        maxLength={4}
                        type={true}
                    />
                    <ItemAdminInfoRole
                        DropdowAdmin={() => <Dropdown
                            label={localize('Admin', language)}
                            data={Roles}
                            value={nameRole}
                            onChangeText={(value) => this.updateUserInfo('nameRole', value, 'roles')}
                            containerStyle={styles.dropdown}
                        />}
                        DropdowStatusAdmin={() => <Dropdown
                            label={localize('Status', language)}
                            data={Status}
                            value={status}
                            onChangeText={(value) => this.updateUserInfo('status', value)}
                            containerStyle={styles.dropdown}
                        />}
                    />
                    <TitleTabAdminInfo
                        title={localize('Working time', language)}
                    />
                    {
                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                            'Friday', 'Sarturday', 'Sunday'
                        ].map((day, index) => {
                            return <ItemWorkingTime
                                ref={this.setRefTimeWorking}
                                key={index}
                                ref={this.setRefTimeWorking}
                                title={day}
                            />
                        })
                    }

                    {/* ----- Salary ---- */}
                    <TitleTabAdminInfo
                        title={localize('Salary', language)}
                    />
                    {
                        [{ title: 'Per hour ($)', placeholder: '100' },
                        { title: 'Commission (%)', placeholder: '10' }
                        ].map((salary, index) => {
                            return <ItemScalary
                                key={index}
                                ref={this.setRefSalary}
                                title={salary.title}
                                placeholder={salary.placeholder}
                            />
                        })
                    }

                    {/* ----- Tip fee ---- */}
                    <TitleTabAdminInfo
                        title={localize('Tip fee', language)}
                    />
                    {
                        [{ title: `${localize('Percent', language)} (%)`, placeholder: '100' },
                        { title: `${localize('Fixed amount', language)} ($)`, placeholder: '10' }
                        ].map((salary, index) => {
                            return <ItemScalary
                                key={index}
                                ref={this.setRefTip}
                                title={salary.title}
                                placeholder={salary.placeholder}
                            />
                        })
                    }


                    {/* ---- Address ---- */}
                    <ItemAdminInfo
                        title={localize('Driver license', language)}
                        placeholder="0000-0000-0000"
                        value={driverlicense}
                        onChangeText={(value) => this.updateUserInfo('driverlicense', value)}
                        type={true}
                    />
                    <ItemAdminInfo
                        title={localize('Social security number', language)}
                        placeholder="0000-0000-0000"
                        value={socialSecurityNumber}
                        onChangeText={(value) => this.updateUserInfo('socialSecurityNumber', value)}
                        type={true}
                    />
                    <ItemAdminInfo
                        title={localize('Professional license', language)}
                        placeholder="0000-0000-0000"
                        value={professionalLicense}
                        onChangeText={(value) => this.updateUserInfo('professionalLicense', value)}
                        type={true}
                    />
                    <View style={{
                        height: scaleSzie(70), paddingHorizontal: scaleSzie(25),
                        justifyContent: 'center', alignItems: 'flex-end'
                    }} >
                        <ButtonCustom
                            width={scaleSzie(120)}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('ADD', language)}
                            textColor="#6A6A6A"
                            onPress={this.addStaff}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                backgroundColor: '#0764B0'
                            }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500', color: '#fff' }}
                        />
                    </View>
                    <View style={{ height: scaleSzie(300) }} />
                </ScrollView>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container} >
                {this.renderBody()}
            </View>

        );
    }
}


const ItemAdminInfoDoubleItem = ({ title, placeholder, children, value, onChangeText }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(14)
        }} >
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',

                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingLeft: scaleSzie(5) }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value => onChangeText(value))}
                    />
                </View>

                <View style={{ flex: 1, }} >
                    {children}
                </View>
            </View>
        </View>
    );
}

const ItemAdminInfoRole = ({ DropdowAdmin, DropdowStatusAdmin }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(14)
        }} >
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',

                }}  >
                    {`Roles`}
                </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1.3, flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        {DropdowAdmin()}
                    </View>
                    <View style={{ flex: 1 }} />
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ justifyContent: 'center' }} >
                        <Text style={{
                            color: '#404040',
                            fontSize: scaleSzie(14),
                            fontWeight: '600',

                        }}  >
                            {`Status`}
                        </Text>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 20 }} >
                        {DropdowStatusAdmin()}
                    </View>
                </View>
            </View>
        </View>
    );
}

const TitleTabAdminInfo = ({ title }) => {
    return (
        <View style={{
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(14)
        }} >
            <Text style={{
                color: '#404040',
                fontSize: scaleSzie(14),
                fontWeight: '600',

            }}  >
                {`${title}`}
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
    borderTextInput: {
        borderWidth: 1,
        borderColor: '#6A6A6A'
    },
    dropdown: {
        backgroundColor: '#F1F1F1',
        borderWidth: 1,
        borderColor: '#6A6A6A',
        flex: 1
    }

})

export default Layout;
