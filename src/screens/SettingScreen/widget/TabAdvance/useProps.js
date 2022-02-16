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
  const [isMount, setIsMount] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);

  const [, getAdvance] = useAxiosQuery({
    ...getAdvanceSetting(),
    enabled: false,
    onSuccess: (data, response) => {
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
      setIsUpdate(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  React.useEffect(() => {
    getAdvance();
    setIsMount(true);

    return () => {
      // componentWillUnmount events
      setIsMount(false);
    };
  }, []);

  React.useEffect(() => {
    if (loyaltyProgram && isMount && isUpdate) {
      editAdvance();
    }
  }, [loyaltyProgram]);

  return {
    loyaltyProgram,
    setIsLoyaltyProgram: (value = false) => {
      setIsUpdate(true); // !! đang lỗi bị gọi nhiều lần lúc load, do component CustomSwitch sai !

      setLoyaltyProgram({
        ...loyaltyProgram,
        IsLoyaltyProgram: value,
      });
    },
    setCashStarRate: (value = 0) => {
      setIsUpdate(true);

      setLoyaltyProgram({
        ...loyaltyProgram,
        CashStarRate: value,
      });
    },
    setCreditCardStarRate: (value = 0) => {
      setIsUpdate(true);

      setLoyaltyProgram({
        ...loyaltyProgram,
        CreditCardStarRate: value,
      });
    },
    setHarmonyPayStarRate: (value = 0) => {
      setIsUpdate(true);

      setLoyaltyProgram({
        ...loyaltyProgram,
        HarmonyPayStarRate: value,
      });
    },
    setOtherStarRate: (value = 0) => {
      setIsUpdate(true);

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
