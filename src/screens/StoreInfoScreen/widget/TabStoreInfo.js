import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image
} from 'react-native';

import { ButtonCustom, Text } from '@components';
import { scaleSzie, localize } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class TabAdminInfo extends React.Component {

    renderBody() {
        const { profile, language } = this.props;
        const { businessName, address, city, zip, taxId, phone, email,
            accountNumber, routingNumber, ein, state, businessBank,
            businessHourEnd, businessHourStart
        } = profile;
        return (
            <View style={styles.body} >
                <ScrollView>
                    <ItemTextStoreInfo
                        title={localize('Business Name', language)}
                        value={businessName}
                    />
                    <ItemTextStoreInfoNotTilte
                        city={city}
                        state={state && state.name ? state.name : ''}
                        zipcode={zip}
                    />
                    <ItemTextStoreInfo
                        title={localize('Business Address', language)}
                        value={address}
                    />

                    <ItemTextStoreInfo
                        title={localize('Business Hour', language)}
                        value={`${businessHourStart ? businessHourStart : ""} - ${businessHourEnd ? businessHourEnd : ""}`}
                    />

                    <ItemTextStoreInfo
                        title={localize('Federal Tax Id', language)}
                        value={taxId}
                    />
                    <ItemTextStoreInfo
                        title={localize('Phone Number', language)}
                        value={phone}
                    />
                    <ItemTextStoreInfo
                        title={localize('Contact Email', language)}
                        value={email}
                    />
                    <ItemTextStoreInfo
                        title={localize('Bank Name', language)}
                        value={businessBank && businessBank.name ? businessBank.name : ''}
                    />
                    <ItemTextStoreInfo
                        title={localize('Account Number', language)}
                        value={businessBank && businessBank.accountNumber ? businessBank.accountNumber : ''}
                    />
                    <ItemTextStoreInfo
                        title={localize('Routing Number', language)}
                        value={businessBank && businessBank.routingNumber ? businessBank.routingNumber : ''}
                    />
                    <ItemTextStoreInfo
                        title="EIN"
                        value={ein ? ein : ''}
                    />
                    <View style={{ height: scaleSzie(20) }} />
                    {
                        businessBank && businessBank.imageUrl ? <View style={{ height: scaleSzie(200), alignItems: 'center' }} >
                            <View style={{ height: scaleSzie(200), width: scaleSzie(200) }} >
                                <Image
                                    source={{ uri: businessBank.imageUrl }}
                                    resizeMode="stretch"
                                    style={{ height: scaleSzie(200), width: scaleSzie(200) }}
                                />
                            </View>
                        </View> : <View />
                    }

                    <View style={{ height: scaleSzie(200) }} />
                </ScrollView>
            </View>
        );
    }

    nextTab = () => {
        this.props.nextTab();
    }

    renderFooter() {
        const { language } = this.props;
        return (
            <View style={styles.footer} >
                <ButtonCustom
                    width={scaleSzie(220)}
                    height={40}
                    backgroundColor="#0764B0"
                    title={localize('NEXT', language)}
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
                fontSize: scaleSzie(16),
                fontWeight: '600',
                width: scaleSzie(150)
            }}  >
                {''}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(16),
                }}  >
                    {`City: ${city}`}
                </Text>
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(16),
                }}  >
                    {`State: ${state}`}
                </Text>
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(16),
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
                fontSize: scaleSzie(16),
                fontWeight: '600',
                width: scaleSzie(150)
            }}  >
                {title}
            </Text>
            <Text style={{
                color: '#404040',
                fontSize: scaleSzie(16),
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
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabAdminInfo);
