import IMAGE from "@resources";
import { localize } from "@utils";
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import { useSelector } from "react-redux";
import HeaderTitle from "./HeaderTitle";
import HeaderTooltip from "./HeaderTooltip";
import PopupButton from "./PopupButton";

function ReportTabLayout({
  style,
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
  filterNameDefault,
  filterNameDefaultList = [],
  title,
}) {
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

            {rightTooltip}
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
            data={[
              filterNameDefault && { value: filterNameDefault },
              ...filterNameDefaultList,
              ...filterNames,
            ]}
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

      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

export default ReportTabLayout;
