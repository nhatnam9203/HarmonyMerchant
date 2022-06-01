import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";

import { PopupParent, Button } from "@components";
import { scaleSize, formatNumberFromCurrency, formatMoney } from "@utils";
import IMAGE from "@resources";
import connectRedux from "@redux/ConnectRedux";

const initState = {
  leftNumbers: "0",
  rightNumners: "00",
  isPressDot: 0,
  isClear: 1,
  quality: "0",
  isResetQuantityToZero: false,
  visiblePopup: false,
};

class PopupEnterAmountCustomService extends React.Component {
  constructor(props) {
    super(props);
    this.state = initState;
  }

  showPopup = (staff, itemService) => {
    this.setState({
      visiblePopup: true,
      currentStaff: staff,
      itemService: itemService,
    });
  };

  onPressNumber = async (number) => {
    const { leftNumbers, isPressDot, rightNumners } = this.state;
    const amount = formatMoney(`${leftNumbers}.${rightNumners}`);
    if (`${amount}`.length < 12) {
      if (!isPressDot) {
        this.setState((prevState) => ({
          leftNumbers:
            prevState.leftNumbers == "0"
              ? `${number}`
              : `${prevState.leftNumbers}${number}`,
          isClear: 1,
        }));
      } else {
        let tempRightNumners = false;
        if (isPressDot === 1) {
          tempRightNumners = `${number}${rightNumners[1]}`;
        } else if (isPressDot === 2) {
          tempRightNumners = `${rightNumners[0]}${number}`;
        }
        if (tempRightNumners) {
          this.setState({
            rightNumners: tempRightNumners,
            isPressDot: isPressDot === 1 ? 2 : 0,
            isClear: 1,
          });
        }
      }
    }
  };

  onPressAddNumber = (number) => {
    const { leftNumbers, rightNumners } = this.state;
    const tempQuantity =
      formatNumberFromCurrency(`${leftNumbers}.${rightNumners}`) + number;
    const { leftMoney, rightMoney } = this.formatState(tempQuantity);

    this.setState({
      leftNumbers: leftMoney,
      rightNumners: rightMoney,
      isPressDot: 0,
      isClear: 1,
    });
  };

  formatState = (MoneyString) => {
    const quantity = `${MoneyString}`.split(".");

    return {
      leftMoney: quantity[0],
      rightMoney: quantity[1]
        ? quantity[1] < 10 && quantity[1].length < 2
          ? `0${quantity[1]}`
          : `${quantity[1]}`
        : "00",
    };
  };

  addDotInNumber = () => {
    this.setState({
      isPressDot: 1,
    });
  };

  clearNumber = async () => {
    const { visiblePopup, currentStaff } = this.state;

    this.setState({ ...initState, visiblePopup, currentStaff });
  };

  cancel = () => {
    this.setState({
      quality: "0",
    });
  };

  addAmount = () => {
    // const { quality } = this.state;
    const { leftNumbers, rightNumners, currentStaff, itemService } = this.state;
    const { submitAddCustomService } = this.props;

    const money = formatNumberFromCurrency(`${leftNumbers}.${rightNumners}`);
    if (formatNumberFromCurrency(money) > 0) {
      submitAddCustomService({
        staffId: currentStaff.staffId,
        price: money,
        categoryId: itemService?.category?.categoryId,
        serviceId: itemService?.serviceId,
      });
    } else {
      alert("Amount must greater than 0!");
    }
    this.setState({
      leftNumbers: "0",
      rightNumners: "00",
      isPressDot: 0,
      isClear: 1,
      quality: "0",
      isResetQuantityToZero: false,
      visiblePopup: false,
    });
  };

  onRequestClose = () => {
    this.setState(initState);
  };

  // ---------- Render --------
  render() {
    const { leftNumbers, rightNumners, visiblePopup } = this.state;
    const amount = formatMoney(`${leftNumbers}.${rightNumners}`);

    return (
      <PopupParent
        title={"Service Amount"}
        visible={visiblePopup}
        onRequestClose={this.onRequestClose}
        style={{}}
        width={scaleSize(350)}
        styleTitle={{
          fontSize: scaleSize(18),
          fontWeight: "bold",
        }}
      >
        <View
          style={{
            minHeight: scaleSize(360),
            backgroundColor: "#fff",
            borderBottomLeftRadius: scaleSize(15),
            borderBottomRightRadius: scaleSize(15),
            paddingHorizontal: scaleSize(12),
          }}
        >
          <View style={{ flex: 1 }}>
            {/* ------ Display Box --- */}
            <Text
              style={{
                textAlign: "center",
                marginTop: scaleSize(20),
                fontSize: scaleSize(16),
                fontWeight: "600",
              }}
            >
              {"Enter the amount for custom service"}
            </Text>

            {/* ------ Display Box --- */}
            <View
              style={{
                flexDirection: "row",
                height: scaleSize(50),
                marginTop: scaleSize(14),
              }}
            >
              {/* ------ Box Left --- */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#FAFAFA",
                  borderWidth: 2,
                  borderColor: "#6A6A6A",
                  justifyContent: "space-between",
                  paddingHorizontal: scaleSize(8),
                  borderRadius: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: scaleSize(28),
                    color: "#8BC53F",
                    fontWeight: "600",
                  }}
                >
                  {`$`}
                </Text>
                <Text
                  style={{
                    fontSize: scaleSize(28),
                    color: "#8BC53F",
                    fontWeight: "600",
                  }}
                >
                  {`${amount}`}
                </Text>
              </View>
            </View>

            {/* ----- Keyboard ---- */}
            <View style={{ flex: 1, flexDirection: "row" }}>
              {/* ---- Left ----- */}
              <View style={{ flex: 1 }}>
                {/* ---- Row 1 ----- */}
                <View style={styles.rowKeyboard}>
                  {[7, 8, 9].map((number, index) => (
                    <Key
                      key={index}
                      number={number}
                      onPressNumber={this.onPressNumber}
                    />
                  ))}
                </View>
                {/* ---- Row 2 ----- */}
                <View style={styles.rowKeyboard}>
                  {[4, 5, 6].map((number, index) => (
                    <Key
                      key={index}
                      number={number}
                      onPressNumber={this.onPressNumber}
                    />
                  ))}
                </View>
                {/* ---- Row 3 ----- */}
                <View style={styles.rowKeyboard}>
                  {[1, 2, 3].map((number, index) => (
                    <Key
                      key={index}
                      number={number}
                      onPressNumber={this.onPressNumber}
                    />
                  ))}
                </View>
                {/* ---- Row 4 ----- */}
                <View style={styles.rowKeyboard}>
                  <Button
                    onPress={this.addDotInNumber}
                    style={styles.keyContainer}
                  >
                    <Text
                      style={{
                        fontSize: scaleSize(26),
                        color: "#404040",
                        fontWeight: "500",
                      }}
                    >
                      {`.`}
                    </Text>
                  </Button>

                  <Key number={0} onPressNumber={this.onPressNumber} />
                  <TouchableOpacity
                    onPress={this.clearNumber}
                    style={styles.keyContainer}
                  >
                    <Image source={IMAGE.clearKeyboard} />
                  </TouchableOpacity>
                </View>
              </View>
              {/* ---- Line ----- */}
              <View
                style={{
                  width: scaleSize(18),
                  paddingBottom: scaleSize(2),
                  paddingTop: scaleSize(9),
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: 4,
                    backgroundColor: "#D0D2D3",
                  }}
                />
              </View>
              {/* -------------- */}
              <View style={{ width: scaleSize(70) }}>
                {[10, 20, 50, 100].map((number, index) => (
                  <Key
                    key={number}
                    number={number}
                    onPressNumber={this.onPressAddNumber}
                    style={{ marginTop: scaleSize(9) }}
                    txtStyle={{
                      color: "#0764B0",
                    }}
                  />
                ))}
              </View>
            </View>

            {/* ------------- Add To Basket Button -------- */}
            <Button
              onPress={this.addAmount}
              style={{
                height: scaleSize(50),
                width: "100%",
                backgroundColor: "#0764B0",
                marginVertical: scaleSize(15),
                borderRadius: scaleSize(2),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: scaleSize(20),
                  fontWeight: "600",
                }}
              >
                {`ADD TO BASKET`}
              </Text>
            </Button>
          </View>
        </View>
      </PopupParent>
    );
  }

  async componentDidUpdate(prevProps, prevState) {}
}

const Key = ({ number, onPressNumber, style, txtStyle }) => {
  return (
    <TouchableOpacity
      onPress={() => onPressNumber(number)}
      style={[styles.keyContainer, style]}
    >
      <Text
        style={[
          { fontSize: scaleSize(26), color: "#404040", fontWeight: "500" },
          txtStyle,
        ]}
      >
        {number}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  keyContainer: {
    width: scaleSize(70),
    height: scaleSize(35),
    backgroundColor: "#fff",
    borderRadius: scaleSize(4),
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        borderRadius: scaleSize(4),
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 0 },
      },

      android: {
        elevation: 2,
      },
    }),
  },
  rowKeyboard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scaleSize(9),
  },
});

const mapStateToProps = (state) => ({
  customService: state.service.customService,
});

export default connectRedux(mapStateToProps, PopupEnterAmountCustomService);
