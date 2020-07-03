import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { NavigationEvents } from 'react-navigation';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { TabFirstSettle, TabSecondSettle } from './widget';

const { width } = Dimensions.get('window');

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

