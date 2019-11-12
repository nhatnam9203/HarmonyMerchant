import React from 'react';
import ImagePicker from 'react-native-image-picker';
import { Alert, Platform } from 'react-native';
import moment from 'moment';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { validateIsNumber, getIdStateByName, gotoSettingsDevice, validateEmail, scaleSzie, checkStateIsValid } from '@utils';

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
                email: '',
                driverLicense: '',
                stateIssued: ''
            },
            showCalendar: false,
            dateOfBirth: new Date()
        };
        this.uploadVoidCheckRef = React.createRef();
        this.homePhoneRef = React.createRef();
        this.mobilePhoneRef = React.createRef();
        this.srollPrincipalRef = React.createRef();
    }

    scrollPrincipalTo(position) {
        this.srollPrincipalRef.current.scrollTo({ x: 0, y: scaleSzie(position), animated: true })
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
        const { stateCity } = this.props;
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
                if (!checkStateIsValid(stateCity, principalInfo.addressPrincipal.state)) {
                    keyError = 'stateInvalid';
                    break;
                }
                if (principalInfo.addressPrincipal.zip == '') {
                    keyError = 'zip';
                    break;
                }

            }
            // else if (arrayKey[i] == 'yearAtThisAddress' && !validYear(principalInfo[arrayKey[i]])) {
            //     keyError = 'yearInvalid';
            //     break;
            // } 
            else if (arrayKey[i] == 'email') {
                if (!validateEmail(principalInfo[arrayKey[i]])) {
                    keyError = 'emailInvalid';
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
                        if (!validateIsNumber(principalInfo[arrayKey[i]])) {
                            keyError = 'yearAtThisAddressInvalid';
                            break;
                        }
                    } else if (arrayKey[i] === 'ssn') {
                        if (!validateIsNumber(principalInfo[arrayKey[i]])) {
                            keyError = 'ssnInvalid';
                            break;
                        }
                    }
                    else if (arrayKey[i] === 'driverLicense') {
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
                const { addressPrincipal } = principalInfo;
                const temptAddressPrincipal = { ...addressPrincipal, state: getIdStateByName(stateCity, addressPrincipal.state) };
                const temptPrincipalInfo = {
                    ...principalInfo,
                    homePhone: `${this.homePhoneRef.current.state.codeAreaPhone}${principalInfo.homePhone}`,
                    mobilePhone: `${this.mobilePhoneRef.current.state.codeAreaPhone}${principalInfo.mobilePhone}`,
                    dateOfBirth: `${moment(this.state.dateOfBirth).format('MM/DD/YYYY')}`,
                    fileId: this.state.fileId,
                    addressPrincipal: temptAddressPrincipal
                };
                this.props.actions.app.setPrincipalInfo(temptPrincipalInfo);
                this.props.navigation.navigate('ApplicationSubmit');
            } else {
                Alert.alert(`Please upload a photo`);
            }


        }
    }

    setDateSelected = (date) => {
        this.setState({
            dateOfBirth: date
        })
    }


    showCalendar = () => {
        this.setState({
            showCalendar: true
        })
    }

    handleVoidCheck = async (response) => {
        if (response.error === "Photo library permissions not granted") {
            gotoSettingsDevice();
        } else if (response.uri) {
            let fileName = response.fileName;
            if (fileName) {
                if (Platform.OS === 'ios' && (fileName.endsWith('.heic') || fileName.endsWith('.HEIC'))) {
                    fileName = `${fileName.split(".")[0]}.JPG`;
                }
            }

            this.uploadVoidCheckRef.current.setStateFromparent({
                uri: response.uri,
                fileName: fileName,
                type: response.type
            })
            await this.setState({
                visibleUpload: true
            })
        }

    }

    takePhoto = () => {
        ImagePicker.launchCamera({}, (response) => {
            if (response.uri) {
                this.handleVoidCheck(response);
            }
        });
    }

    openImageLibrary = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.uri) {
                this.handleVoidCheck(response);
            }
        });
    }

    saveVoidCheck = (value) => {
        this.props.actions.upload.uploadAvatar([value]);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isUpload, dataUpload } = this.props;
        const { isActiveScreen } = this.state;
        if (isUpload && isActiveScreen && isUpload !== prevProps.isUpload) {
            await this.setState({
                savaFileUpload: true,
                visibleUpload: false,
                uriUpload: dataUpload.url,
                fileId: dataUpload.fileId
            });
            this.props.actions.upload.resetStateUpload();
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
    dataUpload: state.upload.dataUpload,
    stateCity: state.dataLocal.stateCity
})



export default connectRedux(mapStateToProps, PrincipalScreen);