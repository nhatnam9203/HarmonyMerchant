import { Button } from "@components";
import connectRedux from "@redux/ConnectRedux";
import IMAGE from "@resources";
import {
  formatMoney,
  formatNumberFromCurrency,
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  localize,
  scaleSize,
} from "@utils";
import _ from "ramda";
import React from "react";
import { Image, LayoutAnimation, Text, View, StyleSheet } from "react-native";
import Swipeout from "react-native-swipeout";
import ItemBasket from "./ItemBasket";

class ItemAppointmentBasket extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
      isSelectGiftCard: false,
      animating: false,
      contentHeight: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  setStateFromParent = async (isCollapsed) => {
    if (this._isMounted) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await this.setState({
        isCollapsed,
      });
    }
  };

  toggleCollaps = () => {
    const { appointmentDetail } = this.props;
    const appointmentId =
      appointmentDetail && appointmentDetail.appointmentId
        ? appointmentDetail.appointmentId
        : -1;
    this.props.toggleCollaps(appointmentId);
  };

  selectCheckbox = () => {
    this.setState((prevState) => ({
      isSelectGiftCard: !prevState.isSelectGiftCard,
    }));
  };

  getTypesOfMoneyAppointment = (appointmentDetail) => {
    const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } =
      this.props;

    const tipAmount = appointmentDetail?.tipAmount || 0;
    const subTotal = appointmentDetail?.subTotal || 0;
    const discount = appointmentDetail?.discount || 0;
    const tax = appointmentDetail?.tax || 0;
    const total = appointmentDetail?.total || 0;
    const depositAmount = appointmentDetail?.depositAmount || 0;

    const temptSubTotal =
      !appointmentDetail || _.isEmpty(appointmentDetail)
        ? subTotalLocal
        : subTotal;
    const temptTotal =
      !appointmentDetail || _.isEmpty(appointmentDetail)
        ? Number(
            formatNumberFromCurrency(subTotalLocal) +
              formatNumberFromCurrency(tipLocal) +
              formatNumberFromCurrency(taxLocal) -
              formatNumberFromCurrency(discountTotalLocal)
          ).toFixed(2)
        : total;
    const temptDiscount =
      !appointmentDetail || _.isEmpty(appointmentDetail)
        ? discountTotalLocal
        : discount;
    const temptTip =
      !appointmentDetail || _.isEmpty(appointmentDetail) ? tipLocal : tipAmount;
    const temptTax =
      !appointmentDetail || _.isEmpty(appointmentDetail) ? taxLocal : tax;

    return {
      temptSubTotal,
      temptTotal,
      temptDiscount,
      temptTip,
      temptTax,
      depositAmount,
    };
  };

  showModalDiscount = () => {
    const { appointmentDetail, profileStaffLogin } = this.props;
    const appointmentId = appointmentDetail?.appointmentId || -1;

    if (profileStaffLogin?.roleName !== "Admin") {
      this.props.showModalCheckPermission(appointmentId, true);
    } else {
      this.props.actions.marketing.getPromotionByAppointment(
        appointmentId,
        true
      );
    }
  };

  showModalTipAppointment = (tip) => {
    const { groupAppointment, paymentDetailInfo } = this.props;
    const checkoutPayments = paymentDetailInfo?.checkoutPayments || [];
    if (checkoutPayments.length === 0) {
      const appointmentId = _.isEmpty(groupAppointment)
        ? -1
        : this.props.appointmentDetail.appointmentId;
      this.props.showModalTipAppointment(appointmentId, tip);
    }
  };

  getBasket = () => {
    const { appointmentDetail } = this.props;
    let basket = [];
    if (appointmentDetail) {
      const { services, products, extras, giftCards } = appointmentDetail;
      const arrayProducts = getArrayProductsFromAppointment(products);
      const arryaServices = getArrayServicesFromAppointment(services);
      const arrayExtras = getArrayExtrasFromAppointment(extras);
      const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);

      for (let i = 0; i < arryaServices.length; i++) {
        for (let j = 0; j < arrayExtras.length; j++) {
          if (
            arrayExtras[j]?.data?.bookingServiceId ===
            arryaServices[i]?.data?.bookingServiceId
          ) {
            arryaServices[i]?.extras.push({ ...arrayExtras[j] });
          }
        }
      }
      basket = arryaServices.concat(arrayProducts, arrayGiftCards);
    }

    return basket;
  };

  removeAppointment = (appointmentId) => {
    this.props.removeBlockAppointment(appointmentId);
  };

  // ---------- Render --------

  renderHeaderCustomerBaket() {
    const { appointmentDetail, infoUser, paymentDetailInfo, blockIndex } =
      this.props;
    let firstName = "";
    let lastName = "";

    lastName = appointmentDetail?.lastName || "";
    firstName = appointmentDetail?.firstName || "Anonymous";
    const isMain = appointmentDetail?.isMain || 0;
    const appointmentId = appointmentDetail?.appointmentId || -1;

    if (isMain === 1) {
      firstName = infoUser?.firstName || firstName;
      lastName = infoUser?.lastName || lastName;
    }

    const iconCollaps = this.state.isCollapsed
      ? IMAGE.open_customer_basket
      : IMAGE.close_customer_basket;
    const swipeoutBtns = [
      {
        backgroundColor: "#fff",
        component: (
          <Button
            onPress={this.removeAppointment.bind(this, appointmentId)}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={IMAGE.removeItemBasket}
              style={{ width: scaleSize(24), height: scaleSize(24) }}
            />
          </Button>
        ),
      },
    ];
    const temptColor = blockIndex === 0 ? "transparent" : "red";

    // ---- New -----
    const temptBackground = !this.state.isCollapsed
      ? { backgroundColor: "#0764B0" }
      : { backgroundColor: "#E5E5E5" };
    const temptTextColor = !this.state.isCollapsed
      ? { color: "#fff" }
      : { color: "#404040" };

    return (
      <Swipeout
        right={swipeoutBtns}
        buttonWidth={scaleSize(45)}
        disabled={blockIndex === 0 ? true : false}
        close={true}
      >
        <View
          style={[
            {
              height: scaleSize(35),
              paddingLeft: scaleSize(10),
              flexDirection: "row",
              alignItems: "center",
            },
            temptBackground,
          ]}
        >
          <Text
            style={[
              { fontSize: scaleSize(16), fontWeight: "bold" },
              temptTextColor,
            ]}
          >
            {`Client ${blockIndex + 1}`}
          </Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Button onPress={this.toggleCollaps}>
              <Image
                source={iconCollaps}
                style={{ width: scaleSize(22), height: scaleSize(22) }}
              />
            </Button>
          </View>
          <View
            style={{
              width: scaleSize(5),
              height: scaleSize(35),
              backgroundColor: temptColor,
              marginLeft: scaleSize(8),
            }}
          />
        </View>
        <View
          style={{ height: 2, borderBottomColor: "#fff", borderBottomWidth: 2 }}
        />
      </Swipeout>
    );
  }

  render() {
    const { language, appointmentDetail, removeItemBasket, paymentDetailInfo } =
      this.props;
    const appointmentId = appointmentDetail?.appointmentId || -1;
    const {
      temptSubTotal,
      temptTotal,
      temptDiscount,
      temptTip,
      temptTax,
      depositAmount,
    } = this.getTypesOfMoneyAppointment(appointmentDetail);
    const checkoutPayments = paymentDetailInfo?.checkoutPayments || [];

    return (
      <>
        {this.renderHeaderCustomerBaket()}
        {this.state.isCollapsed ? (
          <View />
        ) : (
          <View>
            {/* ----------- Item Product , Service , Extra --------- */}
            {this.getBasket().map((item, index) => (
              <ItemBasket
                disabled={checkoutPayments.length === 0 ? false : true}
                key={index}
                item={item}
                removeItemBasket={(item) =>
                  removeItemBasket(item, appointmentId, true)
                }
                onPress={(service) => {}}
                changeProduct={(product) => {}}
                removeExtra={(extra) =>
                  removeItemBasket(extra, appointmentId, true)
                }
              />
            ))}
            {/* ----------- Payment Number --------- */}
            {this.getBasket().length > 0 ? (
              <View style={{ flexDirection: "row", marginTop: scaleSize(10) }}>
                <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }}>
                  {/* ---------- Price ------ */}
                  <View style={styles.payNumberTextContainer}>
                    <Text style={styles.textPay}>
                      {`${localize("Subtotal", language)}:`}
                    </Text>
                    <Text style={[styles.textPay, { color: "rgb(65,184,85)" }]}>
                      {`$ ${formatMoney(temptSubTotal)}`}
                    </Text>
                  </View>
                  {/* ---------- Discount ------ */}
                  <View style={styles.payNumberTextContainer}>
                    <Button
                      style={{ flexDirection: "row" }}
                      onPress={this.showModalDiscount}
                    >
                      <Text style={styles.textPay}>
                        {`${localize("Discount", language)}:  `}
                      </Text>
                      {checkoutPayments.length === 0 ? (
                        <Image
                          source={IMAGE.add_discount_checkout}
                          style={{
                            width: scaleSize(20),
                            height: scaleSize(20),
                          }}
                        />
                      ) : null}
                    </Button>
                    <Text style={[styles.textPay, { color: "rgb(65,184,85)" }]}>
                      {`$ ${formatMoney(temptDiscount)}`}
                    </Text>
                  </View>

                  {/* ---------- Tip ------ */}
                  <View style={styles.payNumberTextContainer}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.textPay}>
                        {`${localize("Tip", language)}:  `}
                      </Text>
                    </View>
                    <Text style={[styles.textPay, { color: "rgb(65,184,85)" }]}>
                      {`$ ${formatMoney(temptTip)}`}
                    </Text>
                  </View>

                  {/* ---------- Tax ------ */}
                  <View style={styles.payNumberTextContainer}>
                    <Text style={styles.textPay}>
                      {`${localize("Tax", language)}:`}
                    </Text>
                    <Text style={[styles.textPay, { color: "rgb(65,184,85)" }]}>
                      {`$ ${formatMoney(temptTax)}`}
                    </Text>
                  </View>
                  {depositAmount > 0 && (
                    <View style={styles.payNumberTextContainer}>
                      <Text style={styles.textPay}>
                        {`${localize("Deposited", language)}:`}
                      </Text>
                      <Text
                        style={[
                          styles.textPay,
                          { color: colors.VERY_LIGHT_PINK },
                        ]}
                      >
                        {`$ ${formatMoney(depositAmount)}`}
                      </Text>
                    </View>
                  )}
                  {/* ---------- Line ------ */}
                  <View
                    style={{
                      height: 2,
                      backgroundColor: "#DDDDDD",
                      marginTop: scaleSize(2),
                      marginBottom: scaleSize(6),
                    }}
                  />
                  {/* ---------- Total ------ */}
                  <View style={styles.payNumberTextContainer}>
                    <Text style={[styles.textPay, { fontSize: scaleSize(18) }]}>
                      {`${localize("Total", language)}:`}
                    </Text>
                    <Text
                      style={[
                        styles.textPay,
                        {
                          color: "rgb(65,184,85)",
                          fontSize: scaleSize(18),
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {`$ ${formatMoney(`${temptTotal}`)}`}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View />
            )}
          </View>
        )}
      </>
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}

const mapStateToProps = (state) => ({
  groupAppointment: state.appointment.groupAppointment,
  paymentDetailInfo: state.appointment.paymentDetailInfo,
  blockAppointments: state.appointment.blockAppointments,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
});

export default connectRedux(mapStateToProps, ItemAppointmentBasket);

const styles = StyleSheet.create({
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
