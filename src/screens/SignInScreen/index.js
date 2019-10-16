import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SignInScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isSecureTextEntry: true
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();

    }

    signIn = () => {
        const email = this.idInputRef.current.state.value;
        const password = this.passwordInputRef.current.state.value;
        if (email === '' || password === '') {
            alert('Please enter full information !');
        } else {
            this.props.actions.auth.login(email, password);
        }

    }

    signUp = () => {
        this.props.navigation.navigate('Terms');
    }

    forgotPassword = () => {
        this.props.navigation.navigate('ForgotPassword');
    }

    changeShowPass = () => {
        this.setState(prevState => ({ isSecureTextEntry: !prevState.isSecureTextEntry }))
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    errorLogin: state.auth.errorLogin
})



export default connectRedux(mapStateToProps, SignInScreen);