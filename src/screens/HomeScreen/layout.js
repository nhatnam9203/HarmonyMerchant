import React from 'react';
import {
    View,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { HomeTabBar, StatusBarHeader, Button } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { TabMarketing, TabAppointment, TabCheckout } from './widget';

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        return (
            <View style={styles.container} >
                <StatusBarHeader />
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    renderTabBar={() => <HomeTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#0764B0"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(16),
                            fontWeight: '500'
                        }}
                    />}
                >
                    <TabMarketing tabLabel={`${localize('MARKETING', language)}`} />
                    <TabAppointment tabLabel={`${localize('APPOINTMENT', language)}`} />
                    <TabCheckout tabLabel={`${localize('CHECKOUT', language)}`} />
                </ScrollableTabView>
                <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                    <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                </Button>

                <Button onPress={this.signOut} style={{ position: 'absolute', top: 20, right: 0 }} >
                    <Image source={IMAGE.signOut} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                </Button>
            </View>

        );
    }
}
