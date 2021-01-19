import { StyleSheet, Dimensions, Platform } from "react-native";

import Configs from "@configs";
import { scaleSzie } from "@utils";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    paddingTop: scaleSzie(15),
  },
  row: {
    flexDirection: "row",
  },
  tabName: {
    width: scaleSzie(110),
    paddingHorizontal: scaleSzie(5),
    backgroundColor: '#FFF',
    padding: scaleSzie(12),
    marginLeft: scaleSzie(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: scaleSzie(10),
    borderTopRightRadius: scaleSzie(10),
  },
  title: {
    fontSize: scaleSzie(15),
    fontWeight: "600",
    color: "#0764B0",
  },
});
