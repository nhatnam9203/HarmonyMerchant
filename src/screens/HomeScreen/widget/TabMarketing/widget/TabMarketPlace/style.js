import { StyleSheet, Dimensions, Platform } from "react-native";

import Configs from "@configs";
import { scaleSize } from "@utils";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    paddingTop: scaleSize(15),
  },
  row: {
    flexDirection: "row",
  },
  tabName: {
    width: scaleSize(110),
    paddingHorizontal: scaleSize(5),
    backgroundColor: '#FFF',
    padding: scaleSize(12),
    marginLeft: scaleSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: scaleSize(10),
    borderTopRightRadius: scaleSize(10),
  },
  title: {
    fontSize: scaleSize(15),
    fontWeight: "600",
    color: "#0764B0",
  },
});
