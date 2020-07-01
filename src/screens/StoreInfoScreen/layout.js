import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { DefaultTabBar, Button, StatusBarHeader } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabStoreInfo, TabAdminInfo, TabStaffManagement, TabServiceProduct } from './widget';

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        const {tabCurrent} = this.state;

        return (
            <View style={styles.container} >
                <StatusBarHeader />
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <DefaultTabBar
                        isNotPress={true}
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(14)
                        }}
                    />}
                    // onChangeTab={this.onChangeTab}
                >
                    <TabStoreInfo tabLabel={`1. ${localize('Store Info', language)}`}
                        nextTab={() => this.scrollTabRef.current.goToPage(1)}
                        tabCurrent={tabCurrent}
                    />
                    <TabAdminInfo
                        tabLabel={`2. ${localize('Admin Info', language)}`}
                        backTab={() => this.scrollTabRef.current.goToPage(0)}
                        nextTab={this.gotoTabStaffManagement}
                    />
                    <TabStaffManagement
                        tabLabel={`3. ${localize('Staff Management', language)}`}
                        backTab={() => this.scrollTabRef.current.goToPage(1)}
                        nextTab={this.gotoTabService}
                    />
                    <TabServiceProduct
                        tabLabel={`4. ${localize('Services/Products', language)}`}
                        backTab={() => this.scrollTabRef.current.goToPage(2)}
                    />
                </ScrollableTabView>
                <Button onPress={this.signOut} style={{ position: 'absolute', top: 20, right: 0 }} >
                    <Image source={IMAGE.signOut} style={{ width: scaleSzie(35), height: scaleSzie(35) }} />
                </Button>

            </View>

        );
    }
}
