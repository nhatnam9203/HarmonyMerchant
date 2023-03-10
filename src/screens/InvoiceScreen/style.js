import { StyleSheet } from "react-native";

import { scaleSize } from "@utils";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    borderRadius: scaleSize(4),
    // backgroundColor:'#F1F1F1',
    backgroundColor: "rgb(246,246,246)",
  },
  payNumberTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scaleSize(4),
  },
  textPay: {
    fontSize: scaleSize(14),
    color: "#404040",
  },
  txt_normal: {
    color: "#000000",
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "600",
  },
  txt_info: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  txt_total: {
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
  },
  rowSignature: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  signImage:{
    width: scaleSize(100),
    height: scaleSize(40),
    resizeMode: "contain",
  }
});
