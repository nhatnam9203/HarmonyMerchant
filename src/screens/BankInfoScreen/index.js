import React from 'react';
import ImagePicker from 'react-native-image-picker';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

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

    nextSreen = () => {
        this.props.navigation.navigate('BankInfo');
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