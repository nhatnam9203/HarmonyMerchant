import React from 'react';
import {
    View,
   
} from 'react-native';
import _ from "ramda";

import { ScrollableTabView} from '@components';
import styles from './style';
import { BatchHistoryDetail, StaffIncomeDetailsTab, BatchHistoryList, GiftCardSalesDetailsTab,CreditPaymentDetail } from './widget';

class Layout extends React.Component {

    render() {

        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <View />}
                >
                    <BatchHistoryList
                         ref={this.batchHistoryListRef}
                        goToBatchHistoryDetail={this.goToBatchHistoryDetail}
                    />
                    <BatchHistoryDetail
                        ref={this.batchHistoryDetailRef}
                        onPressStaff={this.onPressStaff}
                        onPressGiftCardTotal={this.onPressGiftCardTotal}
                        gotoCreditPaymentDetail={this.gotoCreditPaymentDetail}
                    />
                    <StaffIncomeDetailsTab
                        ref={this.staffIncomDetailsRef}
                    />
                    <GiftCardSalesDetailsTab />
                    <CreditPaymentDetail />

                </ScrollableTabView>
            </View>
        );
    }

}






export default Layout;

