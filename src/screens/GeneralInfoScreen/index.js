import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class GeneralInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            generalInfo: {
                businessName: '',
                doingBusiness: '',
                tax: {
                    prefix: '',
                    suffix: ''
                },
                businessAddress: {
                    address: '',
                    city: '',
                    state: '',
                    zip: ''
                },
                businessPhone:'',
                email: '',
                firstName: '',
                lastName: '',
                position: '',
                contactPhone: ''
            }
        }
    }

    updateGeneralInfo(key, value, keyParent = '') {
        const { generalInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = generalInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...generalInfo, [keyParent]: temptChild };
            this.setState({
                generalInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...generalInfo, [key]: value };
            this.setState({
                generalInfo: temptUpdate
            })
        }
    }

    nextTab =() =>{
        this.props.navigation.navigate('BusinessInfo');
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, GeneralInfoScreen);