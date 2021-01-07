import React from "react";
import {
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";

import { scaleSzie, localize } from "@utils";
import styles from "./style";
import { DatePicker } from "@components";
import {
  PromotionFirst,
  PromotionSecond,
  PromotionThird,
  PromotionFour,
  PromotionFive,
  PromotionRewardPoints,
} from "./widget";

const { width } = Dimensions.get("window");

class Layout extends React.Component {
  renderLoadingPromotion() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scale: 4 }],
        }}
      >
        <ActivityIndicator size={"large"} color="rgb(83,157,209)" />
      </View>
    );
  }

  render() {
    const { language, promotions, refreshingPromotion } = this.props;
    const { show, dateCalendar } = this.state;

    return (
      <View style={styles.container}>
        <Text>Review</Text>
      </View>
    );
  }
}

export default Layout;
