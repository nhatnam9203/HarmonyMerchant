import { StyleSheet, Dimensions, Platform } from "react-native";

import Configs from "@configs";
import { ScaleSzie } from "@utils";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    paddingTop: ScaleSzie(15),
  },
  row: {
    flexDirection: "row",
  },
  tabName: {
    width: ScaleSzie(110),
    paddingHorizontal: ScaleSzie(5),
    backgroundColor: '#FFF',
    padding: ScaleSzie(12),
    marginLeft: ScaleSzie(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: ScaleSzie(10),
    borderTopRightRadius: ScaleSzie(10),
  },
  title: {
    fontSize: ScaleSzie(15),
    fontWeight: "600",
    color: "#0764B0",
  },
});
