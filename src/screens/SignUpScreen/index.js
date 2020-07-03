import React from 'react';
import { Keyboard } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SignUpScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.scrollTabRef = React.createRef();
    }

    goToPage =(page = 1) =>{
        this.scrollTabRef.current.goToPage(page);
    }


    componentDidUpdate(prevProps, prevState) {
        
    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    loading: state.app.loading
})



export default connectRedux(mapStateToProps, SignUpScreen);