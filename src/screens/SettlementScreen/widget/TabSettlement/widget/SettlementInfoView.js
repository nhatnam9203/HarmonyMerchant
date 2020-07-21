import React from "react";
import { View, Text } from "react-native";

import {localize} from '@utils';
import Split2ViewLayout from "./Split2ViewLayout";
import styles from "../style";

function SettlementInfoView({ title = "Last Settlement" }) {



  /**components */
  const _headerComponent = () => (
    <View>
      <Text style={[styles.fontTitle, styles.contentTitle]}>{title}</Text>
    </View>
  );
  const _renderLeftComponent = () => {
    return <View>{_headerComponent()}</View>;
  };

  const _renderRightComponent = () => {
    return <View>{_headerComponent()}</View>;
  };

  return (
    <View style={styles.container}>
      {/** header */}
      <View style={styles.headerContent}>
        <Text style={[styles.fontTitle, styles.mainTitle]}>{title}</Text>
      </View>

      {/**content */}
      <Split2ViewLayout
        leftComponent={_renderLeftComponent}
        rightComponent={_renderRightComponent}
      />
    </View>
  );
}

export default SettlementInfoView;
