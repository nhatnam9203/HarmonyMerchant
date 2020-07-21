import React from "react";
import { View, Text } from "react-native";

import styles from "./style";
import { SettlementInfoView } from "./widget";

function TabSettlement(props) {
  return (
    <View style={styles.container}>
      <SettlementInfoView />
    </View>
  );
}

export default TabSettlement;
