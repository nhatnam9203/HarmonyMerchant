import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class HomeScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.scrollTabRef = React.createRef();
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    signOut = () => {

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, HomeScreen);