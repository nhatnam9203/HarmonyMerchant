import React from "react";
import { View, Text, Image } from "react-native";

import ModalCustom from "./ModalCustom";
import ButtonCustom from "./ButtonCustom";
import { scaleSize, getTitleSendLinkGoogle } from "../utils";
import connectRedux from "@redux/ConnectRedux";
import ICON from "@resources";
import Button from "./Button";

class PopupPayCompleted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSendLink: false,
    };
  }

  switchSendLink = () => {
    this.setState((prevState) => ({ isSendLink: !prevState.isSendLink }));
  };

  handleSendGoogleLinkReview = async () => {
    const { profile, groupAppointment } = this.props;
    const { isSendLink } = this.state;
    if (isSendLink) {
      let customerIdList = new Set();
      const appointments = groupAppointment?.appointments || [];
      for (let i = 0; i < appointments.length; i++) {
        customerIdList.add(appointments[i]?.customerId);
      }
      const customerIdListNeedToSendLink = [...customerIdList];
      const merchantId = profile?.merchantId || 0;
      customerIdListNeedToSendLink.forEach((customerId) =>
        this.props.actions.customer.sendGoogleReviewLink(customerId, merchantId)
      );
      await this.setState({
        isSendLink: false,
      });
    }
  };

  printBill = () => {
    this.handleSendGoogleLinkReview();
    this.props.printBill();
  };

  donotPrintBill = () => {
    this.handleSendGoogleLinkReview();
    this.props.donotPrintBill();
  };

  render() {
    const { visiblePaymentCompleted, style, profile } = this.props;
    const { isSendLink } = this.state;

    const checkIcon = isSendLink ? ICON.checkBox : ICON.checkBoxEmpty;

    return (
      <ModalCustom
        transparent={true}
        visible={visiblePaymentCompleted}
        onRequestClose={() => {}}
        style={style}
      >
        <View
          style={{
            width: scaleSize(450),
            height: scaleSize(230),
            backgroundColor: "#fff",
            borderRadius: scaleSize(16),
          }}
        >
          <View style={{ flex: 1 }}>
            {/* ---------- header ------ */}
            <View
              style={{
                alignItems: "center",
                paddingTop: scaleSize(16),
                paddingBottom: scaleSize(12),
              }}
            >
              <Text
                style={{
                  color: "#0764B0",
                  fontSize: scaleSize(28),
                  fontWeight: "bold",
                }}
              >
                {`Transaction completed!`}
              </Text>
            </View>
            {/* ------------ content ----- */}
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#404040", fontSize: scaleSize(20) }}>
                {`Do you want to print receipt?`}
              </Text>
            </View>

            {/* ------------ Check box ----- */}
            {profile.sendReviewLinkOption === "manual" ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onPress={this.switchSendLink}
                  style={{ justifyContent: "center" }}
                >
                  <Image source={checkIcon} />
                </Button>
                <Text
                  style={{
                    color: "rgb(130,130,130)",
                    fontSize: scaleSize(18),
                    marginLeft: scaleSize(12),
                  }}
                >
                  {`Send Google Review Link`}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "rgb(130,130,130)",
                    fontSize: scaleSize(16),
                    marginLeft: scaleSize(12),
                  }}
                >
                  {`You Are Choosing ${getTitleSendLinkGoogle(
                    profile.sendReviewLinkOption
                  )} Send Google Review Link`}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              height: scaleSize(75),
              flexDirection: "row",
              paddingHorizontal: scaleSize(70),
              alignItems: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderTopColor: "rgb(212,211,211)",
            }}
          >
            <ButtonCustom
              width={scaleSize(100)}
              height={40}
              backgroundColor="#0764B0"
              // title={localize('Search', language)}
              title="Yes"
              textColor="#fff"
              onPress={this.printBill}
              style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
              styleText={{ fontSize: scaleSize(18), fontWeight: "normal" }}
            />

            <ButtonCustom
              width={scaleSize(100)}
              height={40}
              backgroundColor="#F1F1F1"
              title="No"
              textColor="#6A6A6A"
              onPress={this.donotPrintBill}
              style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
              styleText={{ fontSize: scaleSize(18), fontWeight: "normal" }}
            />
          </View>
        </View>
      </ModalCustom>
    );
  }
}

const mapStateToProps = (state) => ({
  visiblePaymentCompleted: state.appointment.visiblePaymentCompleted,
  profile: state.dataLocal.profile,
  groupAppointment: state.appointment.groupAppointment,
});

export default connectRedux(mapStateToProps, PopupPayCompleted);
