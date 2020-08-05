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

import { PopupExportReport, PopupLoadingExportReport } from "../../../widget";

import PaymentMethod from "./PaymentMethod";
import PaymentStatistic from "./PaymentStatistic";

const FILE_EXTENSION = "csv";
const FILTER_NAME_DEFAULT = "All Staff";

function PaymentMethodTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const overallPMFilterId = useSelector(
    (state) => state.report.overallPMFilterId
  );
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
  const [titleRangeTime, setTitleRangeTime] = useState("This week");
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
    didBlur: () => {
      setTitleRangeTime("This week");
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
    },
  }));

  const getOverallPaymentMethod = async () => {
    await dispatch(
      actions.report.getOverallPaymentMethod(true, getFilterTimeParams())
    );
  };

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
    await setTitleRangeTime(title !== "Time Range" ? title : "All time");
    getOverallPaymentMethod();
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
        await setTitleExportFile("Report payment method " + getTimeTitle());
        break;
      case 1:
        await setTitleExportFile(
          "Report payment method statistics " + getTimeTitle()
        );
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
          actions.report.exportPaymentMethod(
            url,
            true,
            "excel",
            titleExportFile
          )
        );
        break;
      case 1:
        dispatch(
          actions.report.exportPaymentMethodStatistics(
            overallPMFilterId,
            url,
            true,
            "excel",
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

  /**effect */
  useEffect(() => {
    getOverallPaymentMethod();
  }, []);

  useEffect(() => {
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
        <PaymentMethod
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Payment Method"
          onGoStatistics={goNext}
          showCalendar={() => setVisibleCalendar(true)}
          titleRangeTime={titleRangeTime}
          showExportFile={onShowPopupExport}
          handleTheDownloadedFile={handleTheDownloadedFile}
        />

        <PaymentStatistic
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Payment Method Statistics"
          title="Payment Method Statistics"
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
    </View>
  );
}

export default PaymentMethodTab = forwardRef(PaymentMethodTab);
