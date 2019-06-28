import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import strings from './strings';
import { validateEmail } from '@utils';

class StaffInfo extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                displayName: '',
                address: {
                    street: '',
                    city: '',
                    state: ''
                },
                cellphone: '',
                email: '',
                pin: '',
                confirmPin: '',
                isDisabled: 'Active',
                roles: {
                    nameRole: 'Admin',
                },
                driverlicense: '',
                socialSecurityNumber: '',
                professionalLicense: '',
            },
            staffId: '',
            workingTime: {
                Monday: {
                    timeStart: "08:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Tuesday: {
                    timeStart: "08:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Wednesday: {
                    timeStart: "08:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Thursday: {
                    timeStart: "08:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Friday: {
                    timeStart: "08:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Sarturday: {
                    timeStart: "08:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Sunday: {
                    timeStart: "08:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                }
            },
            tipFee: {
                percent: {
                    value: '',
                    isCheck: false
                },
                fixedAmount: {
                    value: '',
                    isCheck: false
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
            }
        }
        // ---- Refs ----
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefsTip = [];

    }

    componentDidMount() {
        if (this.props.isEditStaff) {
            const { infoStaffHandle } = this.props;
            this.setState({
                user: {
                    firstName: infoStaffHandle.firstName,
                    lastName: infoStaffHandle.lastName,
                    displayName: infoStaffHandle.displayName,
                    address: {
                        street: infoStaffHandle.address,
                        city: infoStaffHandle.city,
                        state: infoStaffHandle.stateId,
                    },
                    cellphone: infoStaffHandle.phone,
                    email: infoStaffHandle.email,
                    pin: infoStaffHandle.pin,
                    confirmPin: infoStaffHandle.pin,
                    isDisabled: infoStaffHandle.isDisabled === 0 ? 'Active' : 'Disable',
                    roles: {
                        nameRole: 'Admin',
                    },
                    driverlicense: infoStaffHandle.driverLicense,
                    socialSecurityNumber: infoStaffHandle.ssn,
                    professionalLicense: infoStaffHandle.professionalLicense,
                },
                staffId: infoStaffHandle.staffId,
                // workingTime: infoStaffHandle.workingTimes,
                tipFee: infoStaffHandle.tipFees,
                salary: infoStaffHandle.salaries
            })
        }

    }

    setStaffInfoFromParent = staff => {
        // console.log('setStaffInfoFromParent : ', staff);
    }

    setRefTimeWorking = (ref) => {
        this.inputRefsTime.push(ref);
    };

    setRefSalary = (ref) => {
        this.inputRefsSalary.push(ref);
    };

    setRefTip = (ref) => {
        this.inputRefsTip.push(ref);
    };

    addAdmin = () => {
        const { user } = this.state;
        const arrayKey = Object.keys(user);
        let keyError = '';
        for (let i = 0; i < arrayKey.length; i++) {
            if (arrayKey[i] == 'address') {
                if (user.address.street == '') {
                    keyError = 'street';
                    break;
                }
                if (user.address.city == '') {

                    keyError = 'city';
                    break;
                }
                if (user.address.state == '') {
                    keyError = 'state';
                    break;
                }
            } else if (arrayKey[i] == 'roles') {
                if (user.roles.nameRole == '') {
                    keyError = 'nameRole';
                    break;
                }
            }
            else if (arrayKey[i] == 'email') {
                if (!validateEmail(user[arrayKey[i]])) {
                    keyError = 'emailInvalid';
                    break;
                }
            } else if (arrayKey[i] != 'driverlicense' && arrayKey[i] != 'socialSecurityNumber' && arrayKey[i] != 'professionalLicense') {
                if (user[arrayKey[i]] === '') {
                    keyError = arrayKey[i];
                    break;
                }
            }
        }

        if (keyError !== '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            let objWorkingTime = [];
            let objSalary = {};
            let objTipFee = {};
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
            this.inputRefsSalary.forEach(ref => {
                objSalary = {
                    ...objSalary,
                    [this.convertKeyToName(ref.props.title)]: {
                        value: parseInt(ref.state.value ? ref.state.value : 0),
                        isCheck: ref.state.isCheck
                    }
                }
            });

            this.inputRefsTip.forEach(ref => {
                objTipFee = {
                    ...objTipFee,
                    [this.convertKeyToName(ref.props.title)]: {
                        value: parseInt(ref.state.value ? ref.state.value : 0),
                        isCheck: ref.state.isCheck
                    }
                }
            });
            const temptStaff = {
                ...user,
                isDisabled: (user.isDisabled === 'Active' ? 0 : 1),
                workingTime: objWorkingTime,
                salary: objSalary,
                tipFee: objTipFee,
            };
            if (this.props.isEditStaff) {
                this.props.editStaff(temptStaff,this.state.staffId)
            } else {
                this.props.addStaff(temptStaff);
            }
        }
    }

    convertKeyToName(key) {
        // console.log('key : ', key);
        let name = '';
        switch (key) {
            case 'Percent ($)':
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
                name = 'commission';
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



}

export default StaffInfo;