import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { ButtonCustom, Text, Dropdown } from '@components';
import { scaleSzie, localize, WorkingTime, getNameLanguage } from '@utils';
import IMAGE from '@resources';
import styles from './style';
import { HomeHardware, AddDeviceHardware,SetupHardware } from './widget';

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
                    />
                    <AddDeviceHardware 
                    gotoSetupDevice={this.gotoSetupDevice}
                    backHomeHardware={this.backHomeHardware}
                    />
                    <SetupHardware 
                    backListDevices={this.backListDevices}
                    />

                </ScrollableTabView>
            </View>

        );
    }
}



export default Layout;

