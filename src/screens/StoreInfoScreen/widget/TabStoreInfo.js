import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { ButtonCustom, Text } from '../../../components';
import { scaleSzie } from '../../../utils';
import connectRedux from '../../../redux/ConnectRedux';


class TabAdminInfo extends React.Component {

    renderBody() {
        const { profile } = this.props;
        const { businessName, address, cityId, stateId, zip, taxId, phone, email,
            bankName, accountNumber, routingNumber, ein
        } = profile;
        return (
            <View style={styles.body} >
                <ScrollView>
                    <ItemTextStoreInfo
                        title="Business Name"
                        value={businessName}
                    />
                    <ItemTextStoreInfoNotTilte
                        city={cityId}
                        state={stateId}
                        zipcode={zip}
                    />
                    <ItemTextStoreInfo
                        title="Business Address"
                        value={address}
                    />
                    <ItemTextStoreInfo
                        title="Federal Tax Id"
                        value={taxId}
                    />
                    <ItemTextStoreInfo
                        title="Phone Number"
                        value={phone}
                    />
                    <ItemTextStoreInfo
                        title="Contact Email"
                        value={email}
                    />
                    <ItemTextStoreInfo
                        title="Bank Name"
                        value={bankName}
                    />
                    <ItemTextStoreInfo
                        title="Account Number"
                        value={accountNumber}
                    />
                    <ItemTextStoreInfo
                        title="Routing Number"
                        value={routingNumber}
                    />
                    <ItemTextStoreInfo
                        title="EIN"
                        value={ein ? ein : ''}
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

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabAdminInfo);
