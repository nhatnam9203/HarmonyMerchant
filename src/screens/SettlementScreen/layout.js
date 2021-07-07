import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import {
    Text, StatusBarHeader, Button, ParentContainer,
    PopupCheckStaffPermission, DefaultTabBar,
    ScrollableTabView
} from '@components';
import { scaleSize, localize, menuTabs } from '@utils';
import styles from './style';
import ICON from '@resources';
import {
    TabSettle,
    TabTransaction,
    TabBatchHistory
} from './widget';
import configs from "@configs";

export default class Layout extends React.Component {

    renderHeader() {
        const { language, connectPAXStatus,terminalID } = this.props;
        const statusConnectColor = connectPAXStatus.status ? "#4CD964" : "#FF6F00";

        return (
            <View style={{
                height: scaleSize(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSize(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSize(16), color: '#0764B0' ,fontWeight:"600"}} >
                    {localize('Batch Settlements', language)}
                    <Text numberOflines={1} style={{ fontSize: scaleSize(11), color: statusConnectColor, fontWeight: "600", fontStyle: 'italic' }} >
                        {/* {`  ${connectPAXStatus.message} ${terminalID ? `TerminalID: #${terminalID}` : ""}`} */}
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
                            fontSize: scaleSize(16)
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
        const { navigation, language, settlementTabPermission, isShowBackSettlement, isShowBackBatchHistory } = this.props;
        const { isFocus, currentPage } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
                clearIntervalById={this.clearIntervalById}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    {this.renderTabContainer()}
                    <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                        <Image source={ICON.openDrawer} style={{ width: scaleSize(34), height: scaleSize(34) }} />
                    </Button>

                    {
                        isShowBackSettlement && currentPage === 0 ? <Button onPress={this.backSettlementTab} style={[configs.btn_right_position, {
                            width: scaleSize(34), height: scaleSize(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                        }]} >
                            <Image source={ICON.arrowRight} style={{ width: scaleSize(22), height: scaleSize(17) }} />
                        </Button> : <View />
                    }

                    {
                        isShowBackBatchHistory && currentPage === 2 ? <Button onPress={this.backBatchHistoryTab} style={[configs.btn_right_position, {
                            width: scaleSize(34), height: scaleSize(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                        }]} >
                            <Image source={ICON.arrowRight} style={{ width: scaleSize(22), height: scaleSize(17) }} />
                        </Button> : <View />
                    }


                    <PopupCheckStaffPermission
                        ref={this.checkPermissionRef}
                        visiblePopupCheckStaffPermission={settlementTabPermission}
                        title={localize('Input PIN Number', language)}
                        tabName={menuTabs.MENU_SETTLEMENT}
                        onRequestClose={this.closePopupCheckSettementTabPermission}
                    />
                </View>
            </ParentContainer>
        );
    }
}
