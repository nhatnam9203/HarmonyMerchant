import { useStaffLogTimeGet } from "@shared/services/api/retailer/Staff";
import { useTranslation } from "react-i18next";
import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import {
  CustomerGroupTypes,
  SORT_TYPE,
  statusSuccess,
} from "@shared/utils/app";

const STAFF_LOG_TIME_GROUPS = [
  { label: "All type", value: 0 },
  { label: "Check In", value: 1 },
  { label: "Check Out", value: 2 },
];

export const useProps = (props) => {
  const { t } = useTranslation();

  const [type, setType] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [searchVal, setSearchVal] = React.useState("");
  const [items, setItems] = React.useState(null);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [staffLogTime, getStaffLogTime] = useStaffLogTimeGet();
  const callGetStaffLogTime = React.useCallback(() => {
    getStaffLogTime({
      key: searchVal ?? "",
      page: page,
      type: 0,
      // sort: { Id: sortName },
    });
  }, [type, page, searchVal]);

  React.useEffect(() => {
    callGetStaffLogTime();
  }, [type, page, searchVal]);

  React.useEffect(() => {
    const { codeStatus, data, pages = 0, count = 0 } = staffLogTime || {};
    if (statusSuccess(codeStatus)) {
      setItems(data);
      // setPagination({
      //   pages,
      //   count,
      // });
    }
  }, [staffLogTime]);

  // useFocusEffect(React.useCallback(() => {}, []));

  return { items, STAFF_LOG_TIME_GROUPS };
};
