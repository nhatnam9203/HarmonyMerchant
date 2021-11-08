import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { CustomScrollTab } from "../../../widget";
import StaffSalaryTab from "./StaffSalary";
import StaffServiceDurationTab from "./StaffServiceDuration";
import { colors } from "@shared/themes";

function StaffTab({ style, showBackButton }, ref) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  /**refs */
  const staffSalaryTabRef = useRef(null);
  const staffDurationTabRef = useRef(null);

  /**function */
  const onChangeTab = (tabIndex) => {
    staffSalaryTabRef?.current?.goBack();
    staffDurationTabRef?.current?.goBack();

    switch (tabIndex) {
      case 0:
        staffSalaryTabRef.current?.getListStaffsSalaryTop();
        break;
      case 1:
        staffDurationTabRef.current?.getListStaffsSalaryTop();
        break;
      default:
        break;
    }

    setCurrentTab(tabIndex);
  };

  const onGoBack = () => {
    switch (currentTab) {
      case 0:
        staffSalaryTabRef.current?.goBack();
        break;
      case 1:
        staffDurationTabRef.current?.goBack();
        break;
      default:
        break;
    }
    setShowHeader(true);
  };

  const onShowHeader = (bl) => {
    setShowHeader(bl);
  };

  const getListStaffsSalaryTop = async (page = 1) => {
    if (page <= 0) return;

    await dispatch(
      actions.staff.getListStaffsSalaryTop(
        layoutRef?.current?.getTimeUrl(),
        true,
        page
      )
    );
  };

  // public func
  useImperativeHandle(ref, () => ({
    goBack: onGoBack,
    didBlur: () => {
      // setTitleRangeTime("This week");
      staffSalaryTabRef?.current?.didBlur();
      staffDurationTabRef?.current?.didBlur();
    },
    didFocus: () => {
      staffSalaryTabRef?.current?.didFocus();
      staffDurationTabRef?.current?.didFocus();

      staffSalaryTabRef.current?.getListStaffsSalaryTop();
    },
    getListStaffsSalaryTop: () => {
      staffSalaryTabRef.current?.getListStaffsSalaryTop();
    },
  }));

  return (
    <View style={[styles.container, { paddingTop: 10 }]}>
      <CustomScrollTab onHeaderTabChanged={onChangeTab} showHeader={showHeader}>
        <StaffSalaryTab
          style={{ flex: 1 }}
          ref={staffSalaryTabRef}
          tabLabel="        Salary      "
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />

        <StaffServiceDurationTab
          style={{ flex: 1 }}
          ref={staffDurationTabRef}
          tabLabel="Service Duration"
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />
      </CustomScrollTab>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.WHITE, flex: 1 },
});

export default StaffTab = forwardRef(StaffTab);
