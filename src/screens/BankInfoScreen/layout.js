import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { InputForm, FormInfoParent, Text, Button, PopupUpload } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';


export default class Layout extends React.Component {

    render() {
        const {
            bankName, routingNumber, accountNumber
        } = this.state.bankInfo;
        return (
            <FormInfoParent
                title="Bank Information"
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
                        title="ABA Routing Number *"
                        subTitle=""
                        placeholder=""
                        value={routingNumber}
                        onChangeText={(value) => this.updateBankInfo('routingNumber', value, '')}
                    />

                    <InputForm
                        title="Checking Account Number (DDA) *"
                        subTitle=""
                        placeholder=""
                        value={accountNumber}
                        onChangeText={(value) => this.updateBankInfo('accountNumber', value, '')}
                    />

                    <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                        Void Check *
                            </Text>
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                        Please take or upload photos of void check
                            </Text>

                    <View style={{
                        alignItems: 'center',
                        padding: scaleSzie(10), marginTop: scaleSzie(18),
                    }} >
                        {
                            this.state.savaFileUpload ?
                                <View style={{
                                    width: scaleSzie(400), height: scaleSzie(200),
                                    overflow:'hidden'
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
                                            Take a Photo
            </Text>

                                        <Text style={{
                                            color: '#6A6A6A', fontSize: scaleSzie(20),
                                        }} >
                                            Or
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
                                                Browse File
                    </Text>
                                        </Button>
                                    </View>

                                </View>
                        }

                    </View>
                </View>
                <PopupUpload
                    visible={this.state.visibleUpload}
                    title="File Upload"
                    message="Do you want to Archive this Category ?"
                    onRequestClose={() => this.setState({ visibleUpload: false, uriUpload: '' })}
                    uri={this.state.uriUpload}
                    save={this.saveFileUpload}
                />
            </FormInfoParent>

        );
    }
}
