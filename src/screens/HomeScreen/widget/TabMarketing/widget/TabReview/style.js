import { StyleSheet, Dimensions, Platform } from "react-native";

import Configs from "@configs";
import { scaleSize } from "@utils";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: scaleSize(15),
  },
  textNormal: {
    color: "#404040",
    fontSize: scaleSize(14),
  },
  row: {
    flexDirection: "row",
  },
  itemDropdown: {
    width: scaleSize(120),
    height: scaleSize(38),
    paddingLeft: scaleSize(15),
  },
  titletabar: {
    color: "#404040",
    fontSize: scaleSize(17),
    fontWeight: "500",
  },
  closeBtn: {
    position: 'absolute',
    top: scaleSize(20),
    right: scaleSize(10),
    width: scaleSize(30),
    height: scaleSize(30),
    justifyContent: "center",
    alignItems: "center",
  },
  close:{
    width: scaleSize(30),
    height: scaleSize(30),
  },
  headerView: {
    position: 'absolute',
    right: scaleSize(10)
  }
});
