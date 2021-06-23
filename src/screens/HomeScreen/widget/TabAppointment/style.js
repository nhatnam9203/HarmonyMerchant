import { StyleSheet, Dimensions, Platform } from "react-native";
import { ScaleSzie } from "@utils";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  containerAddAppoitment: {
    width: width,
    height: height - ScaleSzie(45),
    position: "absolute",
    // bottom: 0,
    left: 0,
    right: 0,
    // top:ScaleSzie(1),
    backgroundColor: "#fff",
  },
  headerContainer: {
    height: ScaleSzie(45),
    flexDirection: "row",
    borderColor: "rgb(197,197,197)",
    borderWidth: 1,
    paddingHorizontal: ScaleSzie(14),
    alignItems: "center",
  },
  textHeader: {
    fontSize: ScaleSzie(20),
    color: "#404040",
  },
  categoriesHeader: {
    height: ScaleSzie(46),
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
    height: ScaleSzie(46),
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
    marginBottom: ScaleSzie(6),
  },
  textPay: {
    fontSize: ScaleSzie(16),
    color: "#404040",
  },
});
