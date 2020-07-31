import React from 'react';
import { Alert } from 'react-native';
import _ from 'ramda';

import Layout from './layout';
import strings from './strings';
import {
    validateEmail, getIdStateByName, getNameStateById, getCodeAreaPhone, scaleSzie, checkStateIsValid,
    BusinessWorkingTime
} from '@utils';

class AddStaff extends Layout {

    constructor(props) {
        super(props);

        const { profile } = this.props;

        this.state = {
            user: {
                firstName: '',
                lastName: '',
                displayName: '',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zip: ''
                },
                cellphone: '',
                email: '',
                pin: '',
                confirmPin: '',
                isActive: true,
                isDisabled: 'Active',
                roles: {
                    nameRole: 'Admin',
                },
                driverlicense: '',
                socialSecurityNumber: '',
                professionalLicense: '',
            },
            staffId: '',
            workingTime: profile.businessHour ? profile.businessHour : BusinessWorkingTime,
            tipFee: {
                percent: {
                    value: '',
                    isCheck: false,
                },
                fixedAmount: {
                    value: '',
                    isCheck: false,
                }
            },
            salary: {
                perHour: {
                    value: '',
                    isCheck: false
                },
                commission: {
                    value: '',
                    isCheck: false
                }
            },
            productSalary: {
                commission: {
                    value: 0,
                    isCheck: false
                }
            },
            fileId: 0,
            imageUrl: '',
            isSubmitButton: true,
            value: {},
            dynamicMarginBottomState: 24
        }
        // ---- Refs ----
        this.inputRefsTime = [];
        this.browserFileRef = React.createRef();
        this.cellphoneRef = React.createRef();
        this.scrollStaffRef = React.createRef();
        this.perHourServiceSalaryRef = React.createRef();
        this.commissionSalaryRef = React.createRef();
        this.percentTipFeeRef = React.createRef();
        this.fixedAmountTipFeeRef = React.createRef();
        this.commisionProductScalaryRef = React.createRef();

    }

    scrollStaffTo(position) {
        this.scrollStaffRef.current.scrollTo({ x: 0, y: scaleSzie(position), animated: true })
    }

    async componentDidMount() {
        if (this.props.isEditStaff) {
            const { infoStaffHandle, stateCity } = this.props;
            await this.setState({
                user: {
                    firstName: infoStaffHandle.firstName,
                    lastName: infoStaffHandle.lastName,
                    displayName: infoStaffHandle.displayName,
                    address: {
                        street: infoStaffHandle.address,
                        city: infoStaffHandle.city,
                        state: getNameStateById(stateCity, infoStaffHandle.stateId),
                        zip: infoStaffHandle.zip
                    },
                    cellphone: getCodeAreaPhone(infoStaffHandle.phone).phone,
                    email: infoStaffHandle.email,
                    pin: infoStaffHandle.pin,
                    confirmPin: infoStaffHandle.pin,
                    isActive: infoStaffHandle.isActive ? infoStaffHandle.isActive : false,
                    isDisabled: infoStaffHandle.isDisabled === 0 ? 'Active' : 'Disable',
                    roles: {
                        nameRole: infoStaffHandle.roleName,
                    },
                    driverlicense: infoStaffHandle.driverLicense,
                    socialSecurityNumber: infoStaffHandle.ssn,
                    professionalLicense: infoStaffHandle.professionalLicense,
                },
                staffId: infoStaffHandle.staffId,
                fileId: infoStaffHandle.fileId,
                imageUrl: infoStaffHandle.imageUrl
            });
            this.browserFileRef.current.setImageUrlFromParent(infoStaffHandle.imageUrl);
            this.cellphoneRef.current.setcodeAreaPhoneFromParent(getCodeAreaPhone(infoStaffHandle.phone).areaCode);
        }
    }

    editButtonSubmit = async (isSubmit) => {
        await this.setState({
            isSubmitButton: isSubmit
        })
    }

    setStaffInfoFromParent = staff => {
    }

    setRefTimeWorking = (ref) => {
        if (ref) {
            this.inputRefsTime.push(ref);
        }
    };

    updateFileId = async (fileId) => {
        await this.setState({
            fileId
        })
    }

    addAdmin = () => {
        const { user } = this.state;
        const { stateCity } = this.props;
        const arrayKey = Object.keys(user);
        let keyError = '';
        for (let i = 0; i < arrayKey.length; i++) {
            if (arrayKey[i] == 'address') {
                if (user.address.state !== '' && !checkStateIsValid(stateCity, user.address.state)) {
                    keyError = 'stateInvalid';
                    break;
                }
            } else if (arrayKey[i] == 'roles') {
                if (user.roles.nameRole == '') {
                    keyError = 'nameRole';
                    break;
                }
            }
            else if (arrayKey[i] == 'email' && user[arrayKey[i]] !== '') {
                if (!validateEmail(user[arrayKey[i]])) {
                    keyError = 'emailInvalid';
                    break;
                }
            } else if (arrayKey[i] != 'driverlicense' && arrayKey[i] != 'socialSecurityNumber' && arrayKey[i] != 'professionalLicense') {
                if (user[arrayKey[i]] === '' && arrayKey[i] !== 'cellphone' && arrayKey[i] !== 'email') {
                    keyError = arrayKey[i];
                    break;
                }
            }
        }

        if (user.pin !== user.confirmPin) {
            keyError = 'pinnotmatch'
        }

        if (keyError !== '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            let objWorkingTime = [];
            this.inputRefsTime.forEach(ref => {
                objWorkingTime = {
                    ...objWorkingTime,
                    [ref.props.title]: {
                        timeStart: ref.state.timeStart,
                        timeEnd: ref.state.timeEnd,
                        isCheck: ref.state.isCheck
                    }
                }
            });

            const { address } = user;
            const temptAddress = { ...address, state: getIdStateByName(stateCity, address.state) };
            const temptStaff = {
                ...user,
                cellphone: user.cellphone === '' ? '' : `${this.cellphoneRef.current.state.codeAreaPhone}${user.cellphone}`,
                address: temptAddress,
                isDisabled: (user.isDisabled === 'Active' ? 0 : 1),
                workingTime: objWorkingTime,
                salary: {
                    perHour: {
                        value: parseFloat(this.perHourServiceSalaryRef.current.state.value ? this.perHourServiceSalaryRef.current.state.value : 0),
                        isCheck: this.perHourServiceSalaryRef.current.state.isCheck
                    },
                    commission: {
                        value: parseFloat(this.commissionSalaryRef.current.state.value ? this.commissionSalaryRef.current.state.value : 0),
                        isCheck: this.commissionSalaryRef.current.state.isCheck
                    }
                },
                tipFee: {
                    percent: {
                        value: parseFloat(this.percentTipFeeRef.current.state.value ? this.percentTipFeeRef.current.state.value : 0),
                        isCheck: this.percentTipFeeRef.current.state.isCheck
                    },
                    fixedAmount: {
                        value: parseFloat(this.fixedAmountTipFeeRef.current.state.value ? this.fixedAmountTipFeeRef.current.state.value : 0),
                        isCheck: this.fixedAmountTipFeeRef.current.state.isCheck
                    }
                },
                fileId: this.state.fileId,
                productSalary: {
                    commission: {
                        value: parseFloat(this.commisionProductScalaryRef.current.state.value ? this.commisionProductScalaryRef.current.state.value : 0),
                        isCheck: this.commisionProductScalaryRef.current.state.isCheck
                    }

                }
            };
            if (this.props.isEditStaff) {
                this.props.editStaff(temptStaff, this.state.staffId)
            } else {
                this.props.addStaff(temptStaff);
            }
        }
    }

    convertKeyToName(key) {
        let name = '';
        switch (key) {
            case 'Percent (%)':
                name = 'percent';
                break;
            case 'Fixed amount ($)':
                name = 'fixedAmount';
                break;
            case 'Per hour ($)':
                name = 'perHour';
                break;
            case 'Commission (%)':
                name = 'commission';
                break;
            default:
                name = 'commission1';
        }
        return name;
    }


    updateUserInfo(key, value, keyParent = '') {
        const { user } = this.state;
        if (keyParent !== '') {
            const temptParent = user[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...user, [keyParent]: temptChild };
            this.setState({
                user: temptUpdate
            })
        } else {
            const temptUpdate = { ...user, [key]: value };
            this.setState({
                user: temptUpdate
            })
        }
    }

    disableFixedAmountTip = () => {
        this.fixedAmountTipFeeRef.current.setStateFromParent();
    }

    disablePercentTip = () => {
        this.percentTipFeeRef.current.setStateFromParent();
    }

    componentWillUnmount() {
        this.inputRefsTime = [];
    }
}

export default AddStaff;