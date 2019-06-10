import React from 'react';
import ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';
import strings from './strings';

class BankInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            bankInfo: {
                bankName: '',
                routingNumber: '',
                accountNumber: '',
            }
        }
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

    nextSreen1 = () => {
        this.props.navigation.navigate('PrincipalInfo');
    }

    nextSreen = () => {
        // this.props.navigation.navigate('PrincipalInfo');
        const { bankInfo } = this.state;
        const arrayKey = Object.keys(bankInfo);
        let keyError = '';
        for (let i = 0; i < arrayKey.length; i++) {
            if (bankInfo[arrayKey[i]] === '') {
                keyError = arrayKey[i];
                break;
            }
        }
        if (keyError !== '') {
            Alert.alert(`Missing info : ${strings[keyError]}`);
        } else {
            this.props.navigation.navigate('PrincipalInfo');
            this.props.actions.app.setBankInfo(bankInfo);
        }
    }

    takePhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.uri) {

            }
        });
    }

    openImageLibrary = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri) {
                console.log(response.uri);
            }
        });
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, BankInfoScreen);