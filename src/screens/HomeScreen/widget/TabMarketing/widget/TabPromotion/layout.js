import { ScrollableTabView } from "@components";
import React from "react";
import { Dimensions, View } from "react-native";
import styles from "./style";
import { PromotiomDetail, PromotionHome, RewardDetail } from "./widget";

const { width } = Dimensions.get("window");

class Layout extends React.Component {
  render() {
    const { language, promotions, refreshingPromotion } = this.props;
    return (
      <View style={styles.container}>
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
            deleteCampaign={this.deleteCampaign}
            viewRule={this.viewRule}
            disableRule={this.disableRule}
            promotions={promotions}
          />
          <PromotiomDetail
            ref={this.promotionDetailRef}
            language={language}
            // setStateFromParent={this.handleSetStateToPromotiomDetail}
            cancelCampaign={this.cancelCampaign}
            handleCreateNewCampaign={this.handleCreateNewCampaign}
            updatePromotionById={this.updatePromotionById}
            getSMSInformation={this.getSMSInformation}
            sendStartCampaign={this.sendStartCampaign}
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
