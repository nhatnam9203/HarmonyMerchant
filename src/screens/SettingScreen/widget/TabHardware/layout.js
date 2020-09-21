import React from 'react';
import {
    View,
    
} from 'react-native';

import {ScrollableTabView } from '@components';
import styles from './style';
import { HomeHardware, AddDeviceHardware, SetupHardware ,PrinterList} from './widget';

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabHardwareRef}
                    style={{}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <View />}
                    onChangeTab={(index) => {
                        this.setState({ tabCurrent: index.i })
                    }}
                >
                    <HomeHardware
                        gotoListDevices={this.gotoListDevices}
                        goToPrinterList={this.goToPrinterList}
                    />
                    <AddDeviceHardware
                        gotoSetupDevice={this.gotoSetupDevice}
                        backHomeHardware={this.backHomeHardware}
                    />
                    <SetupHardware
                        backListDevices={this.backListDevices}
                    />
                     <PrinterList 
                          backHomeHardware={this.backHomeHardware}
                     />


                </ScrollableTabView>
            </View>

        );
    }
}



export default Layout;

