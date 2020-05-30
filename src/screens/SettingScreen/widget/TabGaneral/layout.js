import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    RefreshControl
} from 'react-native';

import { ButtonCustom, Text, Dropdown } from '@components';
import { scaleSzie, localize, WorkingTime, getNameStateById } from '@utils';
import IMAGE from '@resources';
import configs from '@configs';

class Layout extends React.Component {

    renderSetup() {
        const { language } = this.props;
        const { languageApp, longitude, latitude, webLink,
            autoCloseAt, autoLockScreenAfter, businessHourStart, businessHourEnd
        } = this.state;
        return (
            <View style={{ width: '100%', marginTop: scaleSzie(6) }} >
                <View style={{ flex: 1 }} >
                    {/* ------- Item Change Language  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Language', language)}:`}
                        data={[{ value: 'English' }, { value: 'Viet Nam' }]}
                        value={languageApp}
                        onChangeText={value => {
                        //console.log(value);
                            this.setState({ languageApp: value })
                        }}
                        placeHolder={localize('Language', language)}
                    />
                    {/* ------- Item Auto close at:  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Auto close at', language)}:`}
                        data={[{ value: '05:00 min' }, { value: '10:00 min' }, { value: '15:00 min' }, { value: '30:00 min' }]}
                        value={autoCloseAt}
                        onChangeText={value => this.setState({ autoCloseAt: value })}
                        placeHolder='08:00 AM'
                    />
                    {/* ------- Item Auto lock screen after:  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Auto lock screen after', language)}:`}
                        data={[{ value: '00:30 s' },{ value: '05:00 min' }, { value: '10:00 min' },
                         { value: '15:00 min' }, { value: '30:00 min' },{value:"Never"}]}
                        value={autoLockScreenAfter}
                        onChangeText={value => this.setState({ autoLockScreenAfter: value })}
                        placeHolder='15:00 min'
                    />
                    {/* -------- Link website --------- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(8) }} >
                        <View style={{ width: scaleSzie(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(16),
                                fontWeight: '600',
                            }}  >
                                {`${localize('Website', language)}:`}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSzie(40), width: scaleSzie(400), borderWidth: 1, borderColor: '#C5C5C5',
                            paddingHorizontal: scaleSzie(10)
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(18) }}
                                placeholder="yoursite.com"
                                value={webLink}
                                onChangeText={value => this.setState({ webLink: value })}
                            />
                        </View>
                    </View>
                    {/* -------- Business Hour --------- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(8) }} >
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
                                onChangeText={(value) => this.setState({ businessHourStart: value })}
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
                                onChangeText={(businessHourEnd) => this.setState({ businessHourEnd })}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    width: scaleSzie(140)
                                }}
                            />
                        </View>
                    </View>
                    {/* -------- Longtitude --------- */}
                    {/* <View style={{ flexDirection: 'row', marginTop: scaleSzie(8) }} >
                        <View style={{ width: scaleSzie(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(16),
                                fontWeight: '600',
                            }}  >
                                {`${localize('Longtitude', language)}:`}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSzie(40), width: scaleSzie(240), borderWidth: 1, borderColor: '#C5C5C5',
                            paddingHorizontal: scaleSzie(10)
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(18) }}
                                placeholder=""
                                value={longitude}
                                onChangeText={value => this.setState({ longitude: value })}
                            />
                        </View>
                    </View> */}
                    {/* -------- Lattitude --------- */}
                    {/* <View style={{ flexDirection: 'row', marginTop: scaleSzie(8) }} >
                        <View style={{ width: scaleSzie(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(16),
                                fontWeight: '600',
                            }}  >
                                {`${localize('Latitude', language)}:`}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSzie(40), width: scaleSzie(240), borderWidth: 1, borderColor: '#C5C5C5',
                            paddingHorizontal: scaleSzie(10)
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(18) }}
                                placeholder=""
                                value={latitude}
                                onChangeText={value => this.setState({ latitude: value })}
                            />
                        </View>
                    </View> */}
                    {/* ------ Button Save --- */}
                    <View style={{ justifyContent: 'flex-end', marginTop: scaleSzie(20), flexDirection: 'row' }} >
                        {/* <ButtonCustom
                            width={scaleSzie(250)}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title={localize('Get current your position', language)}
                            textColor="#6A6A6A"
                            onPress={this.getCurrentPosition}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                backgroundColor: '#0764B0'
                            }}
                            styleText={{ fontSize: scaleSzie(18), fontWeight: '500', color: '#fff' }}
                        />
                        <View style={{ width: scaleSzie(20) }} /> */}
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
                    {/* ----------- */}
                </View>
            </View>
        );
    }

    renderBody() {
        const { profile, language ,stateCity,refreshingGeneral,versionApp} = this.props;
        const { businessName, address, city, stateId, zip, taxId, phone, email,
            ein, merchantCode, businessBank,merchantId
        } = profile;
        return (
            <View style={styles.body} >
                <ScrollView 
                showsVerticalScrollIndicator={false} 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshingGeneral}
                        onRefresh={this.onRefreshGeneral}
                    />
                }
                >
                    {this.renderSetup()}
                    {/* ------ Line ----- */}
                    <View style={{ height: scaleSzie(2), width: '100%', backgroundColor: '#C5C5C5', marginTop: scaleSzie(18) }} />

                    <ItemTextStoreInfo
                        title={localize('Business Name', language)}
                        value={businessName}
                    />
                    <ItemTextStoreInfoNotTilte
                        city={city}
                        state={getNameStateById(stateCity,stateId)}
                        zipcode={zip}
                    />
                    <ItemTextStoreInfo
                        title={localize('Business Address', language)}
                        value={address}
                    />
                    {/* <ItemTextStoreInfo
                        title={localize('Federal Tax Id', language)}
                        value={taxId}
                    /> */}
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
                    <ItemTextStoreInfo
                        title={localize('Merchant ID', language)}
                        value={merchantCode}
                    />

                    <View style={{height:scaleSzie(50),
                justifyContent:"flex-end",alignItems:"flex-end"
                }} >
                        <Text style={{color:"rrgb(57,54,60)",fontSize:scaleSzie(14),fontWeight:"600"}} >
                        {localize('Version', language)}   : {versionApp}
                        </Text>
                    </View>
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

const ItemSetupGeneral = ({ title, data, placeHolder, value = '', onChangeText }) => {
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
                    label={placeHolder}
                    data={data}
                    value={value}
                    onChangeText={(value) => onChangeText(value)}
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
            }} numberOfLines={1} >
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

