import ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';
import strings from './strings';

class PrincipalScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            visibleUpload: false,
            uriUpload: '',
            savaFileUpload: false,
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

    nextScreen1 = () => {
        this.props.navigation.navigate('ApplicationSubmit');
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
                }
            }
        }
        if (keyError !== '') {
            Alert.alert(`Missing info : ${strings[keyError]}`);
        } else {
            if (uriUpload != '') {
                const { dateOfBirth } = principalInfo;
                const temptPrincipalInfo = { ...principalInfo, dateOfBirth: `${dateOfBirth.day}/${dateOfBirth.month}/${dateOfBirth.year}` };
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
                    visibleUpload: true
                })
            }
        });
    }

    saveFileUpload = () => {
        this.setState({
            savaFileUpload: true,
            visibleUpload: false,
        })
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, PrincipalScreen);