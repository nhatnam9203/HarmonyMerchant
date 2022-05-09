import { createStackNavigator } from "react-navigation";
import { CongratulationScreen, StoreInfoScreen } from "../screens";

const SetupStoreStack = createStackNavigator(
  {
    StoreInfo: StoreInfoScreen,
    Congratulation: CongratulationScreen,
  },
  {
    initialRouteName: "StoreInfo",
    headerMode: "none",
  }
);

export default SetupStoreStack;
