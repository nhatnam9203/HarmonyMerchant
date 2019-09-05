import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList
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
                        tabLabel="Settle"
                        reviewBatchHistory={this.reviewBatchHistory}
                    />
                    <TabTransaction
                        tabLabel="Transactions"
                    />
                    <TabBatchHistory 
                    tabLabel="Batch history" 
                    />

                </ScrollableTabView>
            </View>
        );
    }

    render() {
        const { language } = this.props;
        const { isFocus } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    {this.renderTabContainer()}
                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    <Button onPress={this.showLockScreen} style={{
                        position: 'absolute', top: 20, right: 0,
                        width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                    }} >
                        <Image source={IMAGE.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                    </Button>
                </View>
            </ParentContainer>
        );
    }
}
