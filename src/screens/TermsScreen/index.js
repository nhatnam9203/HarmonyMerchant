import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TermsScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAgree: false
        }

    }

    agreeTerm = () => {
        this.setState(prevState => ({
            isAgree: !prevState.isAgree
        }))
    }

    nextScreen = () => {
        if (this.state.isAgree) {
            this.props.navigation.navigate('GeneralInfo');
        }

    }
}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TermsScreen);