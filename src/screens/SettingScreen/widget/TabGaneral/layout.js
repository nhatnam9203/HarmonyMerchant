import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { ButtonCustom, Text, Dropdown } from '@components';
import { scaleSzie, localize, WorkingTime,getNameLanguage } from '@utils';
import IMAGE from '@resources';

class Layout extends React.Component {

    renderSetup() {
        const { language } = this.props;
        return (
            <View style={{ width: '100%', marginTop: scaleSzie(6), flexDirection: 'row' }} >
                <View style={{ flex: 1 }} >
                    {/* ------- Item Change Language  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Language', language)}:`}
                        data={[{ value: 'English' }, { value: 'Viet Nam' }]}
                        value={getNameLanguage(language)}
                    />
                    {/* ------- Item Auto close at:  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Auto close at', language)}:`}
                        data={WorkingTime}
                    />
                    {/* ------- Item Auto lock screen after:  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Auto lock screen after', language)}:`}
                        data={[{ value: '05:00 min' }, { value: '10:00 min' }, { value: '15:00 min' }, { value: '30:00 min' }]}
                    />
                </View>
                {/* ------ Button Save --- */}
                <View style={{ width: scaleSzie(140),justifyContent:'center' }} >
                    <ButtonCustom
                        width={scaleSzie(120)}
                        height={50}
                        backgroundColor="#F1F1F1"
                        title={localize('SAVE', language)}
                        textColor="#6A6A6A"
                        onPress={this.saveSettngApp}
                        style={{
                            borderWidth: 1, borderColor: '#C5C5C5',
                            backgroundColor: '#0764B0'
                        }}
                        styleText={{ fontSize: scaleSzie(18), fontWeight: '500', color: '#fff' }}
                    />
                </View>
            </View>
        );
    }

    renderBody() {
        const { profile, language } = this.props;
        const { businessName, address, city, stateId, zip, taxId, phone, email,
            bankName, accountNumber, routingNumber, ein
        } = profile;
        return (
            <View style={styles.body} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    {this.renderSetup()}
                    {/* ------ Line ----- */}
                    <View style={{ height: scaleSzie(2), width: '100%', backgroundColor: '#C5C5C5', marginTop: scaleSzie(18) }} />

                    <ItemTextStoreInfo
                        title={localize('Business Name', language)}
                        value={businessName}
                    />
                    <ItemTextStoreInfoNotTilte
                        city={city}
                        state={stateId}
                        zipcode={zip}
                    />
                    <ItemTextStoreInfo
                        title={localize('Business Address', language)}
                        value={address}
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
                        value={bankName}
                    />
                    <ItemTextStoreInfo
                        title={localize('Account Number', language)}
                        value={accountNumber}
                    />
                    <ItemTextStoreInfo
                        title={localize('Routing Number', language)}
                        value={routingNumber}
                    />
                    <ItemTextStoreInfo
                        title="EIN"
                        value={ein ? ein : ''}
                    />
                    <View style={{ height: scaleSzie(250) }} />
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

const ItemSetupGeneral = ({ title, data ,value = ''}) => {
    return (
        <View style={{ flexDirection: 'row', marginTop: scaleSzie(8) }} >
            <View style={{ width: scaleSzie(180), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                }}  >
                    {title}
                </Text>
            </View>
            <View style={{ height: scaleSzie(40), width: scaleSzie(140) }} >
                <Dropdown
                    label={localize('Language')}
                    data={data}
                    value={value}
                    containerStyle={{
                        backgroundColor: '#F1F1F1',
                        borderWidth: 1,
                        borderColor: '#C5C5C5',
                        flex: 1
                    }}
                />
            </View>
        </View>
    );
}

const ItemTextStoreInfoNotTilte = ({ city, state, zipcode }) => {
    return (
        <View style={{
            flexDirection: 'row',
            paddingRight: scaleSzie(50),
            marginTop: scaleSzie(25),
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
        flex: 1,
        paddingHorizontal: scaleSzie(18)
    },
    footer: {
        height: scaleSzie(60),
        alignItems: 'center'
    }
})

export default Layout;

