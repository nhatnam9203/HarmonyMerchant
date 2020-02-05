import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, DefaultTabBar } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    TabSettle,
    TabTransaction,
    TabBatchHistory
} from './widget';

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Batch Settlements', language)}
                </Text>
            </View>
        );
    }

    renderTabContainer() {
        const { language } = this.props;
        return (
            <View style={{ flex: 1 }} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <DefaultTabBar
                        activeTextColor="#fff"
                        inactiveTextColor="#6A6A6A"
                        backgroundTabActive="#0764B0"
                        textStyle={{
                            fontSize: scaleSzie(16)
                        }}
                    />}
                >
                    <TabSettle
                        tabLabel={localize('Settle', language)}
                        reviewBatchHistory={this.reviewBatchHistory}
                    />
                    <TabTransaction
                        tabLabel={localize('Transactions', language)}
                    />
                    <TabBatchHistory
                        tabLabel={localize('Batch history', language)}
                    />

                </ScrollableTabView>
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const { isFocus } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    {this.renderTabContainer()}
                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
            </ParentContainer>
        );
    }
}
