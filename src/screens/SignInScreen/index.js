import React from 'react';
import {
    Platform,
    Keyboard
} from "react-native";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SignInScreen extends Layout {
    constructor(props) {
        super(props);
        this.state = {
            isSecureTextEntry: true,
            isShowKeyboard: false
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
    }

    keyboardDidShow = async () => {
        await this.setState({
            isShowKeyboard: true
        })
    }

    keyboardDidHide = async () => {
        await this.setState({
            isShowKeyboard: false
        })
    }

    signIn = () => {
        const {isRememberMID} =this.props;
        const email = this.idInputRef.current.state.value;
        const password = this.passwordInputRef.current.state.value;
        if (email === '' || password === '') {
            alert('Please enter full information!');
        } else {
            this.props.actions.auth.login(email, password,isRememberMID);
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

    toggleRememberMID =() =>{
        const {isRememberMID} = this.props;
        this.props.actions.dataLocal.toggleSaveMID(!isRememberMID);
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    errorLogin: state.auth.errorLogin,
    MIDStorage: state.dataLocal.MIDStorage,
    isRememberMID: state.dataLocal.isRememberMID
})

export default connectRedux(mapStateToProps, SignInScreen);