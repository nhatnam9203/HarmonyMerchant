import { StyleSheet, Dimensions, Platform } from "react-native";

import Configs from "@configs";
import { scaleSzie } from "@utils";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: scaleSzie(15),
  },
  textNormal: {
    color: "#404040",
    fontSize: scaleSzie(14),
  },
  row: {
    flexDirection: "row",
  },
  itemDropdown: {
    width: scaleSzie(120),
    height: scaleSzie(40),
    paddingLeft: scaleSzie(15),
  },
  titletabar: {
      color: '#404040',
      fontSize: scaleSzie(17),
      fontWeight: '500'
  }
});
