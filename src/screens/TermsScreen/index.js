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
        // this.setState(prevState => ({
        //     isAgree: !prevState.isAgree
        // }))
        this.props.actions.app.agreeTerm();
    }

    nextScreen = () => {
        if (this.props.isAgreeTerm) {
            this.props.navigation.navigate('GeneralInfo');
        }

    }
}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    isAgreeTerm: state.app.isAgreeTerm
})



export default connectRedux(mapStateToProps, TermsScreen);