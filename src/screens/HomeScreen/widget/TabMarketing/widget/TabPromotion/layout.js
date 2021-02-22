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
    PromotionHome, PromotiomDetail, RewardDetail
} from './widget';

const { width } = Dimensions.get('window');

class Layout extends React.Component {


    render() {
        const { language, promotions, refreshingPromotion } = this.props;

        return (
            <View style={styles.container} >
                <ScrollableTabView
                    ref={this.scrollTabParentRef}
                    style={{}}
                    initialPage={1}
                    locked={true}
                    renderTabBar={() => <View />}
                    onChangeTab={this.onChangeTab}
                >
                    <PromotionHome
                        createNewCampaign={this.createNewCampaign}
                        editCampaign={this.editCampaign}
                        disableCampaign={this.disableCampaign}
                        viewRule={this.viewRule}
                        disableRule={this.disableRule}
                    />
                    <PromotiomDetail
                        setStateFromParent={this.handleSetStateToPromotiomDetail}
                        cancelCampaign={this.cancelCampaign}
                        handleCampaign={this.createNewCampaign}
                    />

                    <RewardDetail
                        cancelRewardPoints={this.cancelRewardPoints}
                        saveRewardPoints={this.saveRewardPoints}
                    />

                </ScrollableTabView>


            </View>
        );
    }
}




export default Layout;

