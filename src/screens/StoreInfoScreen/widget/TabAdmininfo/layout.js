import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';

import {
    Dropdown,
    ButtonCustom, Button, Text
} from '../../../../components';
import { scaleSzie } from '../../../../utils';
import IMAGE from '../../../../resources';
import { ItemAdminInfo, ItemWorkingTime, ItemScalary } from '../componentTab';

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
            cellphone, email
        } = this.state.user;
        const { street, city, state } = address;
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
                                value={data[0].value}
                                onChangeText={(value) => this.updateUserInfo('state', value, 'address')}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#6A6A6A',
                                    flex: 1
                                }}
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
                    />
                    <ItemAdminInfo
                        title="Confirm PIN *"
                        placeholder="********"
                    />
                    <ItemAdminInfoRole />
                    <TitleTabAdminInfo
                        title="Working time"
                    />
                    <ItemWorkingTime
                        title="Tuesday"
                    />
                    {/* ----- Salary ---- */}
                    <TitleTabAdminInfo
                        title="Salary"
                    />
                    <ItemScalary
                        title="Per hour ($)"
                        placeholder="100"
                    />
                    <ItemScalary
                        title="Commission (%)"
                        placeholder="10"
                    />
                    {/* ----- Tip fee ---- */}

                    <TitleTabAdminInfo
                        title="Tip fee"
                    />
                    <ItemScalary
                        title="Per hour ($)"
                        placeholder="100"
                    />
                    <ItemScalary
                        title="Commission (%)"
                        placeholder="10"
                    />
                    {/* ---- Address ---- */}
                    <ItemAdminInfo
                        title="Driver license"
                        placeholder="0000-0000-0000"
                    />
                    <ItemAdminInfo
                        title="Social security number"
                        placeholder="0000-0000-0000"
                    />
                    <ItemAdminInfo
                        title="Professional license"
                        placeholder="0000-0000-0000"
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
                        onPress={this.nextTab}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title="NEXT"
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

const ItemAdminInfoRole = ({ }) => {
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
                        <Dropdown
                            label='Staff'
                            data={data}
                            containerStyle={{
                                backgroundColor: '#F1F1F1',
                                borderWidth: 1,
                                borderColor: '#6A6A6A',
                                flex: 1
                            }}
                        />
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
                        <Dropdown
                            label='Active'
                            data={data}
                            containerStyle={{
                                backgroundColor: '#F1F1F1',
                                borderWidth: 1,
                                borderColor: '#6A6A6A',
                                flex: 1
                            }}
                        />
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
    }

})

export default Layout;
