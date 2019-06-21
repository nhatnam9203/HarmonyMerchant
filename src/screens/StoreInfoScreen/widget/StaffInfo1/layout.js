import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';

import {
    Dropdown,
    ButtonCustom, Text
} from '@components';
import { scaleSzie } from '@utils';
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
            driverlicense, socialSecurityNumber, professionalLicense
        } = this.state.user;
        const { street, city, state } = address;
        const { nameRole, statusRole } = roles
        return (
            <View style={styles.body} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ height: scaleSzie(30) }} />
                    <ItemAdminInfoDoubleItem
                        title="Name *"
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={(value) => this.updateUserInfo('firstName', value)}
                    >
                        <View style={{
                            flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingLeft: scaleSzie(5),
                            marginLeft: scaleSzie(5)
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                                placeholder={'Last Name'}
                                value={lastName}
                                onChangeText={value => this.updateUserInfo('lastName', value)}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    <ItemAdminInfoDoubleItem
                        title="Display Name *"
                        placeholder="Display Name"
                        value={displayName}
                        onChangeText={(value) => this.updateUserInfo('displayName', value)}
                    />

                    <ItemAdminInfo
                        title="Address"
                        placeholder="Street"
                        value={street}
                        onChangeText={(value) => this.updateUserInfo('street', value, 'address')}
                    />

                    <ItemAdminInfoDoubleItem
                        title=""
                        placeholder="City"
                        value={city}
                        onChangeText={(value) => this.updateUserInfo('city', value, 'address')}
                    >
                        <View style={{
                            flex: 1,
                            marginLeft: scaleSzie(5)
                        }} >
                            <Dropdown
                                label='State'
                                data={data}
                                value={state}
                                onChangeText={(value) => this.updateUserInfo('state', value, 'address')}
                                containerStyle={styles.dropdown}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    <ItemAdminInfo
                        title="Cell phone *"
                        placeholder="Phone number"
                        value={cellphone}
                        onChangeText={(value) => this.updateUserInfo('cellphone', value)}

                    />
                    <ItemAdminInfo
                        title="Contact email *"
                        placeholder="Email"
                        value={email}
                        onChangeText={(value) => this.updateUserInfo('email', value)}
                    />
                    <ItemAdminInfo
                        title="Create PIN *"
                        placeholder="********"
                        value={pin}
                        onChangeText={(value) => this.updateUserInfo('pin', value)}
                        secureTextEntry={true}
                    />
                    <ItemAdminInfo
                        title="Confirm PIN *"
                        placeholder="********"
                        value={confirmPin}
                        onChangeText={(value) => this.updateUserInfo('confirmPin', value)}
                        secureTextEntry={true}
                    />
                    <ItemAdminInfoRole
                        DropdowAdmin={() => <Dropdown
                            label='Admin'
                            data={data}
                            value={nameRole}
                            onChangeText={(value) => this.updateUserInfo('nameRole', value, 'roles')}
                            containerStyle={styles.dropdown}
                        />}
                        DropdowStatusAdmin={() => <Dropdown
                            label='Status'
                            data={data}
                            value={statusRole}
                            onChangeText={(value) => this.updateUserInfo('statusRole', value, 'roles')}
                            containerStyle={styles.dropdown}
                        />}
                    />
                    <TitleTabAdminInfo
                        title="Working time"
                    />
                    {
                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                            'Friday', 'Sarturday', 'Sunday'
                        ].map((day, index) => {
                            return <ItemWorkingTime
                                key={index}
                                ref={this.setRefTimeWorking}
                                title={day}
                            />
                        })
                    }

                    {/* ----- Salary ---- */}
                    <TitleTabAdminInfo
                        title="Salary"
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
                        title="Tip fee"
                    />
                    {
                        [{ title: 'Percent (%)', placeholder: '100' },
                        { title: 'Fixed amount ($)', placeholder: '10' }
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
                        title="Driver license"
                        placeholder="0000-0000-0000"
                        value={driverlicense}
                        onChangeText={(value) => this.updateUserInfo('driverlicense', value)}
                    />
                    <ItemAdminInfo
                        title="Social security number"
                        placeholder="0000-0000-0000"
                        value={socialSecurityNumber}
                        onChangeText={(value) => this.updateUserInfo('socialSecurityNumber', value)}
                    />
                    <ItemAdminInfo
                        title="Professional license"
                        placeholder="0000-0000-0000"
                        value={professionalLicense}
                        onChangeText={(value) => this.updateUserInfo('professionalLicense', value)}
                    />
                    <View style={{ height: scaleSzie(300) }} />
                </ScrollView>
            </View>
        );
    }

    renderFooter() {
        return (
            <View style={styles.footer} >
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title="BACK"
                        textColor="#6A6A6A"
                        onPress={() =>this.props.backTabelStaff()}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title="ADD"
                        textColor="#fff"
                        onPress={this.nextTab}
                    />
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container} >
                {this.renderBody()}
                {this.renderFooter()}
            </View>

        );
    }
}


const ItemAdminInfoDoubleItem = ({ title, placeholder, children, value, onChangeText }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
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
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
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
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
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
