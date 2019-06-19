import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import strings from './strings';
import { validateEmail } from '@utils';

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
                    state: ''
                },
                cellphone: '',
                email: '',
                pin: '',
                confirmPin: '',
                roles: {
                    nameRole: '',
                    statusRole: ''
                },
                driverlicense: '',
                socialSecurityNumber: '',
                professionalLicense: '',
            }
        }
        // ---- Refs ----
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefsTip = [];

    }

    setRefTimeWorking = (ref) => {
        if (ref != null) {
            this.inputRefsTime.push(ref);
        }

    };

    setRefSalary = (ref) => {
        this.inputRefsSalary.push(ref);
    };

    setRefTip = (ref) => {
        this.inputRefsTip.push(ref);
    };

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

    addStaff1 = () => {
        const { profile } = this.props;
        console.log(profile);
    }

    addStaff = () => {
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
                if (user.roles.statusRole == '') {
                    keyError = 'statusRole';
                    break;
                }
            }
            else if (arrayKey[i] == 'email') {
                if (!validateEmail(user[arrayKey[i]])) {
                    keyError = 'emailInvalid';
                    break;
                }
            } else {
                if (user[arrayKey[i]] === '') {
                    keyError = arrayKey[i];
                    break;
                }
            }
        }

        if (keyError !== '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            const arrayWorkingTime = [];
            const arraySalary = [];
            const arrayTipFee = [];
            this.inputRefsTime.forEach(ref => {
                arrayWorkingTime.push({
                    [ref.props.title]: {
                        timeStart: ref.state.timeStart,
                        timeEnd: ref.state.timeEnd,
                        isCheck: ref.state.isCheck
                    }

                })
            });
            this.inputRefsSalary.forEach(ref => {
                arraySalary.push({
                    [this.convertKeyToName(ref.props.title)]: ref.state.value,
                    isCheck: ref.state.isCheck
                })
            });

            this.inputRefsTip.forEach(ref => {
                arrayTipFee.push({
                    [this.convertKeyToName(ref.props.title)]: ref.state.value,
                    isCheck: ref.state.isCheck
                })
            })
            const { profile } = this.props;
            const temptStaff = { ...user, workingTime: arrayWorkingTime, tipFee: arrayTipFee, salary: arraySalary, merchantId: profile.merchantId };
            console.log('temptStaff  : '  + JSON.stringify(temptStaff));
            this.props.actions.staff.addStaffByMerchant(temptStaff, profile.merchantId)
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
                name = 'commission';
        }
        return name;
    }

    componentWillUnmount() {
        alert('ddd')
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile

})



export default connectRedux(mapStateToProps, AddStaff);