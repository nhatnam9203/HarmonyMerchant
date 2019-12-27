import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { validateEmail, validateIsNumber, getIdStateByName, requestAPI ,scaleSzie,checkStateIsValid} from '@utils';
import apiConfigs from '@configs/api';


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
        };
        this.businessPhoneRef = React.createRef();
        this.contactPhoneRef = React.createRef();
        this.srollGeneralRef = React.createRef();
    }

    scrollGeneralTo(position){
        this.srollGeneralRef.current.scrollTo({x: 0, y: scaleSzie(position), animated: true})
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


    nextTab = async () => {
        const { generalInfo } = this.state;
        const arrayKey = Object.keys(generalInfo);
        const {stateCity} = this.props;
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

                if (!checkStateIsValid(stateCity,generalInfo.businessAddress.state)) {
                    keyError = 'stateInvalid';
                    break;
                }
                
                if (generalInfo.businessAddress.zip == '') {
                    keyError = 'zip';
                    break;
                }

            }
            else if (arrayKey[i] == 'email') {
                if (!validateEmail(generalInfo[arrayKey[i]])) {
                    keyError = 'emailInvalid';
                    break;
                }
            }
            else {
                if (generalInfo[arrayKey[i]] === '') {
                    keyError = arrayKey[i];
                    break;
                } else {
                    // if (arrayKey[i] === 'businessPhone') {
                    //     if (!validateIsNumber(generalInfo[arrayKey[i]])) {
                    //         keyError = 'businessPhoneNotNumber';
                    //         break;
                    //     }
                    // } else if (arrayKey[i] === 'contactPhone') {
                    //     if (!validateIsNumber(generalInfo[arrayKey[i]])) {
                    //         keyError = 'contactPhoneNotNumber';
                    //         break;
                    //     }
                    // }
                }
            }
        }

        if (keyError !== '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            const { businessAddress } = generalInfo;
            const temptBusinessAddress = { ...businessAddress, state: getIdStateByName(stateCity, businessAddress.state) };
            const temptGeneralInfo = {
                ...generalInfo,
                tax: `${generalInfo.tax.prefix}-${generalInfo.tax.suffix}`,
                businessPhone: `${this.businessPhoneRef.current.state.codeAreaPhone}${generalInfo.businessPhone}`,
                contactPhone: `${this.contactPhoneRef.current.state.codeAreaPhone}${generalInfo.contactPhone}`,
                businessAddress: temptBusinessAddress
            };

            //  ---- Check Email Exist ----
            this.props.actions.app.loadingApp();
            try {
                const responses = await requestAPI({
                    method: 'GET',
                    api: `${apiConfigs.BASE_API}merchant/checkEmail?email=${generalInfo.email}`
                });
            //console.log('responses : ',responses);
                this.props.actions.app.stopLoadingApp();
                const { codeNumber } = responses;
                if (parseInt(codeNumber) == 200) {
                    this.props.actions.app.setGeneralInfo(temptGeneralInfo);
                    this.props.navigation.navigate('BusinessInfo');
                } else {
                    this.props.actions.app.showMessageError(responses.message);
                }
            } catch (error) {
                this.props.actions.app.stopLoadingApp();
                this.props.actions.app.catchError(error);
            }
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    stateCity: state.dataLocal.stateCity
})



export default connectRedux(mapStateToProps, GeneralInfoScreen);