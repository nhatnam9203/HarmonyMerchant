import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image
} from 'react-native';

import { ButtonCustom, Text, ItemWorkingTime } from '@components';
import { scaleSize, localize, BusinessWorkingTime, hideCharactes } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class TabAdminInfo extends React.Component {

    constructor(props) {
        super(props);
        const { profile } = this.props;
        this.state = {
            businessHour: profile.businessHour ? profile.businessHour : BusinessWorkingTime
        }
        this.inputRefsTime = [];
    }

    setRefTimeWorking = (ref) => {
        if (ref) {
            this.inputRefsTime.push(ref);
        }
    };



    nextTab = () => {
        const { profile } = this.props;
        let objWorkingTime = [];
        this.inputRefsTime.forEach(ref => {
            objWorkingTime = {
                ...objWorkingTime,
                [ref.props.title]: {
                    timeStart: ref.state.timeStart,
                    timeEnd: ref.state.timeEnd,
                    isCheck: ref.state.isCheck
                }
            }
        });

        const body = {
            businessHour: objWorkingTime,
            webLink: '',
            latitude: '',
            longitude: '',
            taxService: 0,
            taxProduct: 0
        };
        this.props.actions.app.merchantSetting(body);
    };


    // --------------- Render ------------

    renderBody() {
        const { profile, language } = this.props;
        const { businessHour } = this.state;
        const { businessName, address, city, zip, taxId, phone, email,
            state, businessBank
        } = profile || {};

        return (
            <View style={styles.body} >
                <ScrollView
                    keyboardShouldPersistTaps="always"
                >
                    <ItemTextStoreInfo
                        title={localize('Business Name', language)}
                        value={businessName}
                    />

                    <ItemTextStoreInfo
                        title={localize('Business Address', language)}
                        value={address}
                    />

                    <ItemTextStoreInfoNotTilte
                        city={city}
                        state={state && state.name ? state.name : ''}
                        zipcode={zip}
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

                    {/* -------- Business Hours --------- */}
                    <View style={{ paddingLeft: scaleSize(90), marginTop: scaleSize(25) }} >
                        <Text style={{
                            color: '#404040',
                            fontSize: scaleSize(16),
                            fontWeight: '600',
                        }}  >
                            {`${localize('Business Hours', language)}`}
                        </Text>
                    </View>


                    <View style={{
                        paddingLeft: scaleSize(100),
                        marginTop: scaleSize(15)
                    }} >
                        {/* ---------- List Business Time -------- */}
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

                    </View>
                    {/* --------------- End -------------- */}
                    <View style={{ paddingLeft: scaleSize(90), marginTop: scaleSize(25) }} >
                        <Text style={{
                            color: '#404040',
                            fontSize: scaleSize(16),
                            fontWeight: '600',
                        }}  >
                            {`${localize('Void Check', language)}`}
                        </Text>
                    </View>
                    <View style={{ height: scaleSize(20) }} />
                    {/* -------- Business Hours --------- */}

                    {
                        businessBank && businessBank.imageUrl ? <View style={{ height: scaleSize(200), alignItems: 'center' }} >
                            <View style={{ height: scaleSize(200), width: scaleSize(200) }} >
                                <Image
                                    source={{ uri: businessBank.imageUrl }}
                                    resizeMode="stretch"
                                    style={{ height: scaleSize(200), width: scaleSize(200) }}
                                />
                            </View>
                        </View> : <View />
                    }

                    <View style={{ height: scaleSize(200) }} />
                </ScrollView>
            </View>
        );
    }


    renderFooter() {
        const { language } = this.props;
        return (
            <View style={styles.footer} >
                <ButtonCustom
                    width={scaleSize(220)}
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

    componentDidUpdate(prevProps, prevState) {
        const { tabCurrent, loading, isUpdateMerchantSetting } = this.props;
        if (tabCurrent === 0 && prevProps.loading !== loading && !loading && isUpdateMerchantSetting) {
            this.props.nextTab();
            this.props.actions.app.resetStateUpdateMerchantSetting(false);
        }
    }

    componentWillUnmount() {
        this.inputRefsTime = [];
    }

}

const ItemTextStoreInfoNotTilte = ({ city, state, zipcode }) => {
    return (
        <View style={{
            flexDirection: 'row',
            paddingLeft: scaleSize(90),
            paddingRight: scaleSize(52), marginTop: scaleSize(25)
        }} >
            <Text style={{
                color: '#404040',
                fontSize: scaleSize(16),
                fontWeight: '600',
                width: scaleSize(150)
            }}  >
                {''}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSize(16),
                }}  >
                    {`City: ${city}`}
                </Text>
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSize(16),
                }}  >
                    {`State: ${state}`}
                </Text>
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSize(16),
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
            paddingLeft: scaleSize(90),
            paddingRight: scaleSize(52),
            marginTop: scaleSize(25)
        }} >
            <Text style={{
                color: '#404040',
                fontSize: scaleSize(16),
                fontWeight: '600',
                width: scaleSize(150)
            }}  >
                {title}
            </Text>
            <Text style={{
                color: '#404040',
                fontSize: scaleSize(16),
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
        height: scaleSize(60),
        alignItems: 'center'
    }
})

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    loading: state.app.loading,
    isUpdateMerchantSetting: state.app.isUpdateMerchantSetting
})



export default connectRedux(mapStateToProps, TabAdminInfo);
