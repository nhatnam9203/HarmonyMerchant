import Reactotron, {
  asyncStorage,
  openInEditor,
  networking,
  trackGlobalErrors,
} from "reactotron-react-native";
import sagaPlugin from "reactotron-redux-saga";
import { reactotronRedux } from "reactotron-redux";
import AsyncStorage from "@react-native-community/async-storage";

const reactotron = Reactotron.configure({ name: "Harmony Pay" }) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  // .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  //.use(openInEditor()) // <--- here we go!
  .use(networking()) // <--- here we go!
  .use(sagaPlugin())
  .use(asyncStorage())
  .use(trackGlobalErrors()) // <--- here we go!
  .use(
    reactotronRedux({
      except: ["EFFECT_TRIGGERED", "EFFECT_RESOLVED", "EFFECT_REJECTED"],
    })
  ) //  <- here i am

  .connect(); // let's connect!

export default reactotron;
