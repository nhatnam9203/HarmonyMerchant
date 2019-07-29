import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigatorServices from '@navigators/NavigatorServices';

class LockScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            active: true,
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
    }

    submitPincode = () => {
        const password = this.passwordInputRef.current.state.value;
        const {profile}= this.props
        if (password.length === 4) {
            // const pin = profile.pin ? profile.pin : '1234';
            // if(password == pin){
            //     //  this.props.actions.app.handleLockScreen(false);
            //     //  NavigatorServices.navigate('Drawer');
            // }else{
            //     Alert.alert(`Pin not match !`);
            // }
            this.props.actions.staff.loginStaff(profile.merchantCode,password);
        } else {
            Alert.alert(`Pin must 4 numeric`);
        }
    }

    signIn = () => {
        // email":"tu.tran@levincigroup.com", "Password":"123456"
        const email = this.idInputRef.current.state.value;
        const password = this.passwordInputRef.current.state.value;
        if (email === '' || password === '') {
            alert('Please enter full information !');
        } else {
            this.props.actions.auth.login(email, password);
        }

    }

    support = () => {
    }

    forgotPincode = () => {
        // this.props.navigation.navigate('ForgotPassword');
    }

    onAction = (active) => {
        this.setState({
            active,
        });
    }



}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    errorLogin: state.auth.errorLogin,
    visibleModalLock: state.app.visibleModalLock,
    profile:state.dataLocal.profile
})



export default connectRedux(mapStateToProps, LockScreen);