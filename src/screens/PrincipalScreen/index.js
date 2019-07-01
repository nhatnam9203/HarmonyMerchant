import ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { validateIsNumber } from '@utils';

class PrincipalScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            visibleUpload: false,
            uriUpload: '',
            savaFileUpload: false,
            isActiveScreen: true,
            fileUpload: {},
            fileId: -1,
            principalInfo: {
                firstName: '',
                lastName: '',
                position: '',
                ownership: '',
                homePhone: '',
                mobilePhone: '',
                addressPrincipal: {
                    address: '',
                    city: '',
                    state: '',
                    zip: ''
                },
                yearAtThisAddress: "",
                ssn: '',
                dateOfBirth: {
                    day: '',
                    month: '',
                    year: ''
                },
                email: '',
                driverLicense: '',
                stateIssued: ''
            },
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

    updatePrincipalInfo(key, value, keyParent = '') {
        const { principalInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = principalInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...principalInfo, [keyParent]: temptChild };
            this.setState({
                principalInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...principalInfo, [key]: value };
            this.setState({
                principalInfo: temptUpdate
            })
        }
    }

    nextScreen = () => {
        const { principalInfo, uriUpload } = this.state;
        const arrayKey = Object.keys(principalInfo);
        let keyError = '';
        for (let i = 0; i < arrayKey.length; i++) {
            if (arrayKey[i] == 'addressPrincipal') {
                if (principalInfo.addressPrincipal.address == '') {
                    keyError = 'address';
                    break;
                }
                if (principalInfo.addressPrincipal.city == '') {
                    keyError = 'city';
                    break;
                }
                if (principalInfo.addressPrincipal.state == '') {
                    keyError = 'state';
                    break;
                }
                if (principalInfo.addressPrincipal.zip == '') {
                    keyError = 'zip';
                    break;
                }

            } else if (arrayKey[i] == 'dateOfBirth') {
                if (principalInfo.dateOfBirth.day == '') {
                    keyError = 'day';
                    break;
                }
                if (principalInfo.dateOfBirth.month == '') {
                    keyError = 'month';
                    break;
                }
                if (principalInfo.dateOfBirth.year == '') {
                    keyError = 'year';
                    break;
                }
            }

            else {
                if (principalInfo[arrayKey[i]] === '') {
                    keyError = arrayKey[i];
                    break;
                } else {
                    if (arrayKey[i] === 'homePhone') {
                        if (!validateIsNumber(principalInfo[arrayKey[i]])) {
                            keyError = 'homePhoneNotNumber';
                            break;
                        }
                    } else if (arrayKey[i] === 'mobilePhone') {
                        if (!validateIsNumber(principalInfo[arrayKey[i]])) {
                            keyError = 'mobilePhoneNotNumber';
                            break;
                        }
                    } else if (arrayKey[i] === 'yearAtThisAddress') {
                        if (!validateIsNumber(principalInfo[arrayKey[i]]) || (principalInfo[arrayKey[i]]).length !== 4) {
                            keyError = 'yearAtThisAddressInvalid';
                            break;
                        }
                    } else if (arrayKey[i] === 'ssn') {
                        if (!validateIsNumber(principalInfo[arrayKey[i]])) {
                            keyError = 'ssnInvalid';
                            break;
                        }
                    }
                    else if (arrayKey[i] ===  'driverLicense') {
                        if (!validateIsNumber(principalInfo[arrayKey[i]])) {
                            keyError = 'driverLicenseInvalid';
                            break;
                        }
                    }
                }
            }
        }
        if (keyError !== '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            if (uriUpload != '') {
                const { dateOfBirth } = principalInfo;
                const temptPrincipalInfo = { ...principalInfo, dateOfBirth: `${dateOfBirth.day}/${dateOfBirth.month}/${dateOfBirth.year}`,
                fileId: this.state.fileId 
            };
                this.props.actions.app.setPrincipalInfo(temptPrincipalInfo);
                this.props.navigation.navigate('ApplicationSubmit');
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
    language: state.dataLocal.language,
    loading: state.app.loading,
    isUpload: state.upload.isUpload,
    dataUpload: state.upload.dataUpload
})



export default connectRedux(mapStateToProps, PrincipalScreen);