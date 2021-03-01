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
                    initialPage={0}
                    locked={true}
                    renderTabBar={() => <View />}
                    onChangeTab={this.onChangeTab}
                >
                    <PromotionHome
                        language={language}
                        createNewCampaign={this.createNewCampaign}
                        editCampaign={this.editCampaign}
                        disableCampaign={this.disableCampaign}
                        enableCampaign={this.enableCampaign}
                        viewRule={this.viewRule}
                        disableRule={this.disableRule}
                        promotions={promotions}
                    />
                    <PromotiomDetail
                        language={language}
                        setStateFromParent={this.handleSetStateToPromotiomDetail}
                        cancelCampaign={this.cancelCampaign}
                        handleCreateNewCampaign={this.handleCreateNewCampaign}
                        updatePromotionById={this.updatePromotionById}
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

