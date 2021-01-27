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
    backgroundColor: "#FFF",
    padding: scaleSzie(12),
    marginLeft: scaleSzie(15),
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: scaleSzie(10),
    borderTopRightRadius: scaleSzie(10),
  },
  title: {
    fontSize: scaleSzie(15),
    fontWeight: "600",
    color: "#0764B0",
  },
  btn: {
    width: scaleSzie(45),
    height: scaleSzie(45),
    borderRadius: scaleSzie(3),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    marginLeft: scaleSzie(15),
  },
  ic: {
    width: scaleSzie(30),
    height: scaleSzie(30)
  },
  footer: {
    height: scaleSzie(75),
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: scaleSzie(10),
  },
  upload: { 
    height: "95%", 
    backgroundColor: "#FFF", 
    marginTop: -1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  btn_upload: {
    width: scaleSzie(120),
    height: scaleSzie(120),
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderStyle: 'dashed'
  },
  text: {
    color: '#6A6A6A',
    fontSize: scaleSzie(12),
    marginTop: scaleSzie(10)
  }
});
