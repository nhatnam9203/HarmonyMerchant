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

  const [, getAdvance] = useAxiosQuery({
    ...getAdvanceSetting(),
    enabled: false,
    onSuccess: (data, response) => {
      console.log(data);
      if (data) {
        setLoyaltyProgram(data);
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const [, editAdvance] = useAxiosMutation({
    ...editAdvanceSetting(loyaltyProgram),
    onSuccess: (data, response) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  React.useEffect(() => {
    getAdvance();
  }, []);

  return {
    loyaltyProgram,
    setIsLoyaltyProgram: (value = false) => {
      setLoyaltyProgram({
        ...loyaltyProgram,
        IsLoyaltyProgram: value,
      });
    },
    setCashStarRate: (value = 0) => {
      console.log(value);
      setLoyaltyProgram({
        ...loyaltyProgram,
        CashStarRate: value,
      });
    },
    setCreditCardStarRate: (value = 0) => {
      setLoyaltyProgram({
        ...loyaltyProgram,
        CreditCardStarRate: value,
      });
    },
    setHarmonyPayStarRate: (value = 0) => {
      setLoyaltyProgram({
        ...loyaltyProgram,
        HarmonyPayStarRate: value,
      });
    },
    setOtherStarRate: (value = 0) => {
      setLoyaltyProgram({
        ...loyaltyProgram,
        OtherStarRate: value,
      });
    },
    onSaveButtonPress: () => {
      editAdvance();
    },
  };
};
