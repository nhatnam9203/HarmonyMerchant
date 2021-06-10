import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { checkStatusPrint } from '@utils';

class TabHardware extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.scrollTabHardwareRef = React.createRef();
        this.setupHardwareRef = React.createRef();
    }

    onChangeTab = (index) => {
        this.setState({ tabCurrent: index.i });
        if (this.setupHardwareRef?.current) {
            this.setupHardwareRef?.current?.stopDeviceScan();
        }
    }

    gotoListDevices = (type) => {
        this.scrollTabHardwareRef.current.goToPage(1);
    }

    backHomeHardware = () => {
        this.scrollTabHardwareRef.current.goToPage(0);
    }

    gotoSetupDevice = () => {
        this.scrollTabHardwareRef.current.goToPage(2);
    }

    backListDevices = () => {
        this.scrollTabHardwareRef.current.goToPage(1);
    }

    goToPrinterList = async () => {
        const { printerPortType } = this.props
        this.scrollTabHardwareRef.current.goToPage(3);
        try {
            this.props.actions.app.loadingApp()
            const printMachine = await checkStatusPrint(printerPortType);
            this.props.actions.dataLocal.updatePrinterList(printMachine);
            this.props.actions.app.stopLoadingApp();
        } catch (error) {
            this.props.actions.app.stopLoadingApp();
            setTimeout(() => {
                alert(error)
            }, 500)
        }
    }

    selectPortType = async (type) => {
        try {
            this.props.actions.dataLocal.updatePrinterPortType(type);
            this.props.actions.app.loadingApp()
            const printMachine = await checkStatusPrint(type);
            this.props.actions.dataLocal.updatePrinterList(printMachine);
            this.props.actions.app.stopLoadingApp();
        } catch (error) {
            this.props.actions.app.stopLoadingApp();
            setTimeout(() => {
                alert(error)
            }, 500)
        }
    }


}

const mapStateToProps = state => ({
    profile: state.authMerchant.merchant,
    language: state.dataLocal.language,
    printerPortType: state.dataLocal.printerPortType
})



export default connectRedux(mapStateToProps, TabHardware);