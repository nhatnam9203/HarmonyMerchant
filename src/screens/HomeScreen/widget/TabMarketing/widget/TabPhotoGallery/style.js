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
    backgroundColor: "#FFF",
    padding: scaleSize(12),
    marginLeft: scaleSize(15),
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: scaleSize(10),
    borderTopRightRadius: scaleSize(10),
  },
  title: {
    fontSize: scaleSize(15),
    fontWeight: "600",
    color: "#0764B0",
  },
  btn: {
    width: scaleSize(45),
    height: scaleSize(45),
    borderRadius: scaleSize(3),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    marginLeft: scaleSize(15),
  },
  ic: {
    width: scaleSize(30),
    height: scaleSize(30)
  },
  footer: {
    height: scaleSize(75),
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: scaleSize(10),
  },
  upload: { 
    height: "95%", 
    backgroundColor: "#FFF", 
    marginTop: -1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  btn_upload: {
    width: scaleSize(120),
    height: scaleSize(120),
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderStyle: 'dashed'
  },
  text: {
    color: '#6A6A6A',
    fontSize: scaleSize(12),
    marginTop: scaleSize(10)
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
});
