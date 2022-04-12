import { useDispatch, useSelector } from "react-redux";
import React from "react";
import moment from "moment";
import { useHarmonyQuery, getMerchantGeneral } from "@apis";

const TIME_REMIND = 7 * 24 * 60 * 60 * 1000; // 7 ngay
export const useMerchantExpired = () => {
  const { merchantId } = useSelector((state) => state.dataLocal?.profile);

  const [expiredDate, setExpiredDate] = React.useState(null);
  const [isExpiredDate, setIsExpiredDate] = React.useState(null);

  const [, requestMerchantGeneral] = useHarmonyQuery({
    onSuccess: (response) => {
      const { data } = response || {};
      if (data?.expiredDate) {
        setExpiredDate(data?.expiredDate);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  React.useEffect(() => {
    if (expiredDate) {
      const dateToMilliseconds = moment(expiredDate).valueOf(); // Unix Timestamp (milliseconds)
      const current = new Date().getTime();
      const delta = dateToMilliseconds - current - TIME_REMIND;
      setIsExpiredDate(delta <= 0);
    }
  }, [expiredDate]);

  React.useEffect(() => {
    if (merchantId) {
      const args = getMerchantGeneral(merchantId);
      requestMerchantGeneral(args);
    }
  }, [merchantId]);

  return { isExpiredDate, expiredDate };
};
