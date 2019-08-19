import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import * as Progress from 'react-native-progress';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';
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
        const { title, visible, onRequestClose, save } = this.props;
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
                    height: scaleSzie(350), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{ height: scaleSzie(200), paddingHorizontal: scaleSzie(30), paddingVertical: scaleSzie(15) }} >
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
                    <View style={{ flex: 1, paddingHorizontal: scaleSzie(30) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                            Uploading
                        </Text>
                        <View style={{
                            height: scaleSzie(60),
                            flexDirection: 'row'
                        }} >
                            <Image source={IMAGE.iconUpload} style={{ height: scaleSzie(45), width: scaleSzie(45), marginTop: scaleSzie(5) }} />
                            <View style={{ flex: 1, paddingLeft: scaleSzie(30) }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(12) }} >
                                        Void Check.jpg
                                    </Text>
                                    <Progress.Bar progress={this.state.progress} width={scaleSzie(265)} color="#4CD964" />
                                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginTop: scaleSzie(8) }} >
                                        {`${this.state.progress}%`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            flex: 1, alignItems: 'center', justifyContent: 'flex-end',
                            paddingBottom: scaleSzie(10)
                        }} >
                            {
                                loadingUpload ? <ActivityIndicator
                                    color="#4CD964"
                                    size="large"
                                /> : <ButtonCustom
                                        width={scaleSzie(100)}
                                        height={35}
                                        backgroundColor={temtpColorBtnSave}
                                        title="Save"
                                        textColor={temtpColorTextSave}
                                        onPress={this.saveVoidCheck}
                                        style={{
                                            borderWidth: 1, borderColor: '#C5C5C5',
                                            borderRadius: scaleSzie(4)
                                        }}
                                        styleText={{
                                            fontSize: scaleSzie(14),
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
})

export default PopupUpload;

