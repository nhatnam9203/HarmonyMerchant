import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

import IMAGE from "@resources";
import {
  HeaderTitle,
  HeaderTooltip,
  PopupButton,
  TableList,
  ReportStatisticLayout,
} from "../../widget";
import { localize } from "@utils";

const HEAD_FONT_SIZE = 17;
const TABLE_ROW_HEIGHT = 50;

export default function ProductStatistic(props) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**state */

  /**process */

  /**render */

  return <ReportStatisticLayout {...props} />;
}

const styles = StyleSheet.create({});
