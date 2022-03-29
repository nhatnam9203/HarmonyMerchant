import { useDispatch, useSelector } from "react-redux";
import React from "react";
import moment from "moment";

const TIME_REMIND = 7 * 24 * 60 * 60 * 1000; // 7 ngay
export const useMerchantExpired = () => {
  const expiredDate = useSelector(
    (state) => state.dataLocal?.profile?.expiredDate
  );



  const checkAppIsExpired = () => {
    if (expiredDate) {
      const temp = "2030-05-01T00:00:00";
      const dateToMilliseconds = moment(temp).valueOf(); // Unix Timestamp (milliseconds)
      console.log(dateToMilliseconds);
      const current = new Date().getTime();
      console.log(current);

      const delta = dateToMilliseconds - current - TIME_REMIND;
      console.log(delta);

      return delta <= 0;
    }
    return false;
  };

  React.useEffect(() => {}, [expiredDate]);

  return { checkAppIsExpired };
};
