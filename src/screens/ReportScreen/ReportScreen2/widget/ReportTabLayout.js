import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import RNFetchBlob from "rn-fetch-blob";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { Dropdown } from "react-native-material-dropdown";

import { PopupCalendar } from "@components";
import actions from "@actions";
import IMAGE from "@resources";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";

import PopupLoadingExportReport from "./PopupLoadingExportReport";
import PopupExportReport from "./PopupExportReport";
import HeaderTooltip from "./HeaderTooltip";
import PopupButton from "./PopupButton";
import HeaderTitle from "./HeaderTitle";

const FILTER_NAME_DEFAULT = "All Values";

/**create new object from two value for two key of object */
const createChartObjectFromValues = (array, key, keyValue) => {
  let response = [];
  array.forEach((obj) => {
    let mapObj = Object.create({});
    mapObj[obj[key]] = formatNumberFromCurrency(obj[keyValue]);
    response.push(mapObj);
  });

  return response;
};

function ReportTabLayout({
  style,
  onGoStatistics,
  titleRangeTime,
  showCalendar,
  showExportFile,
  handleTheDownloadedFile,
  pathFileExport,
  onChangeFilterName,
  filterNameItem,
  filterNames = [],
  children,
  rightTooltip,
  isShowExportButton,
  isShowFilterButton,
  filterNameDefault = FILTER_NAME_DEFAULT,
  title,
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  /**state */

  /**refs */

  /**function */

  /**effect */

  /**render */

  return (
    <View style={style}>
      {title && <HeaderTitle title={title} />}
      <HeaderTooltip
        rightComponent={
          <>
            {isShowExportButton && (
              <PopupButton
                text="Export"
                imageSrc={IMAGE.export}
                onPress={showExportFile}
              />
            )}

            {!!pathFileExport && isShowExportButton && (
              <PopupButton
                onPress={() => handleTheDownloadedFile(pathFileExport)}
                style={{ backgroundColor: "rgb(235,93,57)", marginLeft: 20 }}
                txtStyle={{ color: "#fff" }}
                imageStyle={{ tintColor: "#fff" }}
                text={localize("Manager downloaded file", language)}
                imageSrc={IMAGE.export}
              />
            )}

            {rightTooltip && rightTooltip}
          </>
        }
      >
        <PopupButton
          text={titleRangeTime}
          imageSrc={IMAGE.calendar}
          onPress={showCalendar}
          style={{ marginRight: 20 }}
        />

        {isShowFilterButton && (
          <Dropdown
            rippleCentered={true}
            dropdownPosition={2}
            data={[{ value: filterNameDefault }, ...filterNames]}
            onChangeText={(text) => onChangeFilterName(text)}
            value={filterNameItem}
            renderBase={() => (
              <PopupButton
                text={filterNameItem}
                imageSrc={IMAGE.Report_Dropdown_Arrow}
              />
            )}
          />
        )}
      </HeaderTooltip>

      <View style={{ flex: 1 }}>{children && children}</View>
    </View>
  );
}

ReportTabLayout.propTypes = {
  children: PropTypes.node.children,
};

export default ReportTabLayout = forwardRef(ReportTabLayout);
