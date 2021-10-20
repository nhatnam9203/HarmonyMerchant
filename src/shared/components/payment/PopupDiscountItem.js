import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  StyleSheet,
  TouchableHighlight,
  Platform,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import _ from "ramda";

import { ButtonCustom, PopupParent, Slider } from "@components";
import {
  scaleSize,
  formatNumberFromCurrency,
  formatMoney,
  localize,
  roundNumber,
  checkIsTablet,
} from "@utils";
import connectRedux from "@redux/ConnectRedux";
import ICON from "@resources";
import { colors } from "@shared/themes";
const manualType = {
  fixAmountType: "fixAmountType",
  percentType: "percentType",
};
import * as l from "lodash";

class PopupDiscountItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.customDiscountItemRef = React.createRef();
    this.scrollRef = React.createRef();
  }

  submitCustomPromotion = () => {
    const { appointmentItem, appointmentIdUpdatePromotion, groupAppointment } =
      this.props;

    const bookingProductId = l.get(appointmentItem, "bookingProductId");
    const customDiscountPercent =
      this.customDiscountItemRef.current.state.percent;
    const customFixedAmount =
      this.customDiscountItemRef.current.state.fixedAmount;
    if (!_.isEmpty(appointmentItem)) {
      const subTotal = appointmentItem?.subTotal || 0;
      const discount = appointmentItem?.discount || 0;

      let manualDiscount = 0;
      console.log(groupAppointment);
      if (groupAppointment?.appointments?.length > 0) {
        const { customDiscountPercent = 0, customDiscountFixed = 0 } =
          groupAppointment?.appointments[0];
        const customMoneyByPercent =
          (formatNumberFromCurrency(customDiscountPercent) *
            formatNumberFromCurrency(subTotal)) /
          100;
        manualDiscount = customMoneyByPercent ?? customDiscountFixed;
      }
      console.log(manualDiscount);

      let totalDiscount = 0;

      totalDiscount =
        formatNumberFromCurrency(totalDiscount) +
        formatNumberFromCurrency(customFixedAmount);
      const moneyDiscountCustom =
        (formatNumberFromCurrency(customDiscountPercent) *
          formatNumberFromCurrency(subTotal)) /
        100;
      totalDiscount =
        formatNumberFromCurrency(totalDiscount) +
        formatNumberFromCurrency(moneyDiscountCustom);

      if (
        formatNumberFromCurrency(totalDiscount) +
          formatNumberFromCurrency(manualDiscount) +
          formatNumberFromCurrency(discount) >
        formatNumberFromCurrency(subTotal)
      ) {
        Alert.alert(
          `Warning`,
          `Discount cannot be more than the subtotal.`,
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      } else {
        this.props.actions.marketing.customPromotionItem(
          customDiscountPercent,
          customFixedAmount,
          appointmentIdUpdatePromotion,
          bookingProductId
        );
        this.props.actions.marketing.closeModalDiscountItem();
        this.resetState();
      }
    }
  };

  onRequestClose = async () => {
    this.props.actions.marketing.closeModalDiscountItem();
    this.resetState();
  };

  async resetState() {
    await this.setState({});
  }

  onChangeTextCustomDiscount = async (
    moneyDiscountByPercent,
    moneyDiscountFixed
  ) => {
    await this.setState({
      moneyDiscountCustom: moneyDiscountByPercent,
      moneyDiscountFixedAmout: moneyDiscountFixed,
    });
  };

  scrollTo = (num) => {
    this.scrollRef.current?.scrollTo({ x: 0, y: num, animated: true });
  };

  // ------ Render -----
  render() {
    const {
      title,
      visibleModalDiscountItem,
      language,
      appointmentItem,
      discountItems,
    } = this.props;
    const visible = visibleModalDiscountItem;

    const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(400);
    const discountItem = l.find(discountItems, (findItem) => {
      return (
        l.get(findItem, "bookingProductId") ==
        l.get(appointmentItem, "bookingProductId")
      );
    });

    const temptCustomDiscountPercent = l.get(
      discountItem,
      "discountPercent",
      0
    );
    const temptCustomDiscountFixed = l.get(discountItem, "discount", 0);

    return (
      <PopupParent
        title={title}
        visible={visible}
        onRequestClose={this.onRequestClose}
        width={scaleSize(500)}
        height={45}
      >
        <View
          style={{
            height: tempHeight,
            backgroundColor: "#fff",
            borderBottomLeftRadius: scaleSize(15),
            borderBottomRightRadius: scaleSize(15),
          }}
        >
          <View style={{ height: scaleSize(300) }}>
            <ScrollView ref={this.scrollRef} keyboardShouldPersistTaps="always">
              {/* ----------- Row 1 ----------- */}
              <CustomDiscount
                ref={this.customDiscountItemRef}
                customDiscountPercent={temptCustomDiscountPercent}
                customDiscountFixed={temptCustomDiscountFixed}
                total={formatNumberFromCurrency(
                  l.get(appointmentItem, "subTotal")
                )}
                // total={formatNumberFromCurrency(!_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0)}
                onChangeText={(moneyDiscountByPercent, moneyDiscountFixed) =>
                  this.onChangeTextCustomDiscount(
                    moneyDiscountByPercent,
                    moneyDiscountFixed
                  )
                }
                language={language}
              />
            </ScrollView>
          </View>

          {/* ----------- Button Add ---- */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: scaleSize(40),
            }}
          >
            <ButtonCustom
              width={scaleSize(160)}
              height={40}
              backgroundColor={colors.OCEAN_BLUE}
              title={localize("Submit", language)}
              textColor="#fff"
              onPress={this.submitCustomPromotion}
              style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
            />
          </View>
        </View>
      </PopupParent>
    );
  }

  async componentDidUpdate(prevProps, prevState) {
    // const { visibleModalDiscountItem,
    //     isGetPromotionOfAppointment,
    //     appointmentItem,
    //     groupAppointment} = this.props;
    // const visible = visibleModalDiscountItem;
    // if (prevProps.isGetPromotionOfAppointment !== isGetPromotionOfAppointment && isGetPromotionOfAppointment === "success" && visible) {
    //     this.props.actions.marketing.resetStateGetPromotionOfAppointment();
    // }
  }
}

class CustomDiscount extends React.Component {
  constructor(props) {
    super(props);
    const { total, customDiscountPercent, customDiscountFixed } = this.props;
    const percent = customDiscountPercent ? customDiscountPercent : 0;
    const fixedAmount = customDiscountFixed ? customDiscountFixed : 0;
    const type =
      customDiscountFixed && customDiscountFixed > 0
        ? manualType.fixAmountType
        : manualType.percentType;
    const discountTemp =
      type == manualType.fixAmountType
        ? customDiscountFixed
        : roundNumber(
            (formatNumberFromCurrency(percent) *
              formatNumberFromCurrency(total)) /
              100
          );
    this.state = {
      percent: percent,
      discount: discountTemp,
      manualTypeSelect: type,
      fixedAmount,
      valueText: type == manualType.fixAmountType ? fixedAmount : percent,
    };
  }

  changeTypeManualDiscount = async (type) => {
    if (type == manualType.percentType) {
      await this.setState({
        manualTypeSelect: manualType.percentType,
      });
    } else {
      await this.setState({
        manualTypeSelect: manualType.fixAmountType,
      });
    }
    this.calculateDiscount(this.state.valueText);
  };

  calculateDiscount = async (textNumber) => {
    const { total } = this.props;

    let discount = textNumber;
    if (this.state.manualTypeSelect == manualType.percentType) {
      discount = roundNumber(
        (formatNumberFromCurrency(textNumber) *
          formatNumberFromCurrency(total)) /
          100
      );

      await this.setState({
        discount,
        percent: this.state.valueText,
        fixedAmount: 0,
      });

      this.props.onChangeText(discount, 0);
    } else {
      await this.setState({
        discount,
        fixedAmount: this.state.valueText,
        percent: 0,
      });

      this.props.onChangeText(0, discount);
    }
  };

  onChangeText = async (textNumber) => {
    await this.setState({ valueText: textNumber });
    this.calculateDiscount(textNumber);
  };

  render() {
    const { language } = this.props;
    const stylePercentText =
      this.state.manualTypeSelect == manualType.percentType
        ? styles.colorSelectedText
        : styles.colorUnselectedText;
    const stylePercentButton =
      this.state.manualTypeSelect == manualType.percentType
        ? styles.backgroundButtonSelected
        : styles.backgroundButtonUnSelected;

    const styleFixText =
      this.state.manualTypeSelect == manualType.fixAmountType
        ? styles.colorSelectedText
        : styles.colorUnselectedText;
    const styleFixButton =
      this.state.manualTypeSelect == manualType.fixAmountType
        ? styles.backgroundButtonSelected
        : styles.backgroundButtonUnSelected;
    return (
      <View>
        <View style={styles.viewRowContainer}>
          <View style={styles.viewGroupRow}>
            <TouchableHighlight
              style={[styles.discountTypeButton, stylePercentButton]}
              onPress={() =>
                this.changeTypeManualDiscount(manualType.percentType)
              }
              underlayColor="#fff"
            >
              <Text style={[styles.discountManualText, stylePercentText]}>
                {"%"}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.discountTypeButton, styleFixButton]}
              onPress={() =>
                this.changeTypeManualDiscount(manualType.fixAmountType)
              }
              underlayColor="#fff"
            >
              <Text style={[styles.discountManualText, styleFixText]}>
                {"$"}
              </Text>
            </TouchableHighlight>

            {/* ------- Text input ----- */}
            <View style={styles.textInputView}>
              <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }}>
                <TextInputMask
                  type={"money"}
                  options={{
                    precision: 2,
                    separator: ".",
                    delimiter: ",",
                    unit: "",
                    suffixUnit: "",
                  }}
                  style={{ flex: 1, fontSize: scaleSize(16) }}
                  value={`${this.state.valueText}`}
                  onChangeText={this.onChangeText}
                  keyboardType="numeric"
                  placeholderTextColor="#A9A9A9"
                  maxLength={6}
                />
              </View>
            </View>
            {/* -------  ----- */}
          </View>

          <View style={{ justifyContent: "center" }}>
            <Text style={{ color: "#4CD964", fontSize: scaleSize(18) }}>
              {`$ ${formatMoney(roundNumber(this.state.discount))}`}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewRowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  textNormal: {
    color: colors.BROWNISH_GREY,
    fontSize: scaleSize(16),
  },
  discountTypeButton: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.BROWNISH_GREY,
    justifyContent: "center",
    height: scaleSize(35),
    width: scaleSize(35),
  },
  discountManualText: {
    color: "#000",
    textAlign: "center",
    fontSize: scaleSize(16),
  },
  viewGroupRow: {
    flexDirection: "row",
  },
  textInputView: {
    width: scaleSize(120),
    height: scaleSize(35),
    borderColor: "#707070",
    borderWidth: 1,
    marginLeft: scaleSize(20),
    borderRadius: scaleSize(4),
    flexDirection: "row",
  },
  greenText: {
    color: "#4CD964",
    fontSize: scaleSize(18),
  },
  colorSelectedText: {
    color: "#fff",
  },
  colorUnselectedText: {
    color: "#000",
  },
  backgroundButtonSelected: {
    backgroundColor: colors.OCEAN_BLUE,
  },
  backgroundButtonUnSelected: {
    backgroundColor: "#fff",
  },
  slider: {
    flex: 1,
    marginTop: 10,
  },
});

const mapStateToProps = (state) => ({
  discount: state.marketing.discount,
  discountItems: state.marketing.discountItems,
  visibleModalDiscountItem: state.marketing.visibleModalDiscountItem,
  appointmentIdUpdatePromotion: state.marketing.appointmentIdUpdatePromotion,
  language: state.dataLocal.language,
  isGetPromotionOfAppointment: state.marketing.isGetPromotionOfAppointment,
  appointmentItem: state.marketing.appointmentItem,
  groupAppointment: state.appointment.groupAppointment,
});

export default connectRedux(mapStateToProps, PopupDiscountItem);
