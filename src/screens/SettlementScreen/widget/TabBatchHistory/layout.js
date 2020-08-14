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
import { BatchHistoryDetail,StaffIncomeDetailsTab,BatchHistoryList} from './widget';

class Layout extends React.Component {

    render() {

        return (
            <View style={styles.container} >
                 <ScrollableTabView
                    ref={this.scrollTabRef}
                    style={{}}
                    initialPage={0}
                    locked={false}
                    renderTabBar={() => <View />}
                >
                    <BatchHistoryList
                        goToBatchHistoryDetail={this.goToBatchHistoryDetail}
                    />
                    <BatchHistoryDetail
                        ref={this.batchHistoryDetailRef}
                        // gotoTabSecondSettle={this.gotoTabSecondSettle}
                        // navigation={this.props.navigation}
                        onPressStaff={this.onPressStaff}
                        // onPressGiftCardTotal={this.onPressGiftCardTotal}
                    />
                    <StaffIncomeDetailsTab 
                    
                    />
                    {/* <StaffIncomeDetailsTab 
                        ref={this.staffIIncomeDetailsRef}
                        backHomeTab={this.backTabFirstSettle}
                    />
                    <GiftCardSalesDetailsTab 
                        ref={this.giftCardSalesDetailsTabRef}
                        backHomeTab={this.backTabFirstSettle}
                    />
                    <TabSecondSettle
                        ref={this.tabsecondSettleRef}
                        backTabFirstSettle={this.backTabFirstSettle}
                        reviewBatchHistory={() => this.props.reviewBatchHistory()}
                        finishBatch={this.finishBatch}
                    /> */}
                </ScrollableTabView>
            </View>
        );
    }

}






export default Layout;

