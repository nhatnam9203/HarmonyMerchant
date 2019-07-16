import React from 'react';
import { StarPRNT } from 'react-native-star-prnt';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";
import PrintManager from '@lib/PrintManager';

class TabMarketing extends Layout {

    constructor(props) {
        super(props);
        this.scrollTabRef = React.createRef();
    }

    componentDidMount() {
    }

    addPromotion = async () => {
        try {
            const printer = await PrintManager.getInstance().portDiscovery();
            console.log('printer : ',printer);
        } catch (error) {
            console.log('scan error : ',error);
        }
        
        // if (printer) {
        //     const portName = printer[0].portName;
        //     const emulation = 'StarPRNT';
        //     console.log(portName);
        //     PrintManager.getInstance().print(portName,emulation);
        // } else {
        //     alert('Cannot connect your printer !')
        // }
    }




}

const mapStateToProps = state => ({
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, TabMarketing);