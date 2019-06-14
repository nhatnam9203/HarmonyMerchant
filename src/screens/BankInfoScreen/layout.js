import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { InputForm, FormInfoParent, Text, Button, PopupUpload } from '@components';
import { scaleSzie,localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    render() {
        const {
            bankName, routingNumber, accountNumber
        } = this.state.bankInfo;
        const {language} = this.props;
        return (
            <FormInfoParent
                title={`${localize('Bank Information',language)}`}
                back={() => this.props.navigation.goBack()}
                next={this.nextSreen}
            >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(25) }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <InputForm
                        title="Bank Name *"
                        subTitle=""
                        placeholder=""
                        value={bankName}
                        onChangeText={(value) => this.updateBankInfo('bankName', value, '')}
                    />

                    <InputForm
                        title={`${localize('ABA Routing Number *',language)}`}
                        subTitle=""
                        placeholder=""
                        value={routingNumber}
                        onChangeText={(value) => this.updateBankInfo('routingNumber', value, '')}
                        keyboardType="numeric"
                    />

                    <InputForm
                        title={`${localize('Checking Account Number (DDA) *',language)}`}
                        subTitle=""
                        placeholder=""
                        value={accountNumber}
                        onChangeText={(value) => this.updateBankInfo('accountNumber', value, '')}
                        keyboardType="numeric"
                    />

                    <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                        {`${localize('Void Check *',language)}`}
                    </Text>
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                    {`${localize('Please take or upload photos of void check',language)}`}
                    </Text>

                    <View style={{
                        alignItems: 'center',
                        padding: scaleSzie(10), marginTop: scaleSzie(18),
                    }} >
                        {
                            this.state.savaFileUpload ?
                                <View style={{
                                    width: scaleSzie(400), height: scaleSzie(200),
                                    overflow: 'hidden'
                                }} >
                                    <Image
                                        source={{ uri: this.state.uriUpload }}
                                        style={{ width: null, height: null, flex: 1 }}
                                    />
                                </View> :

                                <View style={{
                                    width: scaleSzie(400), height: scaleSzie(200),
                                    borderWidth: 2, borderColor: '#C5C5C5', borderStyle: "dashed",
                                    borderRadius: scaleSzie(14),
                                    alignItems: 'center',
                                    paddingTop: scaleSzie(5)

                                }} >
                                    <Button onPress={this.takePhoto} >
                                        <Image
                                            source={IMAGE.camera}
                                        />
                                    </Button>

                                    <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }} >
                                        <Text style={{
                                            color: '#6A6A6A', fontSize: scaleSzie(20), fontWeight: 'bold',
                                        }} >
                                            {`${localize('Take a Photo',language)}`}
                                        </Text>

                                        <Text style={{
                                            color: '#6A6A6A', fontSize: scaleSzie(20),
                                        }} >
                                            {`${localize('Or',language)}`}
                                        </Text>
                                        <Button
                                            onPress={this.openImageLibrary}
                                            style={{
                                                width: scaleSzie(180), height: scaleSzie(40), backgroundColor: '#F1F1F1',
                                                borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 4, justifyContent: "center", alignItems: 'center'
                                            }} >
                                            <Text style={{
                                                color: '#6A6A6A', fontSize: scaleSzie(20),
                                            }} >
                                                {`${localize('Browse File',language)}`}
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                        }

                    </View>
                </View>
                <PopupUpload
                    visible={this.state.visibleUpload}
                    title={`${localize('File Upload',language)}`}
                    message={`${localize('Do you want to Archive this Category ?',language)}`}
                    onRequestClose={() => this.setState({ visibleUpload: false, uriUpload: '' })}
                    uri={this.state.uriUpload}
                    save={this.saveFileUpload}
                />
            </FormInfoParent>

        );
    }
}
