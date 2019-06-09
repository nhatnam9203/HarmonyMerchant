import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';
import strings from './strings';
import {validateEmail} from '../../utils';

class GeneralInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            generalInfo: {
                businessName: '',
                doingBusiness: '',
                tax: {
                    prefix: '',
                    suffix: ''
                },
                businessAddress: {
                    address: '',
                    city: '',
                    state: '',
                    zip: ''
                },
                businessPhone: '',
                email: '',
                firstName: '',
                lastName: '',
                position: '',
                contactPhone: ''
            }
        }
    }

    updateGeneralInfo(key, value, keyParent = '') {
        const { generalInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = generalInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...generalInfo, [keyParent]: temptChild };
            this.setState({
                generalInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...generalInfo, [key]: value };
            this.setState({
                generalInfo: temptUpdate
            })
        }
    }

    nextTab = () => {
        const { generalInfo } = this.state;
        const arrayKey = Object.keys(generalInfo);
        let keyError = '';
        for (let i = 0; i < arrayKey.length; i++) {
            if (arrayKey[i] == 'tax') {
                if (generalInfo.tax.prefix == '') {
                    keyError = 'taxPrefix';
                    break;
                }
                if (generalInfo.tax.suffix == '') {
                    keyError = 'taxSuffix';
                    break;
                }
            } else if (arrayKey[i] == 'businessAddress') {
                if (generalInfo.businessAddress.address == '') {
                    keyError = 'address';
                    break;
                }
                if (generalInfo.businessAddress.city == '') {
                    keyError = 'city';
                    break;
                }
                if (generalInfo.businessAddress.state == '') {
                    keyError = 'state';
                    break;
                }
                if (generalInfo.businessAddress.zip == '') {
                    keyError = 'zip';
                    break;
                }

            } 
            else if(arrayKey[i] == 'email'){
                if(!validateEmail(generalInfo[arrayKey[i]])){
                    keyError = 'emailInvalid';
                    break;
                }
            }
            else {
                if (generalInfo[arrayKey[i]] === '') {
                    keyError = arrayKey[i];
                    break;
                }
            }
        }
        if (keyError !== '') {
            Alert.alert(`Missing info : ${strings[keyError]}`);
        } else {
            this.props.navigation.navigate('BusinessInfo');
        }

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, GeneralInfoScreen);