import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { validateEmail, getIdStateByName } from '@utils';

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
        isDisabled: 'Active',
        roles: {
            nameRole: 'Admin',
        },
        driverlicense: '',
        socialSecurityNumber: '',
        professionalLicense: '',
    },
    fileId: 0,
    imageUrl: '',
    isSubmitButton: true
}

class StoreInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = initState;
        // ---- Refs ----
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefsTip = [];
        this.browserFileRef = React.createRef();
        this.cellphoneRef = React.createRef();
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
        this.inputRefsSalary.push(ref);
    };

    setRefTip = (ref) => {
        this.inputRefsTip.push(ref);
    };

    updateFileId = async (fileId) => {
        await this.setState({
            fileId
        })
    }

    addAdmin = () => {
        const { user } = this.state;
        const arrayKey = Object.keys(user);
        let keyError = '';
        for (let i = 0; i < arrayKey.length; i++) {
            if (arrayKey[i] == 'address') {
                continue;
                // if (user.address.street == '') {
                //     keyError = 'street';
                //     break;
                //     continue;
                // }
                // if (user.address.city == '') {
                //     keyError = 'city';
                //     break;
                //     continue
                // }
                // if (user.address.state == '') {
                //     keyError = 'state';
                //     break;
                //     continue
                // }
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

        if (user.pin !== user.confirmPin) {
            keyError = 'pinnotmatch'
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
            const { address } = user;
            const temptAddress = { ...address, state: getIdStateByName(this.props.stateCity, address.state) };
            const temptStaff = {
                ...user,
                cellphone: `${this.cellphoneRef.current.state.codeAreaPhone}${user.cellphone}`,
                isDisabled: (user.isDisabled === 'Active' ? 0 : 1),
                address: temptAddress,
                workingTime: objWorkingTime,
                salary: objSalary,
                tipFee: objTipFee,
                fileId: this.state.fileId
            };
            
            this.props.actions.staff.createAdmin(temptStaff);
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, isResetInfoAdmin } = this.props;
        if (!loading && isResetInfoAdmin) {
            this.setState(initState);
            this.props.actions.staff.resetFlagCreateAdmin();
            this.browserFileRef.current.setImageUrlFromParent('');
        }
    }



}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    stateCity: state.dataLocal.stateCity,
    isResetInfoAdmin: state.staff.isResetInfoAdmin
})



export default connectRedux(mapStateToProps, StoreInfoScreen);