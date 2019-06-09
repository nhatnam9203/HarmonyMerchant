import ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';
import strings from './strings';

class PrincipalScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
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
                dateOfBirth: '',
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

    nextScreen = () => {
        const { principalInfo } = this.state;
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

            } else {
                if (principalInfo[arrayKey[i]] === '') {
                    keyError = arrayKey[i];
                    break;
                }
            }
        }
        if (keyError !== '') {
            Alert.alert(`Missing info : ${strings[keyError]}`);
        } else {
            this.props.navigation.navigate('ApplicationSubmit');
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



export default connectRedux(mapStateToProps, PrincipalScreen);