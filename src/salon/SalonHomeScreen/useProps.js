import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import actions from "@actions";
import { ScreenName } from "@src/ScreenName";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

  const isFocused = useIsFocused();
  const notiIntervalId = useSelector((state) => state.app.notiIntervalId);

  return {
    activeScreen: true,
    navigation,
    handleLockScreen: () => {
      if (isFocused) {
        NavigationServices.navigate(ScreenName.SALON.APPOINTMENT);
        popupPinCodeRef.current?.show();
      }
    },
    clearIntervalById: () => {
      if (notiIntervalId) {
        clearInterval(notiIntervalId);
        dispatch(actions.app.resetNotiIntervalId());
      }
    },
  };
};
