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
import { PopupExportReport, PopupLoadingExportReport } from "../../widget";

import StaffSalaryTab from "./StaffSalaryTab";
import StaffStatistic from "./StaffStatistic";

const FILE_EXTENSION = "csv";

function StaffTab({ style, showBackButton }, ref) {
  /**redux */
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  const listCalendarStaffId = useSelector(
    (state) => state.staff.listCalendarStaffId
  );
  const isDownloadReportStaff = useSelector(
    (state) => state.staff.isDownloadReportStaff
  );

  /**ref */
  const scrollPage = useRef(null);
  const modalCalendarRef = useRef(null);
  const modalExportRef = useRef(null);

  /**state */
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [visiblePopupExport, setVisiblePopupExport] = useState(false);
  const [visiblePopupLoadingExport, setVisiblePopupLoadingExport] = useState(
    false
  );
  const [titleRangeTime, setTitleRangeTime] = useState("This week");
  const [currentTab, setCurrentTab] = useState(0);
  const [titleExportFile, setTitleExportFile] = useState(
    localize("Export", language)
  );

  /**effect */
  useEffect(() => {
    setVisiblePopupLoadingExport(isDownloadReportStaff);
  }, [isDownloadReportStaff]);

  /**func */
  const goNext = () => {
    scrollPage.current.goToPage(1);
    if (showBackButton) {
      showBackButton(true);
    }
  };

  const goBack = () => {
    scrollPage.current.goToPage(0);
    if (showBackButton) {
      showBackButton(false);
    }
  };
  // public func
  useImperativeHandle(ref, () => ({
    goBack: goBack,
  }));

  const searchStaffSalary = useCallback(
    (url) => dispatch(actions.staff.getListStaffsSalaryTop(url, true)),
    [dispatch]
  );

  const getFilterTimeParams = () => {
    const {
      isCustomizeDate,
      startDate,
      endDate,
      quickFilter,
    } = modalCalendarRef.current.state;

    let url;

    if (isCustomizeDate) {
      url = `timeStart=${startDate}&timeEnd=${endDate}`;
    } else {
      const filter = quickFilter === false ? "This Week" : quickFilter;
      // console.log("quickFilter", quickFilter);
      url = `quickFilter=${getQuickFilterTimeRange(filter)}`;
    }

    return url;
  };

  const getTimeTitle = () => {
    const {
      isCustomizeDate,
      startDate,
      endDate,
      quickFilter,
    } = modalCalendarRef.current.state;

    const filter = quickFilter === false ? "This Week" : quickFilter;
    let title = `${filter}`;

    if (startDate && endDate) {
      title = ` ${startDate} - ${endDate}`;
    }

    return title;
  };

  const searchStaff = () => {
    const url = getFilterTimeParams();
    // searchStaffSalary(url);
    dispatch(actions.staff.getListStaffsSalaryTop(url, true));
  };

  const changeTitleTimeRange = async (title) => {
    setVisibleCalendar(false);
    setTitleRangeTime(title !== "Time Range" ? title : "All time");
    searchStaff();
  };

  const onChangeTab = (tabIndex) => {
    setCurrentTab(tabIndex.i);
  };

  const onShowPopupExport = () => {
    switch (currentTab) {
      case 0:
        setTitleExportFile("Report Staff Salary " + getTimeTitle());
        break;
      case 1:
        setTitleExportFile("Report Staff Statistics " + getTimeTitle());
        break;
      default:
    }

    setVisiblePopupExport(true);
  };

  const requestExportFileToServer = () => {
    const url = getFilterTimeParams();
    setVisiblePopupExport(false);
    switch (currentTab) {
      case 0:
        dispatch(
          actions.staff.getExportStaffSalary(
            url,
            true,
            "csv",
            titleExportFile?.split(" ").join("")
          )
        );
        break;
      case 1:
        dispatch(
          actions.staff.getExportStaffStatistics(
            listCalendarStaffId,
            url,
            true,
            "csv",
            titleExportFile?.split(" ").join("")
          )
        );
        break;
      default:
        break;
    }
  };

  const handleTheDownloadedFile = (pathFile) => {
    if (Platform.OS === "ios") {
      RNFetchBlob.ios.previewDocument(pathFile);
    } else {
      const android = RNFetchBlob.android;
      android.actionViewIntent(
        pathFile,
        "application/vnd.android.package-archive"
      );
    }
  };

  /**render */
  return (
    <>
      <ScrollableTabView
        ref={scrollPage}
        initialPage={0}
        locked={true}
        renderTabBar={() => <View />}
        style={{ flex: 1 }}
        tabBarPosition="bottom"
        springTension={1}
        springFriction={1}
        onChangeTab={onChangeTab}
      >
        <StaffSalaryTab
          style={{ flex: 1, padding: 10 }}
          onGoStatistics={goNext}
          titleRangeTime={titleRangeTime}
          showCalendar={() => setVisibleCalendar(true)}
          showExportFile={onShowPopupExport}
          handleTheDownloadedFile={handleTheDownloadedFile}
        />
        <StaffStatistic
          style={{ flex: 1, padding: 10 }}
          onGoSalary={goBack}
          titleRangeTime={titleRangeTime}
          showCalendar={() => setVisibleCalendar(true)}
          showExportFile={onShowPopupExport}
          handleTheDownloadedFile={handleTheDownloadedFile}
        />
      </ScrollableTabView>

      <PopupCalendar
        type="report"
        ref={modalCalendarRef}
        visible={visibleCalendar}
        onRequestClose={() => setVisibleCalendar(false)}
        changeTitleTimeRange={changeTitleTimeRange}
        paddingLeft={scaleSzie(60)}
      />

      <PopupExportReport
        ref={modalExportRef}
        title={localize("Export", language)}
        fileName={titleExportFile}
        visible={visiblePopupExport}
        onRequestClose={() => setVisiblePopupExport(false)}
        language={language}
        exportFile={requestExportFileToServer}
      />

      <PopupLoadingExportReport
        visible={visiblePopupLoadingExport}
        onRequestClose={() => setVisiblePopupLoadingExport(false)}
        language={language}
        typeFile={FILE_EXTENSION === "pdf" ? "PDF" : "Excel"}
        // typeFile={typeFile === "pdf" ? "PDF" : "Excel"}
      />
    </>
  );
}

export default StaffTab = forwardRef(StaffTab);
