import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';
import NavigatorServices from '../../navigators/NavigatorServices';


class StoreInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.scrollTabRef = React.createRef();
    }

    gotoTabStaffManagement = () => {
        this.scrollTabRef.current.goToPage(2);
    }

    gotoTabService = () => {
        this.scrollTabRef.current.goToPage(3);
    }

    signOut = () => {
        NavigatorServices.navigate('SignIn')
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, StoreInfoScreen);