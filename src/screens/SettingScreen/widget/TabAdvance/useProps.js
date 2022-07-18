import {
  editAdvanceSetting,
  getAdvanceSetting,
  useAxiosMutation,
  useAxiosQuery,
} from "@apis";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as advanceLocalState from "./AdvanceLocalState";
import { formatNumberFromCurrency } from "@utils";

import actions from "@actions";

export const useProps = (props) => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.app.advanceSetting);

  const [advanceSetting, dispatchAdvanceSetting] = React.useReducer(
    advanceLocalState.advanceReducer,
    null
  );

  const [, editAdvance] = useAxiosMutation({
    ...editAdvanceSetting(advanceSetting),
    onSuccess: (data, response) => {
      dispatch(actions.app.updateAdvanceSetting(advanceSetting));
      alert("Update success!");
    },
    onError: (err) => {
      dispatchAdvanceSetting(advanceLocalState.setAdvanceSetting(settings));
      console.log(err);
      alert("Update error!");
    },
  });

  const isHadUpdate = () => {
    return (
      settings?.IsLoyaltyProgram !== advanceSetting?.IsLoyaltyProgram ||
      settings?.CashStarRate !== advanceSetting?.CashStarRate ||
      settings?.CreditCardStarRate !== advanceSetting?.CreditCardStarRate ||
      settings?.HarmonyPayStarRate !== advanceSetting?.HarmonyPayStarRate ||
      settings?.OtherStarRate !== advanceSetting?.OtherStarRate ||
      settings?.IsCashDiscount !== advanceSetting?.IsCashDiscount ||
      settings?.IsAppointmentDeposit !== advanceSetting?.IsAppointmentDeposit ||
      settings?.DepositPercent !== advanceSetting?.DepositPercent ||
      settings?.MinimumAppointmentAmountRequireDeposit !==
        advanceSetting?.MinimumAppointmentAmountRequireDeposit ||
      settings?.IsAutoConfirmAppointment !== advanceSetting?.IsAutoConfirmAppointment
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
    onSaveButtonPress: () => {
      editAdvance();
    },
    onCancelButtonPress: () => {
      dispatchAdvanceSetting(advanceLocalState.setAdvanceSetting(settings));
    },
    setIsCashDiscount: (isCashDiscount) => {
      dispatchAdvanceSetting(
        advanceLocalState.updateIsCashDiscount(isCashDiscount)
      );
    },
    isHadUpdate: () => isHadUpdate(),
    setIsLoyaltyProgram: (value = false) => {
      dispatchAdvanceSetting(advanceLocalState.updateLoyaltyProgram(value));
    },
    setCashStarRate: (value) => {
      dispatchAdvanceSetting(advanceLocalState.updateCashStarRate(value));
    },
    setCreditCardStarRate: (value) => {
      dispatchAdvanceSetting(advanceLocalState.updateCreditCardStarRate(value));
    },
    setHarmonyPayStarRate: (value) => {
      dispatchAdvanceSetting(advanceLocalState.updateHarmonyPayStarRate(value));
    },
    setOtherStarRate: (value) => {
      dispatchAdvanceSetting(advanceLocalState.updateOtherStarRate(value));
    },
    // Deposit
    setDepositMiniumAmount: (value) => {
      dispatchAdvanceSetting(
        advanceLocalState.updateDepositMiniumAmount(value)
      );
    },
    setDepositPercent: (value) => {
      dispatchAdvanceSetting(
        advanceLocalState.updateDepositPercentAmount(value)
      );
    },
    setIsDepositProgram: (value = false) => {
      dispatchAdvanceSetting(
        advanceLocalState.updateIsDepositAppointment(value)
      );
    },
    setIsAutoConfirmAppointment: (value = false) => {
      dispatchAdvanceSetting(
        advanceLocalState.updateAutoConfirmAppointment(value)
      );
    }
  };
};
