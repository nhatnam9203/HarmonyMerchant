import React from 'react';
import ImagePicker from 'react-native-image-picker';
import { Alert, Platform } from 'react-native';
import moment from 'moment';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { validateIsNumber, getIdStateByName, gotoSettingsDevice, validateEmail, scaleSzie, checkStateIsValid } from '@utils';

const initalStatePrincipal2 = {
    principalInfo2: {
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
    isShowPrincipal2: false,
    uriUploadPrincipal2: "",
    dateOfBirthPrincipal2: new Date(),
    fileIdPrincipal2: -1,

    phoneCodePrincipal1: {
        homePhone: "+1",
        mobilePhone: "+1"
    },
    phoneCodePrincipal2: {
        homePhone: "+1",
        mobilePhone: "+1"
    }
}

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
            dateOfBirth: new Date(),
            isShowPrincipal1: true,
            ...initalStatePrincipal2
        };
        this.uploadVoidCheckRef = React.createRef();
        this.homePhoneRef = React.createRef();
        this.mobilePhoneRef = React.createRef();
        this.srollPrincipalRef = React.createRef();
        this.principalFirstRef = React.createRef();
        this.principalSecondRef = React.createRef();

    }

    showPrincipal1 = () => {
        this.setState(prevState => ({
            isShowPrincipal1: !prevState.isShowPrincipal1,
        }), () => {
            this.setState({
                isShowPrincipal2: this.state.isShowPrincipal1 ? false : this.state.isShowPrincipal2
            })
        })
    }

    showPrincipal2 = () => {
        this.setState(prevState => ({
            isShowPrincipal2: !prevState.isShowPrincipal2
        }), () => {
            this.setState({
                isShowPrincipal1: this.state.isShowPrincipal2 ? false : this.state.isShowPrincipal1
            }, () => {
                if (!this.state.isShowPrincipal1 && this.state.isShowPrincipal2) {
                    this.srollPrincipalRef.current.scrollTo({ x: 0, y: 0, animated: false })
                }
            })
        })
    }

    scrollPrincipalTo = (position) => {
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

    updatePhoneCode = async (code, key, isPrincipalSecond) => {
        const { phoneCodePrincipal1, phoneCodePrincipal2 } = this.state;
        const temptPhoneCode = isPrincipalSecond ? phoneCodePrincipal2 : phoneCodePrincipal1;
        const temptUpdate = { ...temptPhoneCode, [key]: code };
        if (isPrincipalSecond) {
            await this.setState({
                phoneCodePrincipal2: temptUpdate
            })
        } else {
            await this.setState({
                phoneCodePrincipal1: temptUpdate
            })
        }

    }

    updatePrincipalInfo = (key, value, keyParent = '', isPrincipalSecond) => {
        const { principalInfo, principalInfo2 } = this.state;
        const temptPrincipal = isPrincipalSecond ? principalInfo2 : principalInfo;
        if (keyParent !== '') {
            const temptParent = temptPrincipal[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...temptPrincipal, [keyParent]: temptChild };
            if (isPrincipalSecond) {
                this.setState({
                    principalInfo2: temptUpdate
                })
            } else {
                this.setState({
                    principalInfo: temptUpdate
                })
            }


        } else {
            const temptUpdate = { ...temptPrincipal, [key]: value };
            if (isPrincipalSecond) {
                this.setState({
                    principalInfo2: temptUpdate
                })
            } else {
                this.setState({
                    principalInfo: temptUpdate
                })
            }

        }
    }

    checkPrincipalInfo2Valid =  () => {
        const { principalInfo2, uriUploadPrincipal2 } = this.state;
        const arrayKey = Object.keys(principalInfo2);
        const { stateCity } = this.props;
        let keyError = '';
        let isMustCheck = false;
        for (let i = 0; i < arrayKey.length; i++) {
            if (principalInfo2[arrayKey[i]] !== '' && arrayKey[i] !== 'addressPrincipal') {
                isMustCheck = true;
                break;
            }
        }
        if (isMustCheck) {
            for (let i = 0; i < arrayKey.length; i++) {
                if (arrayKey[i] == 'addressPrincipal') {
                    if (principalInfo2.addressPrincipal.address == '') {
                        keyError = 'address';
                        break;
                    }
                    if (principalInfo2.addressPrincipal.city == '') {
                        keyError = 'city';
                        break;
                    }
                    if (principalInfo2.addressPrincipal.state == '') {
                        keyError = 'state';
                        break;
                    }
                    if (!checkStateIsValid(stateCity, principalInfo2.addressPrincipal.state)) {
                        keyError = 'stateInvalid';
                        break;
                    }
                    if (principalInfo2.addressPrincipal.zip == '') {
                        keyError = 'zip';
                        break;
                    }

                }
                else if (arrayKey[i] == 'email') {
                    if (!validateEmail(principalInfo2[arrayKey[i]])) {
                        keyError = 'emailInvalid';
                        break;
                    }
                }

                else {
                    if (principalInfo2[arrayKey[i]] === '') {
                        keyError = arrayKey[i];
                        break;
                    } else {
                        if (arrayKey[i] === 'yearAtThisAddress') {
                            if (!validateIsNumber(principalInfo2[arrayKey[i]])) {
                                keyError = 'yearAtThisAddressInvalid';
                                break;
                            }
                        }
                    }
                }
            }
            // ------- Handle Error ------
            if (keyError !== '') {
                Alert.alert(`${strings[keyError]} in Principal 2 infomation!`);
                return 0     // ------ Error ----
            } else {
                if (uriUploadPrincipal2 === '') {
                    Alert.alert(`Please upload a photo for Pricipal 2`);
                    return 0 // ------ Error ----
                } else {
                    return 2; // ------ Add 2 Principal  ----
                }

            }
        } else {
            return 1; // ------ Add 1 Principal  ----
        }
    }

    nextScreen = () => {
        const { principalInfo, uriUpload, phoneCodePrincipal2, phoneCodePrincipal1,
            principalInfo2
        } = this.state;
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
                    if (arrayKey[i] === 'yearAtThisAddress') {
                        if (!validateIsNumber(principalInfo[arrayKey[i]])) {
                            keyError = 'yearAtThisAddressInvalid';
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
                    homePhone: `${phoneCodePrincipal1.homePhone}${principalInfo.homePhone}`,
                    mobilePhone: `${phoneCodePrincipal1.mobilePhone}${principalInfo.mobilePhone}`,
                    dateOfBirth: `${moment(this.state.dateOfBirth).format('MM/DD/YYYY')}`,
                    fileId: this.state.fileId,
                    addressPrincipal: temptAddressPrincipal
                };

                // -------- handle principal 2 -------
                const result = this.checkPrincipalInfo2Valid();
                console.log('result : ',result);
                if (result === 1) {
                    
                    this.props.actions.app.setPrincipalInfo([temptPrincipalInfo]);
                    this.props.navigation.navigate('ApplicationSubmit');
                } else if (result === 2) {
                    const { addressPrincipal: addressPrincipalSecond } = principalInfo2;
                    const temptAddressPrincipalSecond = { ...addressPrincipalSecond, state: getIdStateByName(stateCity, addressPrincipalSecond.state) };
                    const temptPrincipalSecondInfo = {
                        ...principalInfo2,
                        homePhone: `${phoneCodePrincipal2.homePhone}${principalInfo2.homePhone}`,
                        mobilePhone: `${phoneCodePrincipal2.mobilePhone}${principalInfo2.mobilePhone}`,
                        dateOfBirth: `${moment(this.state.dateOfBirthPrincipal2).format('MM/DD/YYYY')}`,
                        fileId: this.state.fileIdPrincipal2,
                        addressPrincipal: temptAddressPrincipalSecond
                    };
                    this.props.actions.app.setPrincipalInfo([temptPrincipalInfo, temptPrincipalSecondInfo]);
                    this.props.navigation.navigate('ApplicationSubmit');
                }


            } else {
                Alert.alert(`Please upload a photo`);
            }


        }
    }

    setDateSelected = (date) => {
        if (this.state.isShowPrincipal1) {
            this.setState({
                dateOfBirth: date
            })
        } else {
            this.setState({
                dateOfBirthPrincipal2: date
            })
        }

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
        const { isActiveScreen, isShowPrincipal1 } = this.state;
        if (isUpload && isActiveScreen && isUpload !== prevProps.isUpload) {
            if (isShowPrincipal1) {
                await this.setState({
                    savaFileUpload: true,
                    visibleUpload: false,
                    uriUpload: dataUpload.url,
                    fileId: dataUpload.fileId
                });
            } else {
                await this.setState({
                    savaFileUpload: true,
                    visibleUpload: false,
                    uriUploadPrincipal2: dataUpload.url,
                    fileIdPrincipal2: dataUpload.fileId
                });
            }

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