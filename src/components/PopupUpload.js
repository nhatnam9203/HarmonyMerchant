import React from 'react';
import {
    View,
    Image,
    Text,
    ActivityIndicator
} from 'react-native';
import * as Progress from 'react-native-progress';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSize } from '../utils';
import IMAGE from '../resources';

class PopupUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            loadingUpload: false,
            voidCheck: {
                uri: '',
                fileName: '',
                type: ''
            }
        }
    }

    loadVoidCheckSuccess = async (value) => {
        await this.setState({ progress: 100 });
    }

    setStateFromparent = async (value) => {
        await this.setState({
            voidCheck: value,
            progress: 0,
            loadingUpload: false
        })
    }

    saveVoidCheck = async () => {
        await this.setState({
            loadingUpload: true
        })
        this.props.saveVoidCheck({ ...this.state.voidCheck });
    }

    render() {
        const { title, visible, onRequestClose, save,isPricipal } = this.props;
        const { progress, voidCheck, loadingUpload } = this.state;
        const temtpColorBtnSave = progress == 100 ? '#4CD964' : '#F1F1F1';
        const temtpColorTextSave = progress == 100 ? '#ffff' : '#C5C5C5';
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => {
                    onRequestClose();
                    this.setState({
                        progress: 0
                    })
                }}
            >
                <View style={{
                    height: scaleSize(350), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15)
                }} >
                    <View style={{ height: scaleSize(200), paddingHorizontal: scaleSize(30), paddingVertical: scaleSize(15) }} >
                        <View style={{
                            flex: 1, backgroundColor: '#FAFAFA',
                            borderWidth: 1, borderColor: '#C5C5C5'
                        }} >
                            <Image
                                source={{ uri: voidCheck.uri }}
                                style={{ width: null, height: null, flex: 1 }}
                                onLoadEnd={this.loadVoidCheckSuccess}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: scaleSize(30) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSize(14) }} >
                            Uploading
                        </Text>
                        <View style={{
                            height: scaleSize(60),
                            flexDirection: 'row'
                        }} >
                            <Image source={IMAGE.iconUpload} style={{ height: scaleSize(45), width: scaleSize(45), marginTop: scaleSize(5) }} />
                            <View style={{ flex: 1, paddingLeft: scaleSize(30) }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(12) }} >
                                       
                                        {
                                            isPricipal ? "DriverLicense.jpg" : "VoidCheck.jpg"
                                        }
                                    </Text>
                                    <Progress.Bar progress={this.state.progress} width={scaleSize(265)} color="#4CD964" />
                                    <Text style={{ color: '#404040', fontSize: scaleSize(12), marginTop: scaleSize(8) }} >
                                        {`${this.state.progress}%`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            flex: 1, alignItems: 'center', justifyContent: 'flex-end',
                            paddingBottom: scaleSize(10)
                        }} >
                            {
                                loadingUpload ? <ActivityIndicator
                                    color="#4CD964"
                                    size="large"
                                /> : <ButtonCustom
                                        width={scaleSize(100)}
                                        height={35}
                                        backgroundColor={temtpColorBtnSave}
                                        title="Save"
                                        textColor={temtpColorTextSave}
                                        onPress={this.saveVoidCheck}
                                        style={{
                                            borderWidth: 1, borderColor: '#C5C5C5',
                                            borderRadius: scaleSize(4)
                                        }}
                                        styleText={{
                                            fontSize: scaleSize(14),
                                            fontWeight: '500'
                                        }}
                                    />
                            }

                        </View>
                    </View>
                </View>
            </PopupParent>
        );
    }

}


export default PopupUpload;

