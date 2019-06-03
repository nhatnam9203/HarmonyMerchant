import React from 'react';

import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';

class StoreInfoScreen extends Layout {

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
                professionalLicense: ''
            }
        }
        // ---- Refs ----
        this.inputRefsTime = [];
        this.inputRefsSalary = [];
        this.inputRefsTip = [];

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

    nextTab = () => {
        const array = []
        // this.inputRefsTime.forEach(ref => {
        //     if (ref.state.isCheck) {
        //         array.push({
        //             title: ref.props.title,
        //             timeStart: ref.state.timeStart,
        //             timeEnd: ref.state.timeEnd
        //         })
        //     }
        // })
        this.inputRefsTip.forEach(ref => {
            if (ref.state.isCheck) {
                array.push({
                    title: ref.props.title,
                    value: ref.state.value,
                })
            }
        })

        console.log(array);
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

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, StoreInfoScreen);