import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { View, Platform } from "react-native";

import RNFetchBlob from "rn-fetch-blob";
import { useSelector, useDispatch } from "react-redux";
import ScrollableTabView from "react-native-scrollable-tab-view";

import { PopupCalendar } from "@components";
import actions from "@actions";
import { localize, scaleSzie, getQuickFilterTimeRange } from "@utils";

import PopupLoadingExportReport from "./PopupLoadingExportReport";
import PopupExportReport from "./PopupExportReport";

const FILE_EXTENSION = "csv";
const FILTER_NAME_DEFAULT = "All Staff";

function ReportTabLayout(
  { style, showBackButton, children, onCalendarClose, showCalendar },
  ref
) {
  /**redux */
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

  const [currentTab, setCurrentTab] = useState(0);
  const [titleExportFile, setTitleExportFile] = useState(
    localize("Export", language)
  );
  const [filterStaffItem, setFilterStaffItem] = useState(null);

  /**effect */
  useEffect(() => {
    setVisiblePopupLoadingExport(isDownloadReportStaff);
  }, [isDownloadReportStaff]);

  useEffect(() => {
    setVisibleCalendar(showCalendar);
  }, [showCalendar]);

  useEffect(() => {
    if (onCalendarClose) {
      onCalendarClose(getTimeTitle(), getFilterTimeParams());
    }
  }, []);

  /**func */
  // go to staff statistics page
  const goNext = () => {
    scrollPage.current.goToPage(1);
  };

  // go to staff salary page
  const goBack = () => {
    // reset filters name
    setFilterStaffItem(null);
    // scroll to staff salary
    scrollPage.current.goToPage(0);
  };

  // public func
  useImperativeHandle(ref, () => ({
    goBack: goBack,
    goNext: goNext,
    getCurrentTab: () => {
      return currentTab;
    },
  }));

  // const searchStaffSalary = useCallback(
  //   (url) => dispatch(actions.staff.getListStaffsSalaryTop(url, true)),
  //   [dispatch]
  // );

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

    return title;
  };

  // time filter change: hide popup + create time range params + call api search staff
  const changeTitleTimeRange = async (title) => {
    await setVisibleCalendar(false);

    if (onCalendarClose) {
      onCalendarClose(
        title !== "Time Range" ? title : "All time",
        getFilterTimeParams()
      );
    }
  };

  // callback  when scrollTab change
  const onChangeTab = (tabIndex) => {
    setCurrentTab(tabIndex.i);
    if (showBackButton) {
      showBackButton(tabIndex.i !== 0);
    }
  };

  // popup show when button export pressed
  const onShowPopupExport = () => {
    switch (currentTab) {
      case 0:
        setTitleExportFile("Report staff salary " + getTimeTitle());
        break;
      case 1:
        setTitleExportFile("Report staff statistics " + getTimeTitle());
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

  const onChangeFilterStaff = (text) => {
    setFilterStaffItem(text);
    if (currentTab === 1) {
      const item = listStaffsSalary.find((staff) => staff.name === text);
      if (item) {
        dispatch(actions.staff.getListStaffCalendar(item.staffId));
      }
    }
  };

  const onCloseCalendar = () => {
    setVisibleCalendar(false);

    if (onCalendarClose) {
      onCalendarClose(getTimeTitle(), getFilterTimeParams());
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
        {children}
      </ScrollableTabView>

      <PopupCalendar
        type="report"
        ref={modalCalendarRef}
        visible={visibleCalendar}
        onRequestClose={onCloseCalendar}
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

ReportTabLayout.propTypes = {
  children: PropTypes.node.children,
};

export default ReportTabLayout = forwardRef(ReportTabLayout);
