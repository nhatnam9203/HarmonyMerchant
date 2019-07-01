import React from 'react';
import ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { validateIsNumber } from '@utils';

class BankInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            visibleUpload: false,
            uriUpload: '',
            savaFileUpload: false,
            isActiveScreen: true,
            fileUpload: {},
            fileId: -1,
            bankInfo: {
                bankName: '',
                routingNumber: '',
                accountNumber: '',
            }
        }
    }

    componentDidMount() {
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isActiveScreen: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isActiveScreen: true
                })
            }
        );
    }

    updateBankInfo(key, value, keyParent = '') {
        const { bankInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = bankInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...bankInfo, [keyParent]: temptChild };
            this.setState({
                bankInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...bankInfo, [key]: value };
            this.setState({
                bankInfo: temptUpdate
            })
        }
    }

    nextSreen = () => {
        const { bankInfo, uriUpload } = this.state;
        const arrayKey = Object.keys(bankInfo);
        let keyError = '';
        for (let i = 0; i < arrayKey.length; i++) {
            if (bankInfo[arrayKey[i]] === '') {
                keyError = arrayKey[i];
                break;
            } else {
                if (arrayKey[i] === 'routingNumber') {
                    if (!validateIsNumber(bankInfo[arrayKey[i]])) {
                        keyError = 'routingNumberNotNumber';
                        break;
                    }
                } else if (arrayKey[i] === 'accountNumber') {
                    if (!validateIsNumber(bankInfo[arrayKey[i]])) {
                        keyError = 'accountNumberNotNumber';
                        break;
                    }
                }
            }
        }
        if (keyError !== '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            if (uriUpload != '') {
                const temptBankInfo = {...bankInfo,fileId:this.state.fileId};
                this.props.actions.app.setBankInfo(temptBankInfo);
                this.props.navigation.navigate('PrincipalInfo');
            } else {
                Alert.alert(`Please upload a photo`);
            }

        }
    }

    takePhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.uri) {
                this.setState({
                    uriUpload: response.uri,
                    visibleUpload: true
                })
            }
        });
    }

    openImageLibrary = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri) {
                this.setState({
                    uriUpload: response.uri,
                    fileUpload: {
                        uri: response.uri,
                        fileName: response.fileName,
                        type: response.type
                    },
                    visibleUpload: true
                })
            }
        });
    }

    saveFileUpload = () => {
        const { fileUpload } = this.state;
        this.props.actions.upload.uploadAvatar([fileUpload]);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, isUpload, dataUpload } = this.props;
        const { isActiveScreen, visibleUpload } = this.state;
        if (!loading && isUpload && isActiveScreen && visibleUpload) {
            this.setState({
                savaFileUpload: true,
                visibleUpload: false,
                fileId: dataUpload.fileId
            })
        }
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    loading: state.app.loading,
    isUpload: state.upload.isUpload,
    dataUpload: state.upload.dataUpload
})



export default connectRedux(mapStateToProps, BankInfoScreen);