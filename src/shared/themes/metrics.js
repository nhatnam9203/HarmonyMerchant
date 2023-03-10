/*
 * platform/application wide metrics for proper styling
 */
import { Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  navBarHeight: Platform.OS === "ios" ? 54 : 66,
};
