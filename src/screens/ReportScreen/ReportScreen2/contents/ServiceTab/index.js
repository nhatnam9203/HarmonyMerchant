import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, Platform } from "react-native";

import RNFetchBlob from "rn-fetch-blob";
import { useSelector, useDispatch } from "react-redux";
import ScrollableTabView from "react-native-scrollable-tab-view";

import { PopupCalendar } from "@components";
import actions from "@actions";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";

import { ReportTabLayout } from "../../widget";

import ServiceReportTab from "./ServiceTab";
import ServiceStatistic from "./ServiceStatistic";

export default function ServiceTab({ style }) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**func */

  return (
    <View style={style}>
      <ReportTabLayout>
        <ServiceReportTab style={{ flex: 1, paddingTop: 10 }} />
        <ServiceStatistic style={{ flex: 1, paddingTop: 10 }} />
      </ReportTabLayout>
    </View>
  );
}
