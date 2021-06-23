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
import { ScaleSzie, localize, formatNumberFromCurrency } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

class Layout extends React.Component {


    render() {
        const { isSubmitTax } = this.props;
        const { serviceTAX, productTAX } = this.state;
        return (
            <View style={{ flex: 1, paddingHorizontal: ScaleSzie(14), paddingTop: ScaleSzie(20) }} >
                <Text style={{
                    fontSize: ScaleSzie(16),
                    fontWeight: '600',
                    color: '#0764B0'
                }} >
                    {`Tax Settings`}
                </Text>
                <ScrollView  keyboardShouldPersistTaps="always" >
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
                    <View style={{ height: ScaleSzie(300) }} />
                </ScrollView>
                {/* ------- Footer -------- */}
                <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', paddingBottom: ScaleSzie(30) }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        {
                            isSubmitTax ? <ButtonCustom
                                width={ScaleSzie(130)}
                                height={50}
                                backgroundColor="#0764B0"
                                title="SAVE"
                                textColor="#fff"
                                onPress={this.setupTAX}
                                style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                                styleText={{ fontSize: ScaleSzie(20), fontWeight: '500' }}
                            /> :
                                <ButtonCustom
                                    width={ScaleSzie(130)}
                                    height={50}
                                    backgroundColor="#F1F1F1"
                                    title="SAVE"
                                    textColor="#6A6A6A"
                                    onPress={() => { }}
                                    style={{ borderWidth: 2, borderColor: 'rgb(227,227,227)', borderRadius: 2, }}
                                    styleText={{ fontSize: ScaleSzie(20), fontWeight: '500' }}
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
        <View style={{ flexDirection: 'row', marginTop: ScaleSzie(20), }} >
            <View style={{ width: ScaleSzie(140), justifyContent: 'center', }} >
                <Text style={{ fontSize: ScaleSzie(14), color: 'rgb(42,42,42)' }} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, }} >
                <View style={{
                    height: ScaleSzie(35), width: '50%', borderColor: 'rgb(227,227,227)',
                    borderWidth: ScaleSzie(1), paddingHorizontal: ScaleSzie(10)
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
                        style={{ flex: 1, fontSize: ScaleSzie(14) }}
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



export default Layout;