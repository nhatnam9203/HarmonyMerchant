import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class UserGuideScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();

    }

    signIn = () => {
        this.props.navigation.navigate('SignIn');
    }

    forgotPassword = () => {

    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, UserGuideScreen);