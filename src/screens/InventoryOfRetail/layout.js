import React from 'react';
import {
    View,
    TextInput,
    Image,
    Modal
} from 'react-native';
import _ from 'ramda';

import { ScrollableTabView, StatusBarHeader, Text, Button } from "@components";
import styles from './style';
import ICON from "@resources";
import { scaleSize, localize } from '@utils';
import { InventoryHome, InventoryDetail } from "./widget";
import configs from "@configs";

class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSize(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSize(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSize(16), color: '#0764B0', fontWeight: "600" }} >
                    {localize('Inventory', language)}
                </Text>
            </View>
        );
    }


    render() {
        const { language } = this.props;
        const { currentTab } = this.state;

        return (
            <View style={styles.container} >
                <StatusBarHeader />
                {this.renderHeader()}
                <ScrollableTabView
                    ref={this.scrollableTabViewRef}
                    style={{ flex: 1 }}
                    initialPage={1}
                    locked={true}
                    renderTabBar={() => <View />}
                    onChangeTab={this.onChangeTab}
                >
                    <InventoryHome
                        handleNewOrder={this.handleNewOrder}
                    />
                    <InventoryDetail
                        backOrderHome={this.backOrderHome}
                    />
                </ScrollableTabView>

                <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                    <Image source={ICON.openDrawer} style={{ width: scaleSize(34), height: scaleSize(34) }} />
                </Button>

                {
                    currentTab === 1 ? <Button onPress={this.backCustomerListTab}
                        style={[configs.btn_right_position, {
                            width: scaleSize(34), height: scaleSize(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                        }]} >
                        <Image source={ICON.arrowRight} style={{ width: scaleSize(22), height: scaleSize(17) }} />
                    </Button> : <View />
                }
            </View>
        );
    }

}

export default Layout;

