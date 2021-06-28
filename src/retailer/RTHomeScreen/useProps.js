import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useIsPayment } from "./hooks";
export const useProps = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isPayment = useIsPayment();
  const openDrawer = () => {
    if (isPayment) {
      showPopupConfirm(() => {
        navigation.openDrawer();
      });
      return;
    }
    navigation.openDrawer();
  };

  const showPopupConfirm = (func) => {
    dispatch({
      type: "VISIBLE_POPUP_PAYMENT_CONFIRM",
      payload: { visible: true, func: func },
    });
  };

  return { openDrawer, isPayment, showPopupConfirm, navigation };
};
