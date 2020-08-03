import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { getIdStateByName, scaleSzie, BusinessWorkingTime } from '@utils';

const initState = {
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
        cashPercent:0
    },
    fileId: 0,
    imageUrl: '',
    isSubmitButton: true,
    dynamicMarginBottomState: 24
}

class StoreInfoScreen extends Layout {

    constructor(props) {
        super(props);
        const { profile } = this.props;
        this.state = {
            ...initState,
            businessHour: profile.businessHour ? profile.businessHour : BusinessWorkingTime
        };
        // ---- Refs ----
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefproductSalary = [];
        this.inputRefsTip = [];
        this.browserFileRef = React.createRef();
        this.cellphoneRef = React.createRef();
        this.scrollStaffRef = React.createRef();
        this.percentTipFeeRef = React.createRef();
        this.fixedAmountTipFeeRef = React.createRef();
        this.cashPercentRef = React.createRef();
    }

    scrollStaffTo(position) {
        this.scrollStaffRef.current.scrollTo({ x: 0, y: scaleSzie(position), animated: true })
    }

    editButtonSubmit = async (isSubmit) => {
        await this.setState({
            isSubmitButton: isSubmit
        })
    }

    setRefTimeWorking = (ref) => {
        this.inputRefsTime.push(ref);
    };

    setRefSalary = (ref) => {
        if (ref) {
            this.inputRefsSalary.push(ref);
        }
    };

    setProductSalary = (ref) => {
        if (ref) {
            this.inputRefproductSalary.push(ref);
        }
    }


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
            if (arrayKey[i] === 'firstName' || arrayKey[i] === 'lastName' || arrayKey[i] === 'displayName' || arrayKey[i] === 'pin' || arrayKey[i] === 'confirmPin') {
                if (user[arrayKey[i]] === '') {
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
                        value: parseFloat(ref.state.value ? ref.state.value : 0),
                        isCheck: ref.state.isCheck
                    }
                }
            });
            this.inputRefproductSalary.forEach(ref => {
                objProjectSalary = {
                    ...objProjectSalary,
                    [this.convertKeyToName(ref.props.title)]: {
                        value: parseFloat(ref.state.value ? ref.state.value : 0),
                        isCheck: ref.state.isCheck
                    }
                }
            });
            // this.inputRefsTip.forEach(ref => {
            //     objTipFee = {
            //         ...objTipFee,
            //         [this.convertKeyToName(ref.props.title)]: {
            //             value: parseInt(ref.state.value ? ref.state.value : 0),
            //             isCheck: ref.state.isCheck
            //         }
            //     }
            // });
            const { address } = user;
            const temptAddress = { ...address, state: getIdStateByName(stateCity, address.state) };
            const temptStaff = {
                ...user,
                cellphone: `${this.cellphoneRef.current.state.codeAreaPhone}${user.cellphone}`,
                isDisabled: (user.isDisabled === 'Active' ? 0 : 1),
                address: temptAddress,
                workingTime: objWorkingTime,
                salary: objSalary,
                productSalary: objProjectSalary,
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
                cashPercent : parseFloat(this.cashPercentRef.current.state.value ? this.cashPercentRef.current.state.value: 0),
                fileId: this.state.fileId
            };
            //console.log('productSalary : ' + JSON.stringify(objProjectSalary));
            this.props.actions.staff.createAdmin(temptStaff);
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

    resetStateRefs = () => {
        this.inputRefsSalary.forEach(ref => {
            ref.setStateFromParent();
        });
        this.inputRefproductSalary.forEach(ref => {
            ref.setStateFromParent();
        });
        // this.inputRefsTip.forEach(ref => {
        //     ref.setStateFromParent();
        // });
        this.fixedAmountTipFeeRef.current.setStateFromParent();
        this.percentTipFeeRef.current.setStateFromParent();
        this.cashPercentRef.current.setStateFromParent("0", true);
    }

    disableFixedAmountTip = () => {
        this.fixedAmountTipFeeRef.current.setStateFromParent();
    }

    disablePercentTip = () => {
        this.percentTipFeeRef.current.setStateFromParent();
    }

    disableServiceSalary = (type) => {
        for (const ref of this.inputRefsSalary) {
            if (ref.props.type !== type) {
                ref.setStateFromParent();
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, isResetInfoAdmin } = this.props;
        if (!loading && isResetInfoAdmin) {
            this.setState(initState);
            this.props.actions.staff.resetFlagCreateAdmin();
            this.browserFileRef.current.setImageUrlFromParent('');
            this.resetStateRefs();
        }
    }

    componentWillUnmount() {
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefproductSalary = [];
        this.inputRefsTip = [];
    }
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    stateCity: state.dataLocal.stateCity,
    isResetInfoAdmin: state.staff.isResetInfoAdmin
})



export default connectRedux(mapStateToProps, StoreInfoScreen);