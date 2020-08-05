import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import actions from "@actions";

import { ReportLayout } from "../../../widget";
import MarketingEfficiency from "./MarketingEfficiency";
import MarketingEfficiencyStatistic from "./MarketingEfficiencyStatistic";

export default function MarketingEfficiencyTab({ style, showBackButton }) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState("This week");

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getMarketingEfficiencyMethod = async () => {
    await dispatch(
      actions.report.getOverallMarketingEfficiency(
        true,
        layoutRef?.current?.getTimeUrl()
      )
    );
  };

  const showCalendar = (isShow) => {
    layoutRef?.current?.showCalendar(isShow);
  };

  //callback
  const onChangeTimeTitle = async (titmeTitle) => {
    await setTitleRangeTime(titmeTitle);
    // TODO: call reload list
    await getMarketingEfficiencyMethod();
  };

  /**effect */
  useEffect(() => {
    getMarketingEfficiencyMethod();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <ReportLayout
        ref={layoutRef}
        style={style}
        showBackButton={showBackButton}
        onChangeTimeTitle={onChangeTimeTitle}
      >
        <MarketingEfficiency
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Marketing Efficiency"
          // onGoStatistics={goNext}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          // showExportFile={onShowPopupExport}
          // handleTheDownloadedFile={handleTheDownloadedFile}
        />
        <MarketingEfficiencyStatistic
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Marketing Efficiency Statistics"
          title="Marketing Efficiency Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          // showExportFile={onShowPopupExport}
          // handleTheDownloadedFile={handleTheDownloadedFile}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
