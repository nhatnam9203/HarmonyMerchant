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
import connectRedux from '@redux/ConnectRedux';

import { scaleSzie } from '@utils';

class BrowserFile extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            uriUpload: this.props.imageUrl,
            isProcessingUpload: false
        }
    }

    showPicker = () => {
        ImagePicker.showImagePicker({
            quality: 0.2
        }, (response) => {
            if (response.uri) {
                this.setState({
                    uriUpload: response.uri,
                    isProcessingUpload: true
                });
                let fileName = response.fileName;
                if (Platform.OS === 'ios' && (fileName.endsWith('.heic') || fileName.endsWith('.HEIC'))) {
                    fileName = `${fileName.split(".")[0]}.JPG`;
                }
                this.props.actions.upload.uploadAvatar([{
                    uri: response.uri,
                    fileName: fileName,
                    type: response.type
                }]);
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, isUpload, dataUpload } = this.props;
        const { isProcessingUpload } = this.state;
        if (!loading && isUpload && isProcessingUpload) {
            // console.log('fileId : ' + dataUpload.fileId);
            this.setState({
                isProcessingUpload: false,
                fileId: dataUpload.fileId
            });
            this.props.updateFileId(dataUpload.fileId);
        }
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

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    loading: state.app.loading,
    isUpload: state.upload.isUpload,
    dataUpload: state.upload.dataUpload
})



export default connectRedux(mapStateToProps, BrowserFile);