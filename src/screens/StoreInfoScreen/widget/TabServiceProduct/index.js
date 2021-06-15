import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";


class TabServiceProduct extends Layout {

    constructor(props) {
        super(props);

        this.scrollTabRef = React.createRef();
    }

    gotoTabServices = () => {
        this.scrollTabRef.current?.goToPage(1);
    }

    gotoTabExtra = () => {
        this.scrollTabRef.current?.goToPage(2);
    }

    gotoTabProduct =() =>{
        this.scrollTabRef.current?.goToPage(3);
    }

    gotoCongratulation =() =>{
        NavigationServices.navigate('Congratulation');
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabServiceProduct);