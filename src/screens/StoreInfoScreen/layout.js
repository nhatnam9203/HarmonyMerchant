import React from 'react';
import {
    View,
    Image,
    Text,
    ImageBackground,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';
import { TabStoreInfo, TabAdminInfo, TabStaffManagement, TabServiceProduct } from './widget';

export default class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <ScrollableTabView
                    style={{}}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(10)
                        }}
                    />}
                >
                    <TabAdminInfo tabLabel='2. Admin Info' />
                    <TabStoreInfo tabLabel='1. Store Info' />
                    <TabStaffManagement tabLabel='3. Staff Management' />
                    <TabServiceProduct tabLabel='4. Services / Products' />

                </ScrollableTabView>
            </View>

        );
    }
}
