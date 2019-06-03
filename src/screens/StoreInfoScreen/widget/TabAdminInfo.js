import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput
} from 'react-native';

import {
    Dropdown,
    ButtonCustom, Button, Text
} from '../../../components';
import { scaleSzie } from '../../../utils';

let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}, {
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
},
{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}

];

class TabStoreInfo extends React.Component {


    renderBody() {
        return (
            <View style={styles.body} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <ItemAdminInfoDoubleItem
                        title="Name *"
                        placeholder="First Name"
                    >
                        <View style={{
                            flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingLeft: scaleSzie(5),
                            marginLeft: scaleSzie(5)
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                                placeholder={'Last Name'}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    <ItemAdminInfoDoubleItem
                        title="Display Name *"
                        placeholder="Display Name"
                    />

                    <ItemAdminInfo
                        title="Address"
                        placeholder="Street"
                    />

                    <ItemAdminInfoDoubleItem
                        title=""
                        placeholder="City"
                    >
                        <View style={{
                            flex: 1,
                            marginLeft: scaleSzie(5)
                        }} >
                            <Dropdown
                                label='State'
                                data={data}
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
                    />
                    <ItemAdminInfo
                        title="Contact email *"
                        placeholder="Email"
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

    nextTab = () => {

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

const ItemAdminInfo = ({ title, placeholder }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
            marginTop: scaleSzie(25)
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

            <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingLeft: scaleSzie(5) }} >
                <TextInput
                    style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                    placeholder={placeholder}
                />
            </View>
        </View>
    );
}

const ItemAdminInfoDoubleItem = ({ title, placeholder, children }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
            marginTop: scaleSzie(25)
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
            marginTop: scaleSzie(25)
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
            marginTop: scaleSzie(25)
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

const ItemWorkingTime = ({ title }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
            marginTop: scaleSzie(25)
        }} >
            <View style={{ width: scaleSzie(30), justifyContent: 'center' }} >
                <View style={{ width: scaleSzie(15), height: scaleSzie(15), backgroundColor: 'red' }}  >

                </View>
            </View>

            <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',
                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ width: scaleSzie(150) }} >
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
            <View style={{ justifyContent: 'center', paddingHorizontal: scaleSzie(8) }} >
                <View style={{
                    backgroundColor: '#404040',
                    width: scaleSzie(12),
                    height: 1
                }}  >
                </View>
            </View>
            <View style={{ width: scaleSzie(150) }} >
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
        </View>
    );
}

const ItemScalary = ({ title, placeholder }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
            marginTop: scaleSzie(25)
        }} >
            <View style={{ width: scaleSzie(30), justifyContent: 'center' }} >
                <View style={{ width: scaleSzie(15), height: scaleSzie(15), backgroundColor: 'red' }}  >

                </View>
            </View>

            <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',
                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={[{ width: scaleSzie(150), paddingLeft: scaleSzie(5) }, styles.borderTextInput]} >
                <TextInput
                    style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                    placeholder={placeholder}
                />
            </View>
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

export default TabStoreInfo;
