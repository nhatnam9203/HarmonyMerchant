import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TextInput,
    ScrollView
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, Text } from '@components';
import { scaleSzie, localize, formatNumberFromCurrency } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

class SetupHardware extends React.Component {

    constructor(props) {
        super(props);
        const { profile } = this.props;
        this.state = {
            serviceTAX: profile.taxService ? profile.taxService : '',
            productTAX: profile.taxProduct ? profile.taxProduct : '',
        }
    }

    setupTAX = () => {
        const {profile} = this.props;
        const { serviceTAX, productTAX } = this.state;
        this.props.actions.app.setupMerchantTAX({
            taxService: formatNumberFromCurrency(serviceTAX),
            taxProduct: formatNumberFromCurrency(productTAX),
            businessHourStart: profile.businessHourStart,
            businessHourEnd: profile.businessHourEnd,
            webLink: profile.webLink,
            latitude: profile.latitude,
            longitude: profile.longitude,
        });
    }

    onChangeServiceTax = serviceTAX => {
        this.setState({
            serviceTAX
        });
        this.props.actions.app.changeFlagSubmitTAX();
    }

    onChangeProductTax = productTAX => {
        this.setState({
            productTAX
        });
        this.props.actions.app.changeFlagSubmitTAX();
    }

    // -------- Render ------

    render() {
        const { isSubmitTax } = this.props;
        const { serviceTAX, productTAX } = this.state;
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingTop: scaleSzie(20) }} >
                <Text style={{
                    fontSize: scaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >
                    TAX Settings
                        </Text>
                <ScrollView  >
                    <ItemSetup
                        title={"Service Tax (%) :"}
                        placeholder={"10"}
                        value={serviceTAX}
                        onChangeText={this.onChangeServiceTax}
                    />

                    <ItemSetup
                        title={"Product Tax (%) :"}
                        placeholder={"10"}
                        value={productTAX}
                        onChangeText={this.onChangeProductTax}
                    />
                    <View style={{ height: scaleSzie(300) }} />
                </ScrollView>
                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: scaleSzie(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        {
                            isSubmitTax ? <ButtonCustom
                                width={scaleSzie(130)}
                                height={50}
                                backgroundColor="#0764B0"
                                title="SAVE"
                                textColor="#fff"
                                onPress={this.setupTAX}
                                style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                                styleText={{ fontSize: scaleSzie(20), fontWeight: '500' }}
                            /> :
                                <ButtonCustom
                                    width={scaleSzie(130)}
                                    height={50}
                                    backgroundColor="#F1F1F1"
                                    title="SAVE"
                                    textColor="#6A6A6A"
                                    onPress={() => { }}
                                    style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                                    styleText={{ fontSize: scaleSzie(20), fontWeight: '500' }}
                                    activeOpacity={1}
                                />
                        }
                    </View>
                </View>
            </View>
        );

    }

}


const ItemSetup = ({ title, value, placeholder, onChangeText }) => {
    return (
        <View style={{ flexDirection: 'row', marginTop: scaleSzie(20), }} >
            <View style={{ width: scaleSzie(140), justifyContent: 'center', }} >
                <Text style={{ fontSize: scaleSzie(14), color: 'rgb(42,42,42)' }} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, }} >
                <View style={{
                    height: scaleSzie(35), width: '50%', borderColor: 'rgb(227,227,227)',
                    borderWidth: scaleSzie(1), paddingHorizontal: scaleSzie(10)
                }} >
                    <TextInputMask
                        type={'money'}
                        options={{
                            precision: 2,
                            separator: '.',
                            delimiter: ',',
                            unit: '',
                            suffixUnit: ''
                        }}
                        style={{ flex: 1, fontSize: scaleSzie(14) }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value) => onChangeText(value)}
                        keyboardType="numeric"
                    // type="only-numbers"
                    />
                </View>
            </View>
        </View>
    );
}


const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    isSubmitTax: state.app.isSubmitTax
})

export default connectRedux(mapStateToProps, SetupHardware);

