import React from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl

} from 'react-native';

import { scaleSzie, localize } from '@utils';
import styles from './style';
import { DatePicker, ScrollableTabView } from '@components';
import {
    PromotionFirst, PromotionSecond, PromotionThird, PromotionFour, PromotionFive,
    PromotionRewardPoints
} from './widget';

const { width } = Dimensions.get('window');

class Layout extends React.Component {


    render() {
        const { language, promotions, refreshingPromotion } = this.props;

        return (
            <View style={styles.container} >
                <ScrollableTabView
                    // ref={this.scrollTabParentRef}
                    style={{}}
                    initialPage={0}
                    // locked={true}
                    renderTabBar={() => <View />}
                // onChangeTab={this.onChangeTab}
                >
                    <View style={{ flex: 1, }} >

                    </View>

                </ScrollableTabView>

                {/* ------- Date -------- */}
                {/* <DatePicker
                    visible={show}
                    onRequestClose={() => this.setState({ show: false })}
                    title={localize('Select From Date', language)}
                    dateCalendar={dateCalendar}
                    setDateSelected={this.setDateSelected}
                /> */}

            </View>
        );
    }
}




export default Layout;

