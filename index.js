/**
 * @format
 */

import { AppRegistry, LogBox } from "react-native";
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import { name as appName } from "./app.json";
import "./globals";
import App from "./src/App";

// LogBox.ignoreLogs(["Warning: ..."]); //Hide warnings
// LogBox.ignoreLogs([
//   "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
// ]);

LogBox.ignoreAllLogs();

enableScreens();
AppRegistry.registerComponent(appName, () => App);
