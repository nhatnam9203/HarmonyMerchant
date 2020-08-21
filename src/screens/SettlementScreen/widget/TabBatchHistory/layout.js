import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import _ from "ramda";

import { scaleSzie, localize, formatWithMoment } from '@utils';
import { Text, Button, ButtonCustom, PopupCalendar } from '@components';
import styles from './style';
import IMAGE from '@resources';
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

