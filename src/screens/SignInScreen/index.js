import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class SignInScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();

    }

    signIn = () => {
        const id = this.idInputRef.current.state.value;
        const password = this.passwordInputRef.current.value;
    }

    forgotPassword = () =>{
        
    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, SignInScreen);