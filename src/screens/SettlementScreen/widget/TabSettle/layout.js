import React from "react";
import {
    View,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import {} from '@utils';
import { } from '@components';
import styles from './style';
import { TabFirstSettle, TabSecondSettle, StaffIncomeDetailsTab,GiftCardSalesDetailsTab } from './widget';

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
                    <TabFirstSettle
                        ref={this.tabFirstSettleRef}
                        gotoTabSecondSettle={this.gotoTabSecondSettle}
                        navigation={this.props.navigation}
                        onPressStaff={this.onPressStaff}
                        onPressGiftCardTotal={this.onPressGiftCardTotal}
                    />
                    <StaffIncomeDetailsTab 
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
                    />
                </ScrollableTabView>

            </View>
        );
    }

}
export default Layout;
