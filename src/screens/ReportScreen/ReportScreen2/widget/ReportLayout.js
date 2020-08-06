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

import PopupLoadingExportReport from "./PopupLoadingExportReport";
import PopupExportReport from "./PopupExportReport";

const FILE_EXTENSION = "csv";
const FILTER_NAME_DEFAULT = "All Staff";

function ReportLayout(
  {
    style,
    showBackButton,
    children,
    onChangeTimeTitle,
    onRequestExportFileToServer,
  },
  ref
) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  const isDownloadReport = useSelector(
    (state) => state.report.isDownloadReport
  );

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
  const [titleExportFile, setTitleExportFile] = useState(
    localize("Export", language)
  );
  const [currentTab, setCurrentTab] = useState(0);

  /**function */
  // go to statistics page
  const goNext = () => {
    scrollPage.current.goToPage(1);
  };

  // go to salary page
  const goBack = async () => {
    // reset filters name
    //   await setFilterStaffItem(null);
    // scroll to staff salary
    await dispatch(actions.report.resetExportFiles());
    scrollPage.current.goToPage(0);
  };

  // public function
  useImperativeHandle(ref, () => ({
    goBack: goBack,
    goNext: goNext,
    didBlur: () => {},
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
    },
    getTimeUrl: getFilterTimeParams,
    getTimeTitle: getTimeTitle,
    showCalendar: setVisibleCalendar,
    showPopupExport: onShowPopupExport,
    handleTheDownloadedFile: handleTheDownloadedFile,
  }));

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

  // time filter change: hide popup + create time range params + call api search staff
  const changeTitleTimeRange = async (title) => {
    setVisibleCalendar(false);
    const changeTitle = title !== "Time Range" ? title : "All time";
    if (onChangeTimeTitle) {
      await onChangeTimeTitle(changeTitle);
    }
  };

  // callback  when scrollTab change
  const onChangeTab = (tabIndex) => {
    setCurrentTab(tabIndex.i);
    showBackButton(tabIndex.i !== 0);
  };

  // popup show when button export pressed
  const onShowPopupExport = async (title) => {
    switch (currentTab) {
      case 0:
        await setTitleExportFile(title + getTimeTitle());
        break;
      case 1:
        await setTitleExportFile(title + getTimeTitle());
        break;
      default:
    }

    setVisiblePopupExport(true);
  };

  // call action export staff
  const requestExportFileToServer = () => {
    const url = getFilterTimeParams();
    setVisiblePopupExport(false);
    if (onRequestExportFileToServer) {
      onRequestExportFileToServer(currentTab, titleExportFile);
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

  /**effect */
  useEffect(() => {
    // console.log(`==============> isDownloadReport : ${isDownloadReport}`);
    setVisiblePopupLoadingExport(isDownloadReport);
  }, [isDownloadReport]);

  /**render */
  return (
    <View style={style}>
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
        {children && children}
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
    </View>
  );
}

export default ReportLayout = forwardRef(ReportLayout);
