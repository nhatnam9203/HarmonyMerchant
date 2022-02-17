import React from "react";
import {
  getAdvanceSetting,
  editAdvanceSetting,
  useAxiosQuery,
  useAxiosMutation,
} from "@apis";
import actions from "@actions";
import { useDispatch } from "react-redux";

export const useProps = (props) => {
  const [loyaltyProgram, setLoyaltyProgram] = React.useState(null);
  const [loyaltyProgramLocal, setLoyaltyProgramLocal] = React.useState(null);

  const [, getAdvance] = useAxiosQuery({
    ...getAdvanceSetting(),
    enabled: false,
    onSuccess: (data, response) => {
      if (data) {
        setLoyaltyProgram(data);
        setLoyaltyProgramLocal(data);
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

  // React.useEffect(() => {
  //   if (loyaltyProgram && isMount && isUpdate) {
  //     editAdvance();
  //   }
  // }, [loyaltyProgram]);

  return {
    loyaltyProgramLocal,
    isHadUpdate: () => isHadUpdate(),
    setIsLoyaltyProgram: (value = false) => {
      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        IsLoyaltyProgram: value,
      });
    },
    setCashStarRate: (value = 0) => {
      let temp = value;
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }
      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        CashStarRate: temp,
      });
    },
    setCreditCardStarRate: (value = 0) => {
      let temp = value;
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }

      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        CreditCardStarRate: temp,
      });
    },
    setHarmonyPayStarRate: (value = 0) => {
      let temp = value;
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }

      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        HarmonyPayStarRate: temp,
      });
    },
    setOtherStarRate: (value = 0) => {
      let temp = value;
      if (!temp || isNaN(parseFloat(value))) {
        temp = 0;
      }

      setLoyaltyProgramLocal({
        ...loyaltyProgramLocal,
        OtherStarRate: temp,
      });
    },
    onSaveButtonPress: () => {
      editAdvance();
    },
    onCancelButtonPress: () => {
      setLoyaltyProgramLocal(loyaltyProgram);
    },
  };
};
