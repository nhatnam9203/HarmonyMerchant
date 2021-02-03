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
    PromotionHome, PromotiomDetail
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
                        createNewCampaign={this.createNewCampaign}
                        editCampaign={this.editCampaign}
                        disableCampaign={this.disableCampaign}
                    />
                    <PromotiomDetail
                        cancelCampaign={this.cancelCampaign}
                        handleCampaign={this.createNewCampaign}
                    />

                </ScrollableTabView>


            </View>
        );
    }
}




export default Layout;

