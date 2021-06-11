import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SignUpScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.scrollTabRef = React.createRef();
        this.bankInfoRef = React.createRef();
        this.principalInfoRef = React.createRef();
    }

    goToPage = (page = 1) => {
        this.scrollTabRef.current.goToPage(page);
        if (page === 2 && this.bankInfoRef.current) {
            this.bankInfoRef.current.setStateFromparent(true);
        } else if (page === 3 && this.principalInfoRef.current) {
            this.principalInfoRef.current.setStateFromparent(true);
        } else {
            if (this.bankInfoRef.current) {
                this.bankInfoRef.current.setStateFromparent(false);
            }
            if (this.principalInfoRef.current) {
                this.principalInfoRef.current.setStateFromparent(false);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {registerMerchantError} = this.props;
        if(prevProps.registerMerchantError !== registerMerchantError && registerMerchantError){
            this.props.actions.app.resetStateRegisterMerchantError();
            this.scrollTabRef.current.goToPage(0);
        }
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    loading: state.app.loading,
    registerMerchantError: state.app.registerMerchantError
})



export default connectRedux(mapStateToProps, SignUpScreen);