import React from 'react';
import { Alert } from 'react-native';
import _ from 'ramda';

import Layout from './layout';
import strings from './strings';
import { validateEmail, getIdStateByName, getNameStateById, getCodeAreaPhone, scaleSzie, checkStateIsValid } from '@utils';

class AddStaff extends Layout {

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
                    state: '',
                    zip: ''
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
                    timeStart: "10:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Tuesday: {
                    timeStart: "10:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Wednesday: {
                    timeStart: "10:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Thursday: {
                    timeStart: "10:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Friday: {
                    timeStart: "10:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Saturday: {
                    timeStart: "10:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                },
                Sunday: {
                    timeStart: "10:00 AM",
                    timeEnd: "08:00 PM",
                    isCheck: true
                }
            },
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
            value: {}
        }
        // ---- Refs ----
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefsTip = [];
        this.inputProductSalaryRef = [];
        this.browserFileRef = React.createRef();
        this.cellphoneRef = React.createRef();
        this.scrollStaffRef = React.createRef();
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
    // console.log('setStaffInfoFromParent : ', staff);
    }

    setRefTimeWorking = (ref) => {
        if (ref) {
            this.inputRefsTime.push(ref);
        }

    };

    setRefSalary = (ref) => {
        if (ref) {
            this.inputRefsSalary.push(ref);
        }

    };

    setRefProductSalary = (ref) => {
        if (ref) {
            this.inputProductSalaryRef.push(ref);
        }
    }

    setRefTip = (ref) => {
        if (ref) {
            this.inputRefsTip.push(ref);
        }

    };

    updateFileId = async (fileId) => {
    // console.log('---- fileId : ', fileId);
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
                // continue;
                // if (user.address.street == '') {
                //     keyError = 'street';
                //     break;
                // }
                // if (user.address.city == '') {

                //     keyError = 'city';
                //     break;
                // }
                // if (user.address.state == '') {
                //     keyError = 'state';
                //     break;
                // }
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
            let objSalary = {};
            let objProjectSalary = {};
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
            this.inputProductSalaryRef.forEach(ref => {
                objProjectSalary = {
                    ...objProjectSalary,
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
            const { address } = user;
            const temptAddress = { ...address, state: getIdStateByName(stateCity, address.state) };
            const temptStaff = {
                ...user,
                cellphone: user.cellphone === '' ? '' : `${this.cellphoneRef.current.state.codeAreaPhone}${user.cellphone}`,
                address: temptAddress,
                isDisabled: (user.isDisabled === 'Active' ? 0 : 1),
                workingTime: objWorkingTime,
                salary: objSalary,
                tipFee: objTipFee,
                fileId: this.state.fileId,
                productSalary: objProjectSalary
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
    // console.log('convertKeyToName : ',key);
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

    componentWillUnmount() {
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefsTip = [];
        this.inputProductSalaryRef = [];
    }


}

export default AddStaff;