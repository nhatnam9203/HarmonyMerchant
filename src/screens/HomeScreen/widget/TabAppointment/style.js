import { StyleSheet, Dimensions, Platform } from "react-native";
import { scaleSize } from "@utils";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAddAppoitment: {
    width: width,
    height: height - scaleSize(45),
    position: "absolute",
    // bottom: 0,
    left: 0,
    right: 0,
    // top:scaleSize(1),
    backgroundColor: "#fff",
  },
  headerContainer: {
    height: scaleSize(45),
    flexDirection: "row",
    borderColor: "rgb(197,197,197)",
    borderWidth: 1,
    paddingHorizontal: scaleSize(14),
    alignItems: "center",
  },
  textHeader: {
    fontSize: scaleSize(20),
    color: "#404040",
  },
  categoriesHeader: {
    height: scaleSize(46),
    borderWidth: 1,
    borderColor: "#404040",
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesBody: {
    flex: 1,
    // backgroundColor:'red'
  },
  shadowLine: {
    width: 2,
    backgroundColor: "#404040",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0,1)",
        shadowOpacity: 1,
      },

      android: {
        elevation: 2,
      },
    }),
  },
  shadowLineLeft: {
    shadowOffset: { width: -3.5, height: 2 },
  },
  shadowLineRight: {
    shadowOffset: { width: 3.5, height: 2 },
  },
  headerBasket: {
    height: scaleSize(46),
    borderWidth: 1,
    borderColor: "rgb(197,197,197)",
    borderRightColor: "rgb(223,223,223)",
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  payNumberTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scaleSize(6),
  },
  textPay: {
    fontSize: scaleSize(16),
    color: "#404040",
  },
});
