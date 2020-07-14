import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    RefreshControl,
    Image,
} from 'react-native';

import { ButtonCustom, Text, Dropdown, ItemWorkingTime, Button } from '@components';
import { scaleSzie, localize, getNameStateById, TimeZones, hideCharactes,WorkingTime } from '@utils';
import ICON from "@resources";

const AUTO_LOCK = ["2 Minutes", "5 Minutes", "10 Minutes", "15 Minutes", "Never"];

class Layout extends React.Component {

    renderSetup() {
        const { language, autoLockScreenAfter } = this.props;
        const { languageApp, webLink,autoCloseAt, timezone, businessHour } = this.state;

        return (
            <View style={{ width: '100%', marginTop: scaleSzie(6) }} >
                <View style={{ flex: 1 }} >
                    {/* ------- Item Change Language  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Language', language)}:`}
                        data={[{ value: 'English' }, { value: 'Viet Nam' }]}
                        value={languageApp}
                        onChangeText={value => {
                            this.setState({ languageApp: value })
                        }}
                        placeHolder={localize('Language', language)}
                    />
                    {/* ------- Item Auto close at:  ------ */}
                    <ItemSetupGeneral
                        title={`${localize('Auto close at', language)}:`}
                        data={WorkingTime}
                        value={autoCloseAt}
                        onChangeText={value => this.setState({ autoCloseAt: value })}
                        placeHolder='08:00 AM'
                    />

                    {/* ------------ Item Auto lock ------------- */}
                    <View style={{ flexDirection: 'row', marginVertical: scaleSzie(15) }} >
                        <View style={{ width: scaleSzie(180) }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(16),
                                fontWeight: '600', marginTop: scaleSzie(10)
                            }}  >
                                {`${localize('Auto lock screen after', language)}:`}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSzie(40 * 5), flex: 1, paddingHorizontal: scaleSzie(10),
                            backgroundColor: "#fff", borderWidth: 1, borderColor: '#C5C5C5',
                            borderRadius: scaleSzie(6)
                        }} >
                            {
                                AUTO_LOCK.map((item, index) => <ItemAutoLock
                                    key={item}
                                    title={item}
                                    isShowIcon={item == autoLockScreenAfter ? true : false}
                                    isHideBorderBottom={index === 4 ? true : false}
                                    onPress={this.changeAutoLockTime}
                                />)
                            }
                        </View>
                    </View>

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
                            height: scaleSzie(40), flex: 1, borderWidth: 1, borderColor: '#C5C5C5',
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
                    {/* -------- Time Zone --------- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(8) }} >
                        <View style={{ width: scaleSzie(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(16),
                                fontWeight: '600',
                            }}  >
                                {`${localize('Time Zone', language)}:`}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSzie(40), flex: 1,
                        }} >
                            <Dropdown
                                label={"Time Zone"}
                                data={TimeZones}
                                value={timezone}
                                onChangeText={(timezone) => this.setState({ timezone })}
                                containerStyle={{
                                    backgroundColor: '#F1F1F1',
                                    borderWidth: 1,
                                    borderColor: '#C5C5C5',
                                    flex: 1
                                }}
                            />
                        </View>
                    </View>
                    {/* -------- Business Hours --------- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(8) }} >
                        <View style={{ width: scaleSzie(180), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(16),
                                fontWeight: '600',
                            }}  >
                                {`${localize('Business Hours', language)}:`}
                            </Text>
                        </View>
                        <View style={{ height: scaleSzie(40), width: scaleSzie(400), flexDirection: 'row' }} />
                    </View>

                    {/* -------- Bussiness Working Time --------- */}

                    {
                        Object.keys(businessHour).map((day, index) => {
                            return <ItemWorkingTime
                                key={index}
                                ref={this.setRefTimeWorking}
                                title={day}
                                dataInit={businessHour[day]}
                            />
                        })
                    }


                    {/* ------ Button Save --- */}
                    <View style={{ justifyContent: 'center', marginTop: scaleSzie(35), flexDirection: 'row' }} >
                        <ButtonCustom
                            width={scaleSzie(150)}
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
        const { profile, language, stateCity, refreshingGeneral, versionApp } = this.props;
        const { businessName, address, city, stateId, zip, taxId, phone, email,
            ein, merchantCode, businessBank, merchantId
        } = profile;
        return (
            <View style={styles.body} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
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
                        state={getNameStateById(stateCity, stateId)}
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
                        value={businessBank && businessBank.accountNumber ? hideCharactes(businessBank.accountNumber) : ''}
                    />
                    <ItemTextStoreInfo
                        title={localize('Routing Number', language)}
                        value={businessBank && businessBank.routingNumber ? hideCharactes(businessBank.routingNumber) : ''}
                    />
                    <ItemTextStoreInfo
                        title="EIN"
                        value={taxId ? hideCharactes(taxId) : ''}
                    />
                    <ItemTextStoreInfo
                        title={localize('Merchant ID', language)}
                        value={merchantCode}
                    />

                    <View style={{
                        height: scaleSzie(50),
                        justifyContent: "flex-end", alignItems: "flex-end"
                    }} >
                        <Text style={{ color: "rrgb(57,54,60)", fontSize: scaleSzie(14), fontWeight: "600" }} >
                            {`${localize('Version', language)}: ${versionApp}`}
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
                    {`Zip Code: ${zipcode}`}
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

const ItemAutoLock = ({ title, isHideBorderBottom, onPress, isShowIcon }) => {
    const styleBorder = !isHideBorderBottom ? { borderBottomWidth: 1, borderBottomColor: '#C5C5C5', } : {};

    return (
        <Button onPress={() => onPress(title)} style={[{
            height: scaleSzie(40),
            flexDirection: "row", justifyContent: "space-between",
            alignItems: "center"
        }, styleBorder]} >
            <Text style={{ color: "rgb(0,2,2)", fontSize: scaleSzie(16), fontWeight: "500" }} >
                {title}
            </Text>

            {
                isShowIcon ? <Image source={ICON.check_package_pricing} /> : <View />
            }
        </Button>
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

