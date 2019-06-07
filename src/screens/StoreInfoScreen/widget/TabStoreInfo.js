import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { ButtonCustom, Text } from '../../../components';
import { scaleSzie } from '../../../utils';


class TabAdminInfo extends React.Component {

    renderBody() {
        return (
            <View style={styles.body} >
                <ScrollView>
                    <ItemTextStoreInfo
                        title="Business Name"
                        value="Harmony Spa"
                    />
                    <ItemTextStoreInfoNotTilte
                        city="NewYork"
                        state="NewYork"
                        zipcode="10001"
                    />
                    <ItemTextStoreInfo
                        title="Business Address"
                        value="7550 High Ridge Avenue Perkasie, PA 18944"
                    />
                    <ItemTextStoreInfo
                        title="Federal Tax Id"
                        value="P80710660"
                    />
                    <ItemTextStoreInfo
                        title="Phone Number"
                        value="654-734-2840"
                    />
                    <ItemTextStoreInfo
                        title="Contact Email"
                        value="harmonyspa@gmail.com"
                    />
                    <ItemTextStoreInfo
                        title="Bank Name"
                        value="Harmony Bank"
                    />
                    <ItemTextStoreInfo
                        title="Account Number"
                        value="011401533"
                    />
                    <ItemTextStoreInfo
                        title="Routing Number"
                        value="129131673"
                    />
                    <ItemTextStoreInfo
                        title="EIN"
                        value="12-3456789"
                    />
                </ScrollView>
            </View>
        );
    }

    nextTab = () => {
        this.props.nextTab();
    }

    renderFooter() {
        return (
            <View style={styles.footer} >
                <ButtonCustom
                    width={scaleSzie(220)}
                    height={40}
                    backgroundColor="#0764B0"
                    title="NEXT"
                    textColor="#fff"
                    onPress={this.nextTab}
                />
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

const ItemTextStoreInfoNotTilte = ({ city, state, zipcode }) => {
    return (
        <View style={{
            flexDirection: 'row',
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(52), marginTop: scaleSzie(25)
        }} >
            <Text style={{
                color: '#404040',
                fontSize: scaleSzie(14),
                fontWeight: '600',
                width: scaleSzie(150)
            }}  >
                {''}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                }}  >
                    {`City: ${city}`}
                </Text>
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                }}  >
                    {`State: ${state}`}
                </Text>
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                }}  >
                    {`Zip code: ${zipcode}`}
                </Text>
            </View>

        </View>
    );
}


const ItemTextStoreInfo = ({ title, value }) => {
    return (
        <View style={{
            flexDirection: 'row',
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(52), marginTop: scaleSzie(25)
        }} >
            <Text style={{
                color: '#404040',
                fontSize: scaleSzie(14),
                fontWeight: '600',
                width: scaleSzie(150)
            }}  >
                {title}
            </Text>
            <Text style={{
                color: '#404040',
                fontSize: scaleSzie(14),
            }}  >
                {value}
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
        height: scaleSzie(60),
        alignItems: 'center'
    }
})

export default TabAdminInfo;
