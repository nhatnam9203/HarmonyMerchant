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
const FILTER_NAME_DEFAULT = "All Staff";

function StaffTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  const listCalendarStaffId = useSelector(
    (state) => state.staff.listCalendarStaffId
  );
  const isDownloadReportStaff = useSelector(
    (state) => state.staff.isDownloadReportStaff
  );
  const listStaffsSalary = useSelector((state) => state.staff.listStaffsSalary);

  /**refs */
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
  const [filterStaffItem, setFilterStaffItem] = useState(null);

  /**effect */
  useEffect(() => {
    setVisiblePopupLoadingExport(isDownloadReportStaff);
  }, [isDownloadReportStaff]);

  /**func */
  // go to statistics page
  const goNext = () => {
    scrollPage.current.goToPage(1);
  };

  // go to salary page
  const goBack = async () => {
    // reset filters name
    await setFilterStaffItem(null);
    // scroll to staff salary
    scrollPage.current.goToPage(0);
  };

  // public func
  useImperativeHandle(ref, () => ({
    goBack: goBack,
  }));

  const searchStaffSalary = useCallback(
    (url) => dispatch(actions.staff.getListStaffsSalaryTop(url, true)),
    [dispatch]
  );

  // create time range params
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

  // create title for time, to set default title print
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

    return title.toLowerCase();
  };

  // call action search staff api
  const searchStaff = () => {
    const url = getFilterTimeParams();
    // searchStaffSalary(url);
    dispatch(actions.staff.getListStaffsSalaryTop(url, true));
  };

  // time filter change: hide popup + create time range params + call api search staff
  const changeTitleTimeRange = async (title) => {
    setVisibleCalendar(false);
    await setTitleRangeTime(title !== "Time Range" ? title : "All time");
    searchStaff();
  };

  // callback  when scrollTab change
  const onChangeTab = (tabIndex) => {
    setCurrentTab(tabIndex.i);
    showBackButton(tabIndex.i !== 0);
  };

  // popup show when button export pressed
  const onShowPopupExport = async () => {
    switch (currentTab) {
      case 0:
        await setTitleExportFile("Staff salary " + getTimeTitle());
        break;
      case 1:
        await setTitleExportFile("Staff statistics " + getTimeTitle());
        break;
      default:
    }
    setVisiblePopupExport(true);
  };

  // call action export staff
  const requestExportFileToServer = () => {
    const url = getFilterTimeParams();
    setVisiblePopupExport(false);
    switch (currentTab) {
      case 0:
        dispatch(
          actions.staff.getExportStaffSalary(url, true, "csv", titleExportFile)
        );
        break;
      case 1:
        dispatch(
          actions.staff.getExportStaffStatistics(
            listCalendarStaffId,
            url,
            true,
            "csv",
            titleExportFile
          )
        );
        break;
      default:
        break;
    }
  };

  // popup handle file download, when button Manager downloaded file pressed
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

  // create filter name data
  const bindStaffSalaryFilter = () => {
    if (!listStaffsSalary) return [];

    let array = [];

    if (currentTab === 0) {
      array.push({ value: localize(FILTER_NAME_DEFAULT, language) });
    }

    const arrMap = listStaffsSalary.map((staff) => ({
      value: staff.name,
      ...staff,
    }));
    array.push(...arrMap);

    return array;
  };

  const onChangeFilterStaff = async (text) => {
    await setFilterStaffItem(text);
    if (currentTab === 1) {
      const item = listStaffsSalary.find((staff) => staff.name === text);
      if (item) {
        dispatch(actions.staff.getListStaffCalendar(item.staffId));
      }
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
          style={{ flex: 1, paddingTop: 10 }}
          onGoStatistics={goNext}
          titleRangeTime={titleRangeTime}
          showCalendar={() => setVisibleCalendar(true)}
          showExportFile={onShowPopupExport}
          handleTheDownloadedFile={handleTheDownloadedFile}
          onChangeFilterStaff={onChangeFilterStaff}
          dataStaffSalaryFilter={bindStaffSalaryFilter()}
          filterStaffItem={filterStaffItem}
        />
        <StaffStatistic
          style={{ flex: 1, paddingTop: 10 }}
          onGoSalary={goBack}
          titleRangeTime={titleRangeTime}
          showCalendar={() => setVisibleCalendar(true)}
          showExportFile={onShowPopupExport}
          handleTheDownloadedFile={handleTheDownloadedFile}
          onChangeFilterStaff={onChangeFilterStaff}
          dataStaffSalaryFilter={bindStaffSalaryFilter()}
          filterStaffItem={filterStaffItem}
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
