import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class LockScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            active: true,
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
    }

    submitPincode = () =>{
        // const password = this.passwordInputRef.current.state.value;
        this.props.actions.app.handleLockScreen(false);
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

    support =() =>{
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
    visibleModalLock:state.app.visibleModalLock
})



export default connectRedux(mapStateToProps, LockScreen);