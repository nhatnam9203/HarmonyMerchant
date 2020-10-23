import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class StoreInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            tabCurrent: 0
        }
        this.scrollTabRef = React.createRef();
    }

    onChangeTab = async (index) => {
        await this.setState({ tabCurrent: index.i });
    }

    gotoTabStaffManagement = () => {
        this.scrollTabRef.current.goToPage(2);
    }

    gotoTabService = () => {
        this.scrollTabRef.current.goToPage(3);
    }

    signOut = () => {
        this.props.actions.app.handleLockScreen(true);
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, StoreInfoScreen);