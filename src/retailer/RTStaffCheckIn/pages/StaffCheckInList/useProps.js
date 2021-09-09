import { useFocusEffect } from "@react-navigation/native";
import {
  useStaffLogTimeDelete,
  useStaffLogTimeEdit,
  useStaffLogTimeGet,
} from "@shared/services/api/retailer/Staff";
import { sortByDate } from "@shared/utils";
import { SORT_TYPE, statusSuccess } from "@shared/utils/app";
import { getQuickFilterTimeRange } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";

const STAFF_LOG_TIME_GROUPS = [
  { label: "All type", value: null },
  { label: "Check In", value: 0 },
  { label: "Check Out", value: 1 },
];
const RANGE_TIME_DEFAULT = "This Week";

export const useProps = (props) => {
  const { t } = useTranslation();

  const [type, setType] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [searchVal, setSearchVal] = React.useState("");
  const [items, setItems] = React.useState(null);
  const [timeVal, setTimeVal] = React.useState();
  const [sortDate, setSortDate] = React.useState(SORT_TYPE.ASC);
  const [pagination, setPagination] = React.useState({
    pages: 0,
    count: 0,
  });
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [staffLogTime, getStaffLogTime] = useStaffLogTimeGet();
  const callGetStaffLogTime = React.useCallback(() => {
    getStaffLogTime({
      ...(searchVal && { key: searchVal }),
      page: page,
      ...(type && { type: type.value }),
      ...timeVal,
      // sorts: { StartDate: sortDate },
    });
  }, [type, page, searchVal, timeVal]);

  const [staffLogTimeDelete, deleteStaffLogTime] = useStaffLogTimeDelete();
  const [staffLogTimeEdit, editStaffLogTime] = useStaffLogTimeEdit();

  React.useEffect(() => {
    const { codeStatus, data, pages = 0, count = 0 } = staffLogTime || {};
    if (statusSuccess(codeStatus)) {
      setItems(sortByDate(data, sortDate, "startDate"));
      setPagination({
        pages,
        count,
      });
    }
  }, [staffLogTime]);

  React.useEffect(() => {
    const { codeStatus, data } = staffLogTimeDelete || {};
    if (statusSuccess(codeStatus)) {
      callGetStaffLogTime();
    }
  }, [staffLogTimeDelete]);

  useFocusEffect(
    React.useCallback(() => {
      callGetStaffLogTime();
    }, [type, page, searchVal, timeVal])
  );

  return {
    items,
    sortDate,
    STAFF_LOG_TIME_GROUPS,
    pagination,
    setPage,
    setType,
    deleteSession: (it) => {
      deleteStaffLogTime(it.merchantStaffLogtimeId);
    },
    onEditSuccess: () => {
      callGetStaffLogTime();
    },
    onChangeTimeValue: (quickFilter, timeState) => {
      if (quickFilter === "Customize Date") {
        setTimeVal({
          quickFilter: "custom",
          timeStart: timeState.startDate,
          timeEnd: timeState.endDate,
        });
      } else {
        setTimeVal({ quickFilter: getQuickFilterTimeRange(quickFilter) });
      }
    },
    onSortWithKey: (sortKey) => {
      switch (sortKey) {
        case "startDate":
          const sortedDate =
            sortDate === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
          setSortDate(sortedDate);
          setItems(sortByDate(items, sortedDate, sortKey));

          break;

        default:
          break;
      }
    },
    RANGE_TIME_DEFAULT,
    onChangeValueSearch: (text) => {
      setSearchVal(text);
    },
    onButtonSearchPress: () => {
      callGetStaffLogTime();
    },
    onRefresh: () => {
      callGetStaffLogTime();
    },
  };
};
