import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import strings from './strings';
import { validateEmail, getIdStateByName, getNameStateById, getCodeAreaPhone, scaleSzie, checkStateIsValid ,
    BusinessWorkingTime,formatNumberFromCurrency
} from '@utils';

class StaffInfo extends Layout {

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
            },
            productSalary: {
                commission: {
                    value: 0,
                    isCheck: false
                }
            },
            cashPercent:0,
            fileId: 0,
            imageUrl: '',
            isSubmitButton: true,
            dynamicMarginBottomState: 24,
            rowsSalaryIncome: 0
        }
        // ---- Refs ----
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputProductSalaryRef = [];
        this.inputRefsTip = [];
        this.browserFileRef = React.createRef();
        this.cellphoneRef = React.createRef();
        this.scrollStaffRef = React.createRef();
        this.cashPercentRef = React.createRef();
        this.perHourServiceSalaryRef = React.createRef();
        this.commissionSalaryRef = React.createRef();
        this.percentTipFeeRef = React.createRef();
        this.fixedAmountTipFeeRef = React.createRef();
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
                        zip: infoStaffHandle.zip,
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
                imageUrl: infoStaffHandle.imageUrl,
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
        this.inputRefsTime.push(ref);
    };

    setRefSalary = (ref) => {
        this.inputRefsSalary.push(ref);
    };

    setRefProductSalary = (ref) => {
        if (ref) {
            this.inputProductSalaryRef.push(ref);
        }
    }

    setRefTip = (ref) => {
        this.inputRefsTip.push(ref);
    };

    updateFileId = async (fileId) => {
        await this.setState({
            fileId
        })
    }

    checkSalaryIncomeService = () => {
        const incomeSalary = this.commissionSalaryRef?.current?.getDataFromParent() || [];
        const values = [];
        let isCheckIsValidIncome = true;
        let isEmpty = false;

        for (let ref of incomeSalary) {
            let from = ref?.state?.from || "0.00";
            let to = ref?.state?.to || "0.00";
            let commission = ref?.state?.commission || "0.00";

            if (!from || !to || !commission) {
                isEmpty = true;
                break;
            } else {
                if (formatNumberFromCurrency(from) < formatNumberFromCurrency(to)) {
                    values.push({
                        from: formatNumberFromCurrency(from),
                        to: formatNumberFromCurrency(to),
                        commission: formatNumberFromCurrency(commission),
                    });
                } else {
                    isCheckIsValidIncome = false;
                    break;
                }
            }
        }
        if (isEmpty) {
            return {
                status: false,
                message: "Please enter full salary income information!",
                data: [{ from: 0.00, to: 0.00, commission: 0.00 }]
            };
        }

        if (!isCheckIsValidIncome) {
            return {
                status: false,
                message: "From income not greater than to income",
                data: [{ from: 0.00, to: 0.00, commission: 0.00 }]
            };
        }

        return {
            status: true,
            message: "",
            data: values
        }
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

         // ------- Check Service Salary Income ------------
         const resultSalaryIncome = this.checkSalaryIncomeService();
         const isCheckIncomeSalary = this.commissionSalaryRef?.current?.state?.isCheck;
         if (isCheckIncomeSalary && !resultSalaryIncome.status) {
             keyError = resultSalaryIncome?.message || "";
         }

        if (keyError !== '') {
            Alert.alert(`${strings[keyError] ? strings[keyError] : keyError}`);
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
                        value: parseFloat(ref.state.value ? ref.state.value : 0),
                        isCheck: ref.state.isCheck
                    }
                }
            });

            this.inputProductSalaryRef.forEach(ref => {
                objProjectSalary = {
                    ...objProjectSalary,
                    [this.convertKeyToName(ref.props.title)]: {
                        value: parseFloat(ref.state.value ? ref.state.value : 0),
                        isCheck: ref.state.isCheck
                    }
                }
            });

            this.inputRefsTip.forEach(ref => {
                objTipFee = {
                    ...objTipFee,
                    [this.convertKeyToName(ref.props.title)]: {
                        value: parseFloat(ref.state.value ? ref.state.value : 0),
                        isCheck: ref.state.isCheck
                    }
                }
            });
            const { address } = user;
            const temptAddress = { ...address, state: getIdStateByName(stateCity, address.state) };
            const temptStaff = {
                ...user,
                cellphone: `${this.cellphoneRef.current.state.codeAreaPhone}${user.cellphone}`,
                isDisabled: (user.isDisabled === 'Active' ? 0 : 1),
                address: temptAddress,
                workingTime: objWorkingTime,
                salary: {
                    perHour: {
                        value: parseFloat(this.perHourServiceSalaryRef?.current?.state?.value || 0),
                        isCheck: this.perHourServiceSalaryRef?.current?.state?.isCheck
                    },
                    commission: {
                        value: resultSalaryIncome.data,
                        isCheck: isCheckIncomeSalary
                    }
                },
                tipFee:  {
                    percent: {
                        value: parseFloat(this.percentTipFeeRef?.current?.state?.value || 0),
                        isCheck: this.percentTipFeeRef?.current?.state?.isCheck
                    },
                    fixedAmount: {
                        value: parseFloat(this.fixedAmountTipFeeRef?.current?.state?.value || 0),
                        isCheck: this.fixedAmountTipFeeRef?.current?.state?.isCheck
                    }
                },
                
                fileId: this.state.fileId,
                productSalary: objProjectSalary,
                cashPercent : parseFloat(this.cashPercentRef?.current?.state?.value || 0)
            };
            if (this.props.isEditStaff) {
                this.props.editStaff(temptStaff, this.state.staffId)
            } else {
                this.props.addStaff(temptStaff);
            }
        }
    }

    convertKeyToName(key) {
    //console.log('key : ', key);
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

    disableTip =(type) =>{
        for(const ref of this.inputRefsTip){
            if(ref.props.type !==  type){
                ref.setStateFromParent();
            }
        }
    }

    disableServiceSalary =(type) =>{
        for(const ref of this.inputRefsSalary){
            if(ref.props.type !==  type){
                ref.setStateFromParent();
            }
        }
    }

    disableCommisionServiceSalary = () => {
        this.commissionSalaryRef.current.setStateFromParent();
    }

    disablePerHourSalary = () => {
        this.perHourServiceSalaryRef.current.setStateFromParent();
    }

    disableFixedAmountTip = () => {
        this.fixedAmountTipFeeRef.current.setStateFromParent();
    }

    disablePercentTip = () => {
        this.percentTipFeeRef.current.setStateFromParent();
    }

    componentWillUnmount(){
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputProductSalaryRef = [];
        this.inputRefsTip = [];
    }


}

export default StaffInfo;