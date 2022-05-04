import { harmonyApi } from "@shared/services";
import { statusSuccess } from "@shared/utils";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

const TIME_REMIND = 7 * 24 * 60 * 60 * 1000; // 7 ngay
export const useMerchantExpired = () => {
  const { merchantId } = useSelector((state) => state.dataLocal?.profile);

  const [expiredDate, setExpiredDate] = React.useState(null);
  const [isExpiredDate, setIsExpiredDate] = React.useState(null);

  const [
    getMerchant,
    { currentData: merchantGeneral, isLoading: isGetMerchantGeneral },
  ] = harmonyApi.useLazyGetMerchantGeneralQuery();

  React.useEffect(() => {
    const { codeStatus, data } = merchantGeneral || {};
    if (statusSuccess(codeStatus)) {
      if (data?.expiredDate) {
        setExpiredDate(data?.expiredDate);
      }
    }
  }, [merchantGeneral]);

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
      getMerchant(merchantId);
    }
  }, [merchantId]);

  return { isExpiredDate, expiredDate };
};
