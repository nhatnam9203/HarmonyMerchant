import {
  editAdvanceSetting,
  getAdvanceSetting,
  useAxiosMutation,
  useAxiosQuery,
} from "@apis";
import React from "react";
import { useSelector } from "react-redux";
import * as advanceLocalState from "./AdvanceLocalState";

export const useProps = (props) => {
  const settings = useSelector((state) => state.app.advanceSetting);

  const [advanceSetting, dispatchAdvanceSetting] = React.useReducer(
    advanceLocalState.advanceReducer,
    null
  );

  const [isCashDiscount, setIsCashDiscount] = React.useState(null);

  // const [, getAdvance] = useAxiosQuery({
  //   ...getAdvanceSetting(),
  //   enabled: false,
  //   onSuccess: (data, response) => {
  //     if (data) {
  //       setData(data);
  //       setDataLocal(data);
  //       setCashStarRate(data?.CashStarRate);
  //       setCreditCardStarRate(data?.CreditCardStarRate);
  //       setHarmonyPayStarRate(data?.HarmonyPayStarRate);
  //       setOtherStarRate(data?.OtherStarRate);

  //       setIsCashDiscount(data?.IsCashDiscount);
  //     }
  //   },
  //   onError: (e) => {
  //     console.log(e);
  //   },
  // });

  const [, editAdvance] = useAxiosMutation({
    ...editAdvanceSetting(advanceSetting),
    onSuccess: (data, response) => {
      // setData(dataLocal);
      // setCashStarRate(dataLocal?.CashStarRate);
      // setCreditCardStarRate(dataLocal?.CreditCardStarRate);
      // setHarmonyPayStarRate(dataLocal?.HarmonyPayStarRate);
      // setOtherStarRate(dataLocal?.OtherStarRate);
      // setIsCashDiscount(dataLocal?.IsCashDiscount);
      alert("Update success!");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const isHadUpdate = () => {
    return (
      settings?.IsLoyaltyProgram !== advanceSetting?.IsLoyaltyProgram ||
      settings?.CashStarRate !== advanceSetting?.CashStarRate ||
      settings?.CreditCardStarRate !== advanceSetting?.CreditCardStarRate ||
      settings?.HarmonyPayStarRate !== advanceSetting?.HarmonyPayStarRate ||
      settings?.OtherStarRate !== advanceSetting?.OtherStarRate ||
      settings?.IsCashDiscount !== advanceSetting?.IsCashDiscount
    );
  };

  React.useEffect(() => {
    dispatchAdvanceSetting(advanceLocalState.setAdvanceSetting(settings));

    return () => {
      // componentWillUnmount events
    };
  }, [settings]);

  return {
    advanceSetting,

    isCashDiscount,
    setIsCashDiscount: (isCashDiscount) => {
      // setIsCashDiscount(isCashDiscount);
      // setDataLocal({
      //   ...dataLocal,
      //   IsCashDiscount: isCashDiscount,
      // });
    },

    isHadUpdate: () => isHadUpdate(),
    setIsLoyaltyProgram: (value = false) => {
      // setDataLocal({
      //   ...dataLocal,
      //   IsLoyaltyProgram: value,
      // });
      dispatchAdvanceSetting(advanceLocalState.updateLoyaltyProgram(value));
    },
    setCashStarRate: (value) => {
      let temp = value;
      // setCashStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      // setDataLocal({
      //   ...dataLocal,
      //   CashStarRate: parseFloat(temp).toFixed(2),
      // });
      dispatchAdvanceSetting(advanceLocalState.updateCashStarRate(temp));
    },
    setCreditCardStarRate: (value) => {
      let temp = value;
      // setCreditCardStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }

      // setDataLocal({
      //   ...dataLocal,
      //   CreditCardStarRate: parseFloat(temp).toFixed(2),
      // });
      dispatchAdvanceSetting(advanceLocalState.updateCreditCardStarRate(temp));
    },
    setHarmonyPayStarRate: (value) => {
      let temp = value;
      // setHarmonyPayStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      // setDataLocal({
      //   ...dataLocal,
      //   HarmonyPayStarRate: parseFloat(temp).toFixed(2),
      // });
      dispatchAdvanceSetting(advanceLocalState.updateHarmonyPayStarRate(temp));
    },
    setOtherStarRate: (value) => {
      let temp = value;
      // setOtherStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      // setDataLocal({
      //   ...dataLocal,
      //   OtherStarRate: parseFloat(temp).toFixed(2),
      // });

      dispatchAdvanceSetting(advanceLocalState.updateOtherStarRate(temp));
    },
    onSaveButtonPress: () => {
      editAdvance();
    },
    onCancelButtonPress: () => {
      setDataLocal(settings);
      setCashStarRate(settings?.CashStarRate);
      setCreditCardStarRate(settings?.CreditCardStarRate);
      setHarmonyPayStarRate(settings?.HarmonyPayStarRate);
      setOtherStarRate(settings?.OtherStarRate);
      setIsCashDiscount(settings?.IsCashDiscount);
    },
  };
};
