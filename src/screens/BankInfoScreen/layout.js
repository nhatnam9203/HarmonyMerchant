import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import FastImage from "react-native-fast-image";

import { InputForm, FormInfoParent, Text, Button, PopupUpload } from '@components';
import { ScaleSzie, localize } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

export default class Layout extends React.Component {

    render() {
        const {bankName, routingNumber, accountNumber, accountHolderName } = this.state.bankInfo;
        const { language } = this.props;
        return (
            <FormInfoParent
                back={this.backScreen}
                next={this.nextSreen}
            >
                <ScrollView
                    ref={this.srollBankInfoRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {/* ------ Header ------ */}
                    <View style={{
                        width, paddingHorizontal: ScaleSzie(15),
                        marginTop: ScaleSzie(8)
                    }}  >
                        <Text style={{ color: '#0764B0', fontWeight: 'bold', fontSize: ScaleSzie(18) }} >
                            {localize('Please fill the form below', language)}
                        </Text>
                        <View style={{
                            height: ScaleSzie(38), backgroundColor: '#0764B0', justifyContent: 'center',
                            paddingLeft: ScaleSzie(5), marginTop: ScaleSzie(5)
                        }} >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: ScaleSzie(18) }} >
                                {localize('Bank Information', language)}
                            </Text>
                        </View>
                    </View>
                    {/* ------------------------- */}
                    <View style={{ flex: 1, paddingHorizontal: ScaleSzie(25) }} >
                        <View style={{ height: ScaleSzie(16) }} />
                        <InputForm
                            title={`${localize('Account Holder Name', language)}*`}
                            subTitle=""
                            placeholder=""
                            value={accountHolderName}
                            onChangeText={(value) => this.updateBankInfo('accountHolderName', value, '')}
                            onFocus={() => this.scrollBankInfoTo(85)}
                        />
                        <InputForm
                            title={`${localize('Bank Name', language)}*`}
                            subTitle=""
                            placeholder=""
                            value={bankName}
                            onChangeText={(value) => this.updateBankInfo('bankName', value, '')}
                            onFocus={() => this.scrollBankInfoTo(160)}
                        />

                        <InputForm
                            isOnlyNumber={true}
                            title={`${localize('Routing Number', language)}* (ABA)`}
                            subTitle=""
                            placeholder=""
                            value={routingNumber}
                            onChangeText={(value) => this.updateBankInfo('routingNumber', value, '')}
                            keyboardType="numeric"
                            onFocus={() => this.scrollBankInfoTo(230)}
                        />

                        <InputForm
                            isOnlyNumber={true}
                            title={`${localize('Account Number', language)}* (DDA)`}
                            subTitle=""
                            placeholder=""
                            value={accountNumber}
                            onChangeText={(value) => this.updateBankInfo('accountNumber', value, '')}
                            keyboardType="numeric"
                            onFocus={() => this.scrollBankInfoTo(310)}
                        />

                        <Text style={{ color: '#404040', fontSize: ScaleSzie(14), fontWeight: "600" }} >
                            {`${localize('Void Check', language)}*`}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(14), marginTop: ScaleSzie(10) }} >
                            {`${localize('Please take or upload photos of void check', language)}`}
                        </Text>

                        <View style={{
                            alignItems: 'center',
                            padding: ScaleSzie(10), marginTop: ScaleSzie(18),
                        }} >
                            {
                                this.state.uriUpload ?
                                    <View style={{
                                        width: ScaleSzie(400), height: ScaleSzie(300),
                                        overflow: 'hidden', marginBottom: ScaleSzie(10)
                                    }} >
                                        <FastImage
                                            style={{ width: null, height: null, flex: 1 }}
                                            source={{
                                                uri: this.state.uriUpload,
                                                priority: FastImage.priority.high,
                                                cache: FastImage.cacheControl.immutable
                                            }}
                                            resizeMode="stretch"
                                        />
                                    </View> : <View />

                            }

                            <View style={{
                                width: ScaleSzie(400), height: ScaleSzie(200),
                                borderWidth: 2, borderColor: '#C5C5C5', borderStyle: "dashed",
                                borderRadius: ScaleSzie(14),
                                alignItems: 'center',
                                paddingTop: ScaleSzie(5)

                            }} >
                                <Button onPress={this.takePhoto} >
                                    <Image
                                        source={IMAGE.camera}
                                    />
                                </Button>

                                <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }} >
                                    <Text style={{
                                        color: '#C5C5C5', fontSize: ScaleSzie(20), fontWeight: 'bold',
                                    }} >
                                        {`${localize('Take a Photo', language)}`}
                                    </Text>

                                    <Text style={{
                                        color: '#C5C5C5', fontSize: ScaleSzie(20),
                                    }} >
                                        {`${localize('Or', language)}`}
                                    </Text>
                                    <Button
                                        onPress={this.openImageLibrary}
                                        style={{
                                            width: ScaleSzie(180), height: ScaleSzie(40), backgroundColor: '#F1F1F1',
                                            borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4, justifyContent: "center", alignItems: 'center'
                                        }} >
                                        <Text style={{
                                            color: '#C5C5C5', fontSize: ScaleSzie(20),
                                        }} >
                                            {`${localize('Browse File', language)}`}
                                        </Text>
                                    </Button>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{ height: ScaleSzie(250) }} />
                </ScrollView>
                <PopupUpload
                    ref={this.uploadVoidCheckRef}
                    visible={this.state.visibleUpload}
                    title={`${localize('File Upload', language)}`}
                    message={`${localize('Do you want to Archive this Category?', language)}`}
                    onRequestClose={() => this.setState({ visibleUpload: false })}
                    uri={this.state.uriUpload}
                    saveVoidCheck={this.saveVoidCheck}
                />
            </FormInfoParent>

        );
    }
}
