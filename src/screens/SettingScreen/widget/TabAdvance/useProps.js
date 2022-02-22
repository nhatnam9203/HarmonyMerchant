import {
  editAdvanceSetting,
  getAdvanceSetting,
  useAxiosMutation,
  useAxiosQuery,
} from "@apis";
import React from "react";
import { formatNumberFromCurrency } from "@utils";

export const useProps = (props) => {
  const [loyaltyProgram, setLoyaltyProgram] = React.useState(null);
  const [loyaltyProgramLocal, setLoyaltyProgramLocal] = React.useState(null);

  const [cashStarRate, setCashStarRate] = React.useState(0);
  const [creditCardStarRate, setCreditCardStarRate] = React.useState(0);
  const [harmonyPayStarRate, setHarmonyPayStarRate] = React.useState(0);
  const [otherStarRate, setOtherStarRate] = React.useState(0);

  const [, getAdvance] = useAxiosQuery({
    ...getAdvanceSetting(),
    enabled: false,
    onSuccess: (data, response) => {
      if (data) {
        setLoyaltyProgram(data);
        setLoyaltyProgramLocal(data);
        setCashStarRate(data?.CashStarRate);
        setCreditCardStarRate(data?.CreditCardStarRate);
        setHarmonyPayStarRate(data?.HarmonyPayStarRate);
        setOtherStarRate(data?.OtherStarRate);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const [, editAdvance] = useAxiosMutation({
    ...editAdvanceSetting(loyaltyProgramLocal),
    onSuccess: (data, response) => {
      setLoyaltyProgram(loyaltyProgramLocal);
      setCashStarRate(loyaltyProgramLocal?.CashStarRate);
      setCreditCardStarRate(loyaltyProgramLocal?.CreditCardStarRate);
      setHarmonyPayStarRate(loyaltyProgramLocal?.HarmonyPayStarRate);
      setOtherStarRate(loyaltyProgramLocal?.OtherStarRate);
      alert("Update success!");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const isHadUpdate = () => {
    return (
      loyaltyProgram?.IsLoyaltyProgram !==
        loyaltyProgramLocal?.IsLoyaltyProgram ||
      loyaltyProgram?.CashStarRate !== loyaltyProgramLocal?.CashStarRate ||
      loyaltyProgram?.CreditCardStarRate !==
        loyaltyProgramLocal?.CreditCardStarRate ||
      loyaltyProgram?.HarmonyPayStarRate !==
        loyaltyProgramLocal?.HarmonyPayStarRate ||
      loyaltyProgram?.OtherStarRate !== loyaltyProgramLocal?.OtherStarRate
    );
  };

  React.useEffect(() => {
    getAdvance();

    return () => {
      // componentWillUnmount events
    };
  }, []);

  return {
    loyaltyProgramLocal,
    cashStarRate,
    creditCardStarRate,
    harmonyPayStarRate,
    otherStarRate,
    isHadUpdate: () => isHadUpdate(),
    setIsLoyaltyProgram: (value = false) => {
      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        IsLoyaltyProgram: value,
      });
    },
    setCashStarRate: (value) => {
      let temp = value;
      setCashStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        CashStarRate: parseFloat(temp).toFixed(2),
      });
    },
    setCreditCardStarRate: (value) => {
      let temp = value;
      setCreditCardStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }

      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        CreditCardStarRate: parseFloat(temp).toFixed(2),
      });
    },
    setHarmonyPayStarRate: (value) => {
      let temp = value;
      setHarmonyPayStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        HarmonyPayStarRate: parseFloat(temp).toFixed(2),
      });
    },
    setOtherStarRate: (value) => {
      let temp = value;
      setOtherStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        OtherStarRate: parseFloat(temp).toFixed(2),
      });
    },
    onSaveButtonPress: () => {
      editAdvance();
    },
    onCancelButtonPress: () => {
      setLoyaltyProgramLocal(loyaltyProgram);
      setCashStarRate(loyaltyProgram?.CashStarRate);
      setCreditCardStarRate(loyaltyProgram?.CreditCardStarRate);
      setHarmonyPayStarRate(loyaltyProgram?.HarmonyPayStarRate);
      setOtherStarRate(loyaltyProgram?.OtherStarRate);
    },
  };
};
