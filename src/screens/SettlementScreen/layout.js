import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Text, StatusBarHeader, Button, ParentContainer, PopupCheckStaffPermission, DefaultTabBar } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import ICON from '@resources';
import {
    TabSettle,
    TabTransaction,
    TabBatchHistory
} from './widget';

export default class Layout extends React.Component {

    renderHeader() {
        const { language, connectPAXStatus } = this.props;
        const statusConnectColor = connectPAXStatus.status ? "#4CD964" : "#FF6F00";

        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
                    {localize('Batch Settlements', language)}
                    <Text numberOflines={1} style={{ fontSize: scaleSzie(11), color: statusConnectColor, fontWeight: "600", fontStyle: 'italic' }} >
                        {`  ${connectPAXStatus.message}`}
                    </Text>
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
                    onChangeTab={this.onChangeTab}
                >
                    <TabSettle
                        ref={this.tabSettleRef}
                        tabLabel={localize('Settle', language)}
                        reviewBatchHistory={this.reviewBatchHistory}
                    />
                    <TabTransaction
                        ref={this.transactionTabRef}
                        tabLabel={localize('Credit/Debit Transactions', language)}
                    />
                    <TabBatchHistory
                        ref={this.batchHistoryTabRef}
                        tabLabel={localize('Batch History', language)}
                    />

                </ScrollableTabView>
            </View>
        );
    }

    render() {
        const { navigation, language, settlementTabPermission, isShowBackSettlement,isShowBackBatchHistory } = this.props;
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
                        <Image source={ICON.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>

                    {
                        isShowBackSettlement ? <Button onPress={this.backSettlementTab} style={{
                            position: 'absolute', top: 20, right: 0,
                            width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                        }} >
                            <Image source={ICON.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                        </Button> : <View />
                    }

                    {
                        isShowBackBatchHistory ? <Button onPress={this.backBatchHistoryTab} style={{
                            position: 'absolute', top: 20, right: 0,
                            width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                        }} >
                            <Image source={ICON.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                        </Button> : <View />
                    }


                    <PopupCheckStaffPermission
                        ref={this.checkPermissionRef}
                        visiblePopupCheckStaffPermission={settlementTabPermission}
                        title={localize('Input PIN Number', language)}
                        tabName="Settlement"
                        onRequestClose={this.closePopupCheckSettementTabPermission}
                    />
                </View>
            </ParentContainer>
        );
    }
}
