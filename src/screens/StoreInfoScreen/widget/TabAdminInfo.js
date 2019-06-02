import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput
} from 'react-native';
// import { Dropdown } from 'react-native-material-dropdown';

import { 
    Dropdown,
     ButtonCustom, Button, Text } from '../../../components';
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
                                    flex:1
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
    }

})

export default TabStoreInfo;
