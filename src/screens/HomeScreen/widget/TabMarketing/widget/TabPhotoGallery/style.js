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
    backgroundColor: "#FFF",
    padding: ScaleSzie(12),
    marginLeft: ScaleSzie(15),
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: ScaleSzie(10),
    borderTopRightRadius: ScaleSzie(10),
  },
  title: {
    fontSize: ScaleSzie(15),
    fontWeight: "600",
    color: "#0764B0",
  },
  btn: {
    width: ScaleSzie(45),
    height: ScaleSzie(45),
    borderRadius: ScaleSzie(3),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    marginLeft: ScaleSzie(15),
  },
  ic: {
    width: ScaleSzie(30),
    height: ScaleSzie(30)
  },
  footer: {
    height: ScaleSzie(75),
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: ScaleSzie(10),
  },
  upload: { 
    height: "95%", 
    backgroundColor: "#FFF", 
    marginTop: -1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  btn_upload: {
    width: ScaleSzie(120),
    height: ScaleSzie(120),
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderStyle: 'dashed'
  },
  text: {
    color: '#6A6A6A',
    fontSize: ScaleSzie(12),
    marginTop: ScaleSzie(10)
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
});
