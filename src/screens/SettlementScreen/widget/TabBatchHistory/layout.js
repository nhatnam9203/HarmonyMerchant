import React from 'react';
import {
    View,
   
} from 'react-native';
// import ScrollableTabView from 'react-native-scrollable-tab-view';
import _ from "ramda";

import { } from '@utils';
import { ScrollableTabView} from '@components';
import styles from './style';
import { BatchHistoryDetail, StaffIncomeDetailsTab, BatchHistoryList, GiftCardSalesDetailsTab } from './widget';

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
                    />
                    <StaffIncomeDetailsTab
                        ref={this.staffIncomDetailsRef}
                    />
                    <GiftCardSalesDetailsTab />

                </ScrollableTabView>
            </View>
        );
    }

}






export default Layout;

