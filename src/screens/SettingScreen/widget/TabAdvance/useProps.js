import {
  editAdvanceSetting,
  getAdvanceSetting,
  useAxiosMutation,
  useAxiosQuery,
} from "@apis";
import React from "react";
import { formatNumberFromCurrency } from "@utils";

export const useProps = (props) => {
  const [data, setData] = React.useState(null);
  const [dataLocal, setDataLocal] = React.useState(null);

  const [isCashDiscount, setIsCashDiscount] = React.useState(null);

  const [cashStarRate, setCashStarRate] = React.useState(0);
  const [creditCardStarRate, setCreditCardStarRate] = React.useState(0);
  const [harmonyPayStarRate, setHarmonyPayStarRate] = React.useState(0);
  const [otherStarRate, setOtherStarRate] = React.useState(0);

  const [, getAdvance] = useAxiosQuery({
    ...getAdvanceSetting(),
    enabled: false,
    onSuccess: (data, response) => {
      if (data) {
        setData(data);
        setDataLocal(data);
        setCashStarRate(data?.CashStarRate);
        setCreditCardStarRate(data?.CreditCardStarRate);
        setHarmonyPayStarRate(data?.HarmonyPayStarRate);
        setOtherStarRate(data?.OtherStarRate);

        setIsCashDiscount(data?.IsCashDiscount);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const [, editAdvance] = useAxiosMutation({
    ...editAdvanceSetting(dataLocal),
    onSuccess: (data, response) => {
      setData(dataLocal);
      setCashStarRate(dataLocal?.CashStarRate);
      setCreditCardStarRate(dataLocal?.CreditCardStarRate);
      setHarmonyPayStarRate(dataLocal?.HarmonyPayStarRate);
      setOtherStarRate(dataLocal?.OtherStarRate);
      setIsCashDiscount(dataLocal?.IsCashDiscount);
      alert("Update success!");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const isHadUpdate = () => {
    return ( 
      data?.IsLoyaltyProgram !==
        dataLocal?.IsLoyaltyProgram ||
      data?.CashStarRate !== dataLocal?.CashStarRate ||
      data?.CreditCardStarRate !==
        dataLocal?.CreditCardStarRate ||
      data?.HarmonyPayStarRate !==
        dataLocal?.HarmonyPayStarRate ||
      data?.OtherStarRate !== dataLocal?.OtherStarRate ||
      data?.IsCashDiscount !== dataLocal?.IsCashDiscount ||
    );
  };

  React.useEffect(() => {
    getAdvance();

    return () => {
      // componentWillUnmount events
    };
  }, []);

  return {
    isCashDiscount,
    setIsCashDiscount: (isCashDiscount) => {
      setIsCashDiscount(isCashDiscount);
      setDataLocal({
        ...dataLocal,
        IsCashDiscount: isCashDiscount
      })
    },
   
    dataLocal,
    cashStarRate,
    creditCardStarRate,
    harmonyPayStarRate,
    otherStarRate,
    isHadUpdate: () => isHadUpdate(),
    setIsLoyaltyProgram: (value = false) => {
      setDataLocal({
        ...dataLocal,
        IsLoyaltyProgram: value,
      });
    },
    setCashStarRate: (value) => {
      let temp = value;
      setCashStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      setDataLocal({
        ...dataLocal,
        CashStarRate: parseFloat(temp).toFixed(2),
      });
    },
    setCreditCardStarRate: (value) => {
      let temp = value;
      setCreditCardStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }

      setDataLocal({
        ...dataLocal,
        CreditCardStarRate: parseFloat(temp).toFixed(2),
      });
    },
    setHarmonyPayStarRate: (value) => {
      let temp = value;
      setHarmonyPayStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      setDataLocal({
        ...dataLocal,
        HarmonyPayStarRate: parseFloat(temp).toFixed(2),
      });
    },
    setOtherStarRate: (value) => {
      let temp = value;
      setOtherStarRate(temp);
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      setDataLocal({
        ...dataLocal,
        OtherStarRate: parseFloat(temp).toFixed(2),
      });
    },
    onSaveButtonPress: () => {
      editAdvance();
    },
    onCancelButtonPress: () => {
      setDataLocal(data);
      setCashStarRate(data?.CashStarRate);
      setCreditCardStarRate(data?.CreditCardStarRate);
      setHarmonyPayStarRate(data?.HarmonyPayStarRate);
      setOtherStarRate(data?.OtherStarRate);
      setIsCashDiscount(data?.IsCashDiscount);
    },
  };
};
