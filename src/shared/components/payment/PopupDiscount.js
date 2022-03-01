import { ButtonCustom, PopupParent } from "@components";
import connectRedux from "@redux/ConnectRedux";
import { colors } from "@shared/themes";
import {
  checkIsTablet,
  formatMoney,
  formatNumberFromCurrency,
  localize,
  roundNumber,
  scaleSize,
} from "@utils";
import * as l from "lodash";
import _ from "ramda";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";

const manualType = {
  fixAmountType: "fixAmountType",
  percentType: "percentType",
};

const DiscountOptions = [
  { id: 5, value: 5, label: "5%" },
  { id: 10, value: 10, label: "10%" },
  { id: 15, value: 15, label: "15%" },
  { id: 20, value: 20, label: "20%" },
  { id: 25, value: 25, label: "25%" },
  { id: 30, value: 30, label: "30%" },
  { id: 50, value: 50, label: "50%" },
  { id: 100, value: 100, label: "100%" },
];

class PopupDiscount extends React.Component {
  constructor(props) {
    super(props);
    const { groupAppointment, appointmentIdUpdatePromotion } = this.props;
    const appointmentDetail =
      appointmentIdUpdatePromotion !== -1 &&
      !_.isEmpty(groupAppointment) &&
      groupAppointment.appointments
        ? groupAppointment.appointments.find(
            (appointment) =>
              appointment.appointmentId === appointmentIdUpdatePromotion
          )
        : { subTotal: 0 };

    this.state = {
      discountTotal: 0,
      totalLocal: 0,
      temptTotalLocal: 0,
      moneyDiscountCustom: 0,
      moneyDiscountFixedAmout: 0,

      customDiscountPercentLocal: 0,
      customDiscountFixedLocal: 0,
      promotionNotes: "",
      discountByOwner:
        appointmentDetail && appointmentDetail.discountByOwner
          ? parseFloat(appointmentDetail.discountByOwner)
          : 100,
    };
    this.customDiscountRef = React.createRef();
    this.scrollRef = React.createRef();
  }

  setStateFromParent = async (
    totalLocal,
    discountTotal,
    customDiscountPercent,
    customDiscountFixedLocal
  ) => {
    await this.setState({
      totalLocal,
      discountTotal: discountTotal,
      temptTotalLocal: discountTotal,
      customDiscountPercentLocal: customDiscountPercent,
      customDiscountFixedLocal,
    });
  };

  // handelSliderValue = async (value) => {
  //   this.setState({ discountByOwner: value });
  // };

  submitCustomPromotion = () => {
    const { groupAppointment, appointmentIdUpdatePromotion, discount } =
      this.props;
    const customDiscountPercent = this.customDiscountRef.current.state.percent;
    const customFixedAmount = this.customDiscountRef.current.state.fixedAmount;

    if (!_.isEmpty(groupAppointment)) {
      const appointmentDetail =
        appointmentIdUpdatePromotion !== -1 &&
        !_.isEmpty(groupAppointment) &&
        groupAppointment.appointments
          ? groupAppointment.appointments.find(
              (appointment) =>
                appointment.appointmentId === appointmentIdUpdatePromotion
            )
          : { subTotal: 0 };
      const subTotal = appointmentDetail?.subTotal || 0;

      // Tính discount cho product item
      let productItemDiscount = 0;
      if (appointmentDetail?.products?.length > 0) {
        productItemDiscount = appointmentDetail?.products?.reduce(
          (sum, prod) => {
            const { discountPercent = 0, discount = 0, price, quantity } = prod;

            const discountTemp =
              discountPercent > 0
                ? (discountPercent * quantity * price) / 100
                : discount;
            return sum + discountTemp;
          },
          0
        );
      }

      let totalDiscount = 0;

      let manualDiscount = formatNumberFromCurrency(manualDiscount) +
                          formatNumberFromCurrency(customFixedAmount);

      //calculate discount percent after apply discount items (-productItemDiscount)
      const moneyDiscountCustom =
        (formatNumberFromCurrency(customDiscountPercent) *
          (formatNumberFromCurrency(subTotal) - productItemDiscount)) /
        100;
      manualDiscount =
        formatNumberFromCurrency(manualDiscount) +
        formatNumberFromCurrency(moneyDiscountCustom);

      //just apply discount for manual or promotion, not both
      if (manualDiscount > 0) {
        totalDiscount = manualDiscount;
      } else {
        for (let i = 0; i < discount.length; i++) {
          totalDiscount =
            formatNumberFromCurrency(totalDiscount) +
            formatNumberFromCurrency(discount[i].discount);
        }
      }

      if (
        formatNumberFromCurrency(totalDiscount) +
          formatNumberFromCurrency(productItemDiscount) >
        formatNumberFromCurrency(subTotal)
      ) {
        Alert.alert(
          `Warning`,
          `Discount cannot be more than the subtotal.`,
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      } else {
        const { promotionNotes, discountByOwner } = this.state;
        this.props.actions.marketing.customPromotion(
          customDiscountPercent,
          customFixedAmount,
          discountByOwner,
          appointmentIdUpdatePromotion,
          true,
          false,
          true
        );
        this.props.actions.marketing.addPromotionNote(
          appointmentDetail.appointmentId,
          promotionNotes
        );
        this.props.actions.marketing.closeModalDiscount();
        this.resetState();
      }
    }
  };

  onRequestClose = async () => {
    this.props.actions.marketing.closeModalDiscount();
    this.resetState();
  };

  async resetState() {
    await this.setState({
      totalLocal: 0,
      temptTotalLocal: 0,
      customDiscountPercentLocal: 0,
      customDiscountFixedLocal: 0,
      moneyDiscountCustom: 0,
      moneyDiscountFixedAmout: 0,
    });
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
    try {
      const {
        title,
        discount,
        visibleModalDiscount,
        appointmentIdUpdatePromotion,
        groupAppointment,
        language,
        discountItems,
      } = this.props;
      const appointmentDetail =
        appointmentIdUpdatePromotion !== -1 &&
        !_.isEmpty(groupAppointment) &&
        groupAppointment.appointments
          ? groupAppointment.appointments.find(
              (appointment) =>
                appointment.appointmentId === appointmentIdUpdatePromotion
            )
          : { subTotal: 0 };
      const { customDiscountPercent, customDiscountFixed } =
        appointmentDetail !== undefined &&
        appointmentDetail &&
        !_.isEmpty(appointmentDetail)
          ? appointmentDetail
          : { customDiscountPercent: 0, customDiscountFixed: 0 };
      const {
        customDiscountPercentLocal,
        customDiscountFixedLocal,
        promotionNotes,
      } = this.state;
      const visible =
        visibleModalDiscount && !_.isEmpty(groupAppointment) ? true : false;

      let total = 0;
      let discountItemsTotal = 0;

      if (discountItems) {
        for (let i = 0; i < discountItems.length; i++) {
          const itemTemp = discountItems[i];
          const findItem = l.find(
            l.get(appointmentDetail, "products", []),
            (itemFind) => {
              return (
                l.get(itemFind, "bookingProductId") ==
                l.get(itemTemp, "bookingProductId")
              );
            }
          );
          const discountAmount =
          formatNumberFromCurrency(l.get(itemTemp, "discount")) > 0
              ? formatNumberFromCurrency(l.get(itemTemp, "discount"))
              : formatNumberFromCurrency(l.get(itemTemp, "discountPercent"))
                  * formatNumberFromCurrency(l.get(findItem, "price")) 
                  * l.get(findItem, "quantity")
                    / 100
          discountItemsTotal = discountItemsTotal + discountAmount;
          total = discountItemsTotal;
        }
      }

      if (
        visible &&
        this.customDiscountRef.current &&
        formatNumberFromCurrency(this.customDiscountRef.current?.state.discount) > 0
      ) {
        total =
          formatNumberFromCurrency(total) +
          formatNumberFromCurrency(
            this.customDiscountRef.current?.state.discount
          );
      } else {
        for (let i = 0; i < discount.length; i++) {
          total =
            formatNumberFromCurrency(total) +
            formatNumberFromCurrency(discount[i].discount);
        }
      }

      total = roundNumber(total);

      const temptCustomDiscountPercent = _.isEmpty(appointmentDetail)
        ? customDiscountPercentLocal
        : customDiscountPercent;
      const temptCustomDiscountFixed = _.isEmpty(appointmentDetail)
        ? customDiscountFixedLocal
        : customDiscountFixed;

      const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(400);

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
              <ScrollView
                ref={this.scrollRef}
                keyboardShouldPersistTaps="always"
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={{ paddingHorizontal: scaleSize(25) }}
                >
                  {discount && discount.length > 0 && (
                    <View style={[styles.viewRowContainer, { marginTop: 20 }]}>
                      <Text style={styles.textNormal}>
                        {localize("Discount Campaigns:", language)}
                      </Text>
                      <Text style={styles.textNormal}>
                        {localize("Apply Value", language)}
                      </Text>
                    </View>
                  )}

                  {discount.map((promo, index) => (
                    <ItemCampaign
                      key={index}
                      title={promo?.merchantPromotion?.name}
                      discount={promo?.discount}
                    />
                  ))}

                  {discountItems && discountItems.length > 0 && (
                    <Text style={styles.textNormal}>
                      {localize("Discount Items:", language)}
                    </Text>
                  )}

                  {discountItems.map((itemTemp, index) => {
                    const findItem = l.find(
                      l.get(appointmentDetail, "products", []),
                      (itemFind) => {
                        return (
                          l.get(itemFind, "bookingProductId") ==
                          l.get(itemTemp, "bookingProductId")
                        );
                      }
                    );
                    const discountAmount =
                    formatNumberFromCurrency(l.get(itemTemp, "discount")) > 0
                        ? 
                          l.get(itemTemp, "discount")
                        : 
                          formatMoney((formatNumberFromCurrency(
                            l.get(itemTemp, "discountPercent")
                          ) *
                            formatNumberFromCurrency(
                              l.get(findItem, "price")) *
                                l.get(findItem, "quantity"
                            )) / 100)
                        
                    return (
                      <ItemCampaign
                        key={index}
                        title={l.get(itemTemp, "productName", "")}
                        discount={discountAmount}
                      />
                    );
                  })}
                  <View style={{ height: scaleSize(10) }} />
                  {/* ----------- Row 1 ----------- */}
                  <CustomDiscount
                    ref={this.customDiscountRef}
                    customDiscountPercent={temptCustomDiscountPercent}
                    customDiscountFixed={temptCustomDiscountFixed}
                    total={
                      (formatNumberFromCurrency(
                        appointmentDetail?.subTotal) - discountItemsTotal
                      ) || 0
                    }
                    onChangeText={(
                      moneyDiscountByPercent,
                      moneyDiscountFixed
                    ) =>
                      this.onChangeTextCustomDiscount(
                        moneyDiscountByPercent,
                        moneyDiscountFixed
                      )
                    }
                    language={language}
                  />

                  {/* ----------- Note  ----------- */}
                  <View style={{ marginTop: 20 }}>
                    <Text style={[styles.textNormal, { marginBottom: 5 }]}>
                      {`Note`}
                    </Text>
                    <View
                      style={{
                        height: scaleSize(40),
                        borderColor: "#DDDDDD",
                        borderWidth: 2,
                        borderRadius: 4,
                        paddingVertical: 5,
                        paddingHorizontal: scaleSize(10),
                      }}
                    >
                      <TextInput
                        style={[
                          { flex: 1, padding: 0, textAlignVertical: "top" },
                          styles.textNormal,
                        ]}
                        multiline={true}
                        value={promotionNotes}
                        onChangeText={(promotionNotes) =>
                          this.setState({ promotionNotes })
                        }
                        onFocus={() => this.scrollRef.current?.scrollToEnd()}
                        onBlur={() => this.scrollTo(0)}
                      />
                    </View>
                  </View>

                  <View style={{ height: scaleSize(130) }} />
                </TouchableOpacity>
              </ScrollView>
            </View>
            {/* ---------- Total ------- */}
            <View
              style={{
                flexDirection: "row",
                height: scaleSize(40),
                paddingHorizontal: scaleSize(25),
              }}
            >
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(18),
                    fontWeight: "bold",
                  }}
                >
                  {localize("Total Discount", language)}
                </Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text style={[styles.greenText, { fontWeight: "bold" }]}>
                  {`$ -${formatMoney(total)}`}
                </Text>
              </View>
            </View>

            {/* ----------- Button Add ---- */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: scaleSize(12),
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
    } catch (error) {}
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      visibleModalDiscount,
      groupAppointment,
      isGetPromotionOfAppointment,
      promotionNotes,
      discountByOwner,
      appointmentIdUpdatePromotion,
    } = this.props;
    const visible =
      visibleModalDiscount && !_.isEmpty(groupAppointment) ? true : false;
    if (
      prevProps.isGetPromotionOfAppointment !== isGetPromotionOfAppointment &&
      isGetPromotionOfAppointment === "success" &&
      visible
    ) {
      this.props.actions.marketing.resetStateGetPromotionOfAppointment();
 
      const appointmentDetail =
        appointmentIdUpdatePromotion !== -1 &&
        !_.isEmpty(groupAppointment) &&
        groupAppointment.appointments
          ? groupAppointment.appointments.find(
              (appointment) =>
                appointment.appointmentId === appointmentIdUpdatePromotion
            )
          : { subTotal: 0 };
      const { customDiscountPercent, customDiscountFixed, subTotal } =
        appointmentDetail !== undefined &&
        appointmentDetail &&
        !_.isEmpty(appointmentDetail)
          ? appointmentDetail
          : { customDiscountPercent: 0, customDiscountFixed: 0 };
      const customMoneyByPercent =
        (formatNumberFromCurrency(customDiscountPercent) *
          formatNumberFromCurrency(subTotal)) /
        100;

      await this.setState({
        promotionNotes: promotionNotes.note ? promotionNotes.note : "",
        discountByOwner: discountByOwner ? parseFloat(discountByOwner) : 100,
        moneyDiscountCustom: customMoneyByPercent,
        moneyDiscountFixedAmout: customDiscountFixed,
      });
    }
  }
}

const ItemCampaign = ({ title, discount }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: scaleSize(35),
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ color: "#404040", fontSize: scaleSize(16) }}>
          {title}
        </Text>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={{ color: "#4CD964", fontSize: scaleSize(18) }}>
          {`$ ${discount}`}
        </Text>
      </View>
    </View>
  );
};

class CustomDiscount extends React.Component {
  constructor(props) {
    super(props);
    const { total, customDiscountPercent, customDiscountFixed } = this.props;
    const percent = customDiscountPercent ? customDiscountPercent : 0;
    const fixedAmount = customDiscountFixed ? customDiscountFixed : 0;
    const type =
      customDiscountFixed && formatNumberFromCurrency(customDiscountFixed) > 0
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
      let valueText = this.state.valueText
      if(formatNumberFromCurrency(this.state.valueText) > 100) {
        valueText = "0.00"
      }
      await this.setState({
        manualTypeSelect: manualType.percentType,
        valueText,
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
      discount = (formatNumberFromCurrency(textNumber) *
          formatNumberFromCurrency(total)) /
          100;

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
    let newTextNumber = textNumber
    if (this.state.manualTypeSelect == manualType.percentType && formatNumberFromCurrency(textNumber) > 100) {
        newTextNumber = this.state.valueText
    }
    await this.setState({ valueText: newTextNumber });
    this.calculateDiscount(newTextNumber);
  };

  handlePercentDiscount = async (value) => {
    await this.setState({
      manualTypeSelect: manualType.percentType,
    });
    this.onChangeText(value.toFixed(2));
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.textNormal}>
            {localize("Manual Discount", language)}
          </Text>
          <Text style={styles.discountNote}>
            {localize("ManualDiscountNote", language)}
          </Text>
        </View>

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
                />
              </View>
            </View>
            {/* -------  ----- */}
          </View>



          <View style={{ justifyContent: "center" }}>
            <Text style={{ color: "#4CD964", fontSize: scaleSize(18) }}>
              {`$ ${formatMoney(this.state.discount)}`}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: scaleSize(20),
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          {DiscountOptions?.map((discountItem) => {
            const onChangeDiscountValue = () => {
              this.handlePercentDiscount(discountItem.value);
            };

            const selected = discountItem.value === this.state.discountByOwner;
            return (
              <TouchableOpacity
                key={discountItem.id + ""}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: scaleWidth(60),
                  height: scaleHeight(40),
                  borderWidth: 1,
                  borderColor: selected ? "#fff" : "#0764B0",
                  backgroundColor: selected ? "#0764B0" : "#fff",
                  borderRadius: scaleSize(3),
                }}
                onPress={onChangeDiscountValue}
              >
                <Text
                  style={{
                    color: selected ? "#fff" : "#0764B0",
                    fontSize: scaleSize(15),
                    fontWeight: "400",
                  }}
                >
                  {discountItem.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    marginTop: 10,
  },
  textNormal: {
    color: colors.BROWNISH_GREY,
    fontSize: scaleSize(16),
  },
  discountNote: {
    color: "red",
    fontSize: scaleSize(13),
    marginLeft: scaleSize(5),
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
  visibleModalDiscount: state.marketing.visibleModalDiscount,
  appointmentDetail: state.appointment.appointmentDetail,
  groupAppointment: state.appointment.groupAppointment,
  appointmentIdUpdatePromotion: state.marketing.appointmentIdUpdatePromotion,
  language: state.dataLocal.language,
  isGetPromotionOfAppointment: state.marketing.isGetPromotionOfAppointment,
  promotionNotes: state.marketing.promotionNotes,
  discountByOwner: state.marketing.discountByOwner,
});

export default connectRedux(mapStateToProps, PopupDiscount);
