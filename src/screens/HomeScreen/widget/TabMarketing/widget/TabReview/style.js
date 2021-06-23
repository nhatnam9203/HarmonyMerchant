import { StyleSheet, Dimensions, Platform } from "react-native";

import Configs from "@configs";
import { ScaleSzie } from "@utils";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: ScaleSzie(15),
  },
  textNormal: {
    color: "#404040",
    fontSize: ScaleSzie(14),
  },
  row: {
    flexDirection: "row",
  },
  itemDropdown: {
    width: ScaleSzie(120),
    height: ScaleSzie(38),
    paddingLeft: ScaleSzie(15),
  },
  titletabar: {
    color: "#404040",
    fontSize: ScaleSzie(17),
    fontWeight: "500",
  },
  closeBtn: {
    position: 'absolute',
    top: ScaleSzie(20),
    right: ScaleSzie(10),
    width: ScaleSzie(30),
    height: ScaleSzie(30),
    justifyContent: "center",
    alignItems: "center",
  },
  close:{
    width: ScaleSzie(30),
    height: ScaleSzie(30),
  },
  headerView: {
    position: 'absolute',
    right: ScaleSzie(10)
  }
});
