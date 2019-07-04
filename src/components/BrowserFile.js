import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import ButtonCustom from './ButtonCustom';
import IMAGE from '@resources';

import { scaleSzie } from '@utils';
export default class BrowserFile extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            uriUpload: ''
        }
    }

    showPicker = () => {
        ImagePicker.showImagePicker({
            quality: 0.2
        }, (response) => {
            if (response.uri) {
                this.setState({
                    uriUpload: response.uri
                })
                console.log(response.uri);
            }
        });
    }


    render() {
        const { uriUpload } = this.state;
        const temptImage = uriUpload === '' ? IMAGE.imagePlaceHolder : { uri: uriUpload }
        return (
            <View style={{ marginBottom: scaleSzie(10), marginTop: scaleSzie(10) }} >
                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10) }} >
                    Image
                </Text>
                <View style={{ flexDirection: 'row' }} >
                    <View style={{ width: scaleSzie(80), height: scaleSzie(80) }} >
                        <Image source={temptImage} style={{ width: scaleSzie(80), height: scaleSzie(80) }} />
                    </View>
                    <View style={{ justifyContent: 'flex-end', marginLeft: scaleSzie(16) }} >
                        <ButtonCustom
                            width={scaleSzie(150)}
                            height={38}
                            backgroundColor="#F1F1F1"
                            title={'Browse File'}
                            textColor="#6A6A6A"
                            onPress={this.showPicker}
                            style={[{ borderRadius: scaleSzie(2) }, styles.shadowBtn]}
                            styleText={{
                                fontSize: scaleSzie(16)
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    shadowBtn: {
        ...Platform.select({
            ios: {
                borderRadius: scaleSzie(2),
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 0 },
            },

            android: {
                elevation: 2,
            },
        })
    },
})