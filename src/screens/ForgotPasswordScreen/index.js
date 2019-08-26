import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { validateEmail} from '@utils';


class ForgotPasswordScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();

    }

    forgotPass = () => {
        const email = this.idInputRef.current.state.value;
        if(validateEmail(email)){
            this.props.actions.auth.forgotPassword(email);
        }else{
            alert('Email Invalid');
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, ForgotPasswordScreen);