import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image
} from 'react-native';

import { ButtonCustom, Text, Dropdown } from '@components';
import { scaleSzie, localize, WorkingTime } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class TabAdminInfo extends React.Component {

    constructor(props) {
        super(props);

    }

    renderBody() {
        const { profile, language } = this.props;
        const { businessName, address, city, zip, taxId, phone, email,
            state, businessBank
        } = profile;

        const businessHourStart = profile.businessHourStart ? profile.businessHourStart : '';
        const businessHourEnd = profile.businessHourEnd ? profile.businessHourEnd : '';

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
                        value={taxId ? taxId : ''}
                    />

                    {/* -------- Business Hour --------- */}
                    <View style={{
                        flexDirection: 'row',
                        paddingLeft: scaleSzie(90),
                        paddingRight: scaleSzie(52),
                        marginTop: scaleSzie(25)
                    }} >
                        <View style={{ width: scaleSzie(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(16),
                                fontWeight: '600',
                            }}  >
                                {`${localize('Business Hour', language)}:`}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSzie(40), width: scaleSzie(400),
                            flexDirection: 'row'
                        }} >
                            <Dropdown
                                label={'08:00 AM'}
                                data={WorkingTime}
                                value={businessHourStart}
                                onChangeText={(value) => {
                                    this.props.actions.dataLocal.updateBusinessHour({
                                        businessHourStart: value,
                                        businessHourEnd
                                    })
                                }}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    width: scaleSzie(140)
                                }}
                            />
                            <View style={{ marginHorizontal: scaleSzie(15), justifyContent: 'center' }} >
                                <Text style={{ fontSize: scaleSzie(18), color: '#404040', }} >

                                    {localize('To', language)}
                                </Text>
                            </View>
                            <Dropdown
                                label={'08:00 AM'}
                                data={WorkingTime}
                                value={businessHourEnd}
                                onChangeText={(value) => {
                                    this.props.actions.dataLocal.updateBusinessHour({
                                        businessHourStart,
                                        businessHourEnd: value
                                    })
                                }}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    width: scaleSzie(140)
                                }}
                            />
                        </View>
                    </View>
                    {/* --------------- End -------------- */}

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
        const { profile } = this.props;
        const businessHourStart = profile.businessHourStart ? profile.businessHourStart : '';
        const businessHourEnd = profile.businessHourEnd ? profile.businessHourEnd : '';

        if (businessHourStart === "" || businessHourEnd === "") {
            alert("Pleas setup your business hour start and business hour start end !");
        } else {
            const body = {
                businessHourStart,
                businessHourEnd,
                webLink: '',
                latitude: '',
                longitude: '',
                taxService: 0,
                taxProduct: 0
            };
            this.props.actions.app.merchantSetting(body,false);
            this.props.nextTab();
        }
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
            paddingRight: scaleSzie(52),
            marginTop: scaleSzie(25)
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
