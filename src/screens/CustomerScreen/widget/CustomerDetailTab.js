import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { Button, Text, Dropdown } from "@components";
import {
  scaleSize,
  formatWithMoment,
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
  getColorStatus,
  getNameStateById,
} from "@utils";
import Configs from "@configs";
import ICON from "@resources";
import connectRedux from "@redux/ConnectRedux";
import PopupAppointmentDetail from "./PopupAppointmentDetail";

class CustomerDetailTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {
        customerId: "",
        firstName: "",
        lastName: "",
        phone: "",
        referrerBy: "",
        referrerPhone: "",
        email: "",
        isVip: 0,
        birthdate: "",
        gender: "",
        note: "",
        addressPost: {
          street: "",
          state: 0,
          city: "",
          zip: "",
        },
      },
      visible: false,
      totalRewardStart: 0,
    };
    this.onEndReachedCalledDuringMomentum = true;
    this.popupAppointmentDetailRef = React.createRef();
  }

  setStateFromParent = async (customer) => {
    await this.setState({
      customer,
    });
  };

  showAppointmentDetail = (appointment) => {
    this.popupAppointmentDetailRef.current?.setStateFromParent(appointment);
    this.setState({
      visible: true,
    });
  };

  closePopup = () => {
    this.setState({
      visible: false,
    });
  };

  loadMorePastAppointments = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { totalPastAppointmentPages, currentPastAppointmentPage } =
        this.props;
      if (currentPastAppointmentPage < totalPastAppointmentPages) {
        this.props.actions.customer.getPastAppointments(
          this.state?.customer?.customerId || 0,
          currentPastAppointmentPage + 1,
          true,
          false
        );
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  editCustomer = () => {
    this.props.editCustomer(this.state.customer);
  };

  deleteCustomer = () => {
    this.props.deleteCustomer(this.state.customer);
  };

  //   optionEditCustomer = () => {
  //     this.props.optionEditCustomer(this.state.customer);
  //   };

  renderHeaderFlatlist() {
    const { customerHistory, pastAppointments } = this.props;
    const upcomings = customerHistory?.upcomings || [];

    return (
      <View style={{ marginTop: scaleSize(15) }}>
        <View style={{ minHeight: scaleSize(130 - 35) }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.booking_txt}>
                {`${customerHistory?.allBooking || 0}`}
              </Text>
              <View style={{ height: scaleSize(10) }} />
              <Text style={{ color: "#404040", fontSize: scaleSize(14) }}>
                {`All bookings`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.booking_txt}>
                {`${customerHistory?.upcoming || 0}`}
              </Text>
              <View style={{ height: scaleSize(10) }} />
              <Text style={{ color: "#404040", fontSize: scaleSize(14) }}>
                {`Upcoming`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.booking_txt}>
                {`${customerHistory?.completed || 0}`}
              </Text>
              <View style={{ height: scaleSize(10) }} />
              <Text style={{ color: "#404040", fontSize: scaleSize(14) }}>
                {`Completed`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.booking_txt}>
                {`${customerHistory?.cancelled || 0}`}
              </Text>
              <View style={{ height: scaleSize(10) }} />
              <Text style={{ color: "#404040", fontSize: scaleSize(14) }}>
                {`Cancelled`}
              </Text>
            </View>
          </View>

          {upcomings.length > 0 ? (
            <View
              style={{
                height: scaleSize(40),
                paddingLeft: scaleSize(14),
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(14),
                  fontWeight: "600",
                }}
              >
                {`Upcoming`}
              </Text>
            </View>
          ) : (
            <View />
          )}
        </View>
        {/* --------------- Line ----------- */}
        <View style={{ height: scaleSize(1), backgroundColor: "#EEEEEE" }} />

        {/* -------------- Appointment Item ------------ */}
        {upcomings.map((appointment) => (
          <AppointmentItem
            key={appointment?.appointmentId}
            appointment={appointment}
            showAppointmentDetail={() =>
              this.showAppointmentDetail(appointment)
            }
          />
        ))}

        {pastAppointments.length > 0 ? (
          <>
            <View
              style={{
                height: scaleSize(40),
                paddingLeft: scaleSize(14),
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(14),
                  fontWeight: "600",
                }}
              >
                {`Past`}
              </Text>
            </View>
            {/* --------------- Line ----------- */}
            <View
              style={{ height: scaleSize(1), backgroundColor: "#EEEEEE" }}
            />
          </>
        ) : (
          <View />
        )}
      </View>
    );
  }

  render() {
    const {
      pastAppointments,
      customerHistory,
      isLoadMorePastAppointment,
      stateCity,
    } = this.props;
    const { customer, visible } = this.state;
    const firstLetter = customer?.firstName ? customer?.firstName[0] : "";
    const upcomings = customerHistory?.upcomings || [];

    return (
      <View style={{ flex: 1, padding: scaleSize(10) }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          {/* --------------- Left Content ----------- */}
          <View style={{ flex: 1, ...styles.SHADOW }}>
            {/* ------------- Customer Avatar ---------- */}
            <View
              style={{
                height: scaleSize(90),
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  width: scaleSize(80),
                  height: scaleSize(80),
                  borderRadius: scaleSize(40),
                  overflow: "hidden",
                  backgroundColor: "#E5E5E5",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#404040",
                    fontSize: scaleSize(40),
                    fontWeight: "bold",
                  }}
                >
                  {`${firstLetter}`}
                </Text>
              </View>
            </View>

            {/* ------------- Customer Name ---------- */}
            <Text
              style={{
                color: "#404040",
                fontSize: scaleSize(14),
                fontWeight: "600",
                textAlign: "center",
                marginVertical: scaleSize(8),
              }}
            >
              {`${customer?.firstName || ""} ${customer?.lastName || ""}`}
            </Text>

            {/* ------------- Customer VIP or Normal Status  ---------- */}
            {customer?.isVip ? (
              <View
                style={{
                  height: scaleSize(28),
                  alignItems: "center",
                  marginBottom: scaleSize(10),
                }}
              >
                <View
                  style={{
                    height: scaleSize(28),
                    width: scaleSize(80),
                    backgroundColor: "rgb(76,217,100)",
                    borderRadius: scaleSize(30),
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={ICON.vip_icon}
                    style={{ width: scaleSize(18), height: scaleSize(18) }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: scaleSize(12),
                      marginLeft: scaleSize(4),
                    }}
                  >
                    {`VIP`}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  height: scaleSize(28),
                  alignItems: "center",
                  marginBottom: scaleSize(10),
                }}
              >
                <View
                  style={{
                    height: scaleSize(28),
                    width: scaleSize(80),
                    backgroundColor: "#0764B0",
                    borderRadius: scaleSize(30),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: scaleSize(12) }}>
                    {`Normal`}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                height: scaleSize(30),
                alignItems: "center",
                marginBottom: scaleSize(10),
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Image source={ICON.star} />
              <Text
                style={{
                  marginLeft: 5,
                  color: "#404040",
                  fontSize: scaleSize(18),
                }}
              >
                {customer?.totalRewardStart ?? 0}
              </Text>
            </View>

            <View style={{ flex: 1, paddingHorizontal: scaleSize(12) }}>
              {/* ------------- Customer Note  ---------- */}
              <View
                style={{
                  flexDirection: "row",
                  paddingRight: scaleSize(10),
                  alignItems: "center",
                  maxHeight: scaleSize(70),
                }}
              >
                <View style={{ width: scaleSize(26) }}>
                  <Image source={ICON.note_customer} />
                </View>
                <View style={{ flex: 1 }}>
                  <ScrollView>
                    <Text style={{ color: "#A9A9A9", fontSize: scaleSize(12) }}>
                      {`${customer?.note || ""}`}
                    </Text>
                  </ScrollView>
                </View>
              </View>

              {/* ------------- Line  ---------- */}
              <View
                style={{
                  height: scaleSize(1),
                  backgroundColor: "#EEEEEE",
                  marginVertical: scaleSize(14),
                }}
              />

              {customer?.phone ? (
                <ItemCustomerInfo
                  icon={ICON.customer_phone}
                  title={`${customer?.phone || ""}`}
                />
              ) : null}

              {customer?.email ? (
                <ItemCustomerInfo
                  icon={ICON.customer_email}
                  title={`${customer?.email || ""}`}
                />
              ) : null}

              {customer?.gender && customer?.gender != "undefined" ? (
                <ItemCustomerInfo
                  icon={ICON.customer_gender}
                  title={`${customer?.gender || ""}`}
                />
              ) : null}

              {customer?.birthdate ? (
                <ItemCustomerInfo
                  icon={ICON.customer_birthday}
                  title={`${formatWithMoment(
                    customer?.birthdate,
                    "MM/DD/YYYY"
                  )}`}
                />
              ) : null}

              {customer?.addressPost?.street &&
              customer?.addressPost?.city &&
              customer?.addressPost?.state ? (
                <ItemCustomerInfo
                  icon={ICON.customer_location}
                  title={`${customer?.addressPost?.street} ${
                    customer?.addressPost?.city
                  } ${getNameStateById(
                    stateCity,
                    customer?.addressPost?.state
                  )}`}
                />
              ) : null}

              {customer?.referrerBy && customer?.referrerPhone ? (
                <ItemCustomerInfo
                  icon={ICON.customer_ref_phone}
                  title={`${customer?.referrerBy || ""} ${
                    customer?.referrerPhone || ""
                  }`}
                />
              ) : null}
            </View>

            <View
              style={{
                position: "absolute",
                top: scaleSize(0),
                right: scaleSize(14),
              }}
            >
              <Dropdown
                data={[
                  { label: "Edit", value: "Edit" },
                  { label: "Delete", value: "Delete" },
                ]}
                onChangeText={(text) => {
                  if (text === "Delete") {
                    this.deleteCustomer();
                  } else {
                    this.editCustomer();
                  }
                }}
                textColor="#666"
                selectedItemColor="#666"
                itemColor="#666"
                // value={"Delete"}
                pickerStyle={{ width: 90, padding: 4 }}
                propsExtractor={({ props }, index) =>
                  Object.assign({}, props, {
                    style: {
                      selectedItemColor: index === 1 ? "red" : "blue",
                    },
                  })
                }
                renderBase={() => (
                  <View>
                    {/* <Image source={ICON.edit_customer_icon} style={{ width: scaleSize(20), height: scaleSize(20) }} /> */}
                    <Text
                      style={{
                        fontSize: scaleSize(25),
                        fontWeight: "600",
                        color: "#404040",
                      }}
                    >
                      ...
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>

          {/* --------------- Line ----------- */}
          <View style={{ width: scaleSize(12) }} />

          {/* --------------- Right Content ----------- */}
          <View style={{ flex: 1.6 }}>
            {/* --------------- Top Right Content ----------- */}
            <View style={{ height: scaleSize(130), ...styles.SHADOW }}>
              <View
                style={{
                  height: scaleSize(40),
                  paddingLeft: scaleSize(14),
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#0764B0",
                    fontSize: scaleSize(14),
                    fontWeight: "600",
                  }}
                >
                  {`Sales`}
                </Text>
              </View>

              {/* --------------- Line ----------- */}
              <View
                style={{ height: scaleSize(1), backgroundColor: "#EEEEEE" }}
              />

              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    paddingLeft: scaleSize(14),
                    paddingVertical: scaleSize(5),
                    justifyContent: "space-around",
                  }}
                >
                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(20),
                      fontWeight: "bold",
                    }}
                  >
                    {`$  ${customerHistory?.totalSales || "0.00"}`}
                  </Text>
                  <Text style={{ color: "#404040", fontSize: scaleSize(13) }}>
                    {`Total sales`}
                  </Text>
                </View>
                {/* --------------- Line ----------- */}
                <View
                  style={{ width: scaleSize(1), backgroundColor: "#EEEEEE" }}
                />
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: scaleSize(14),
                    paddingVertical: scaleSize(5),
                    justifyContent: "space-around",
                  }}
                >
                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(20),
                      fontWeight: "bold",
                    }}
                  >
                    {`$  ${customerHistory?.lastVisitSale || "0.00"}`}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#404040", fontSize: scaleSize(13) }}>
                      {`Last visit sales`}
                    </Text>

                    <Text
                      style={{
                        color: "#404040",
                        fontSize: scaleSize(13),
                        fontWeight: "300",
                      }}
                    >
                      {`${formatWithMoment(
                        customerHistory?.lastVisitDate,
                        "MM/DD/YYYY"
                      )}`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* --------------- Line ----------- */}
            <View style={{ height: scaleSize(12) }} />
            {/* --------------- Bottom Right Content ----------- */}
            <View style={{ flex: 1, ...styles.SHADOW }}>
              <View
                style={{
                  height: scaleSize(40),
                  paddingLeft: scaleSize(14),
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#0764B0",
                    fontSize: scaleSize(14),
                    fontWeight: "600",
                  }}
                >
                  {`Appointments`}
                </Text>
              </View>

              {/* --------------- Line ----------- */}
              <View
                style={{ height: scaleSize(1), backgroundColor: "#EEEEEE" }}
              />

              {/* --------------- Past Appointments ----------- */}
              <View style={{ flex: 1 }}>
                <FlatList
                  data={pastAppointments}
                  renderItem={({ item, index }) => (
                    <AppointmentItem
                      appointment={item}
                      isPastAppointment={true}
                      showAppointmentDetail={() =>
                        this.showAppointmentDetail(item)
                      }
                    />
                  )}
                  ListHeaderComponent={() => this.renderHeaderFlatlist()}
                  keyExtractor={(item, index) =>
                    `${item?.appointmentId}_${index}`
                  }
                  onEndReached={this.loadMorePastAppointments}
                  onEndReachedThreshold={0.1}
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                  }}
                  removeClippedSubviews={true}
                  initialNumToRender={20}
                  maxToRenderPerBatch={5}
                  ListFooterComponent={() => (
                    <View
                      style={{
                        height: scaleSize(30),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isLoadMorePastAppointment ? (
                        <ActivityIndicator size="large" color="#0764B0" />
                      ) : null}
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        </View>

        <PopupAppointmentDetail
          ref={this.popupAppointmentDetailRef}
          visible={visible}
          closePopup={this.closePopup}
        />
      </View>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { isGetCustomerInfoByIdSuccess, customerInfoById } = this.props;
    if (
      isGetCustomerInfoByIdSuccess &&
      prevProps.isGetCustomerInfoByIdSuccess !== isGetCustomerInfoByIdSuccess
    ) {
      this.setState({
        customer: customerInfoById,
      });
      this.props.actions.customer.resetIsGetCustomerInfoByIdState();
    }
  }
}

const AppointmentItem = ({
  appointment,
  isPastAppointment,
  showAppointmentDetail,
}) => {
  const fromTime = appointment?.fromTime;
  const arrayProducts = getArrayProductsFromAppointment(
    appointment?.products || []
  );
  const arryaServices = getArrayServicesFromAppointment(
    appointment?.services || []
  );
  const arrayExtras = getArrayExtrasFromAppointment(appointment?.extras || []);
  const arrayGiftCards = getArrayGiftCardsFromAppointment(
    appointment?.giftCards || []
  );
  const status =
    appointment?.status === "checkin" ? "check-in" : appointment?.status;

  return (
    <Button
      onPress={showAppointmentDetail}
      style={{
        paddingHorizontal: scaleSize(10),
        borderBottomColor: "#EEEEEE",
        borderBottomWidth: scaleSize(1),
      }}
    >
      <View
        style={{
          minHeight: scaleSize(100),
          flexDirection: "row",
          paddingVertical: scaleSize(14),
        }}
      >
        <View style={{ width: scaleSize(55), alignItems: "center" }}>
          <Text
            style={{
              color: "#0764B0",
              fontSize: scaleSize(16),
              fontWeight: "600",
            }}
          >
            {`${formatWithMoment(fromTime, "D")}`}
          </Text>
          <Text
            style={{
              color: "#0764B0",
              fontSize: scaleSize(16),
              fontWeight: "600",
              marginVertical: scaleSize(3),
            }}
          >
            {`${formatWithMoment(fromTime, "MMM")}`}
          </Text>
          {isPastAppointment ? (
            <Text
              style={{
                color: "#0764B0",
                fontSize: scaleSize(16),
                fontWeight: "600",
              }}
            >
              {`${formatWithMoment(fromTime, "YYYY")}`}
            </Text>
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#404040",
              fontSize: scaleSize(14),
              marginBottom: scaleSize(10),
              fontWeight: "600",
            }}
          >
            {`${formatWithMoment(fromTime, "dddd")} - ${formatWithMoment(
              fromTime,
              "h:mm A"
            )}`}
          </Text>
          {/* ----------- Services ------------ */}
          {arryaServices.map((service) => (
            <Text
              key={service?.id}
              style={{
                color: "#404040",
                fontSize: scaleSize(14),
                marginTop: scaleSize(12),
              }}
            >
              {`${service?.data?.name || ""}- `}
              <Text style={{ fontWeight: "300" }}>
                {`${service?.staff?.displayName}`}
              </Text>
            </Text>
          ))}

          {/* ----------- Extras  ------------ */}
          {arrayExtras.map((extra) => (
            <Text
              key={extra?.id}
              style={{
                color: "#404040",
                fontSize: scaleSize(14),
                marginTop: scaleSize(12),
              }}
            >
              {`${extra?.data?.name || ""} `}
              <Text style={{ fontWeight: "300" }}>{`(Extra)`}</Text>
            </Text>
          ))}

          {/* ----------- Products  ------------ */}
          {arrayProducts.map((product) => (
            <Text
              key={product?.id}
              style={{
                color: "#404040",
                fontSize: scaleSize(14),
                marginTop: scaleSize(12),
              }}
            >
              {`${product?.data?.name || ""} `}
              <Text style={{ fontWeight: "300" }}>{`(Product)`}</Text>
            </Text>
          ))}

          {/* ----------- Giftcards  ------------ */}
          {arrayGiftCards.map((giftcard) => (
            <Text
              key={giftcard?.id}
              style={{
                color: "#404040",
                fontSize: scaleSize(14),
                marginTop: scaleSize(12),
              }}
            >
              {`${giftcard?.data?.name || ""} `}
              <Text style={{ fontWeight: "300" }}>{`(Gift Card)`}</Text>
            </Text>
          ))}
        </View>
        <View
          style={{
            width: scaleSize(140),
            paddingRight: scaleSize(12),
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: getColorStatus(appointment?.status),
              fontSize: scaleSize(14),
            }}
          >
            {`${`${status ? status : ""}`.toUpperCase() || ""}`}
          </Text>
          <Text
            style={{
              color: "#0764B0",
              fontSize: scaleSize(16),
              fontWeight: "600",
            }}
          >
            {`$ ${appointment?.total || 0.0}`}
          </Text>
        </View>
      </View>
    </Button>
  );
};

const ItemCustomerInfo = ({ icon, title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingRight: scaleSize(20),
        alignItems: "center",
        marginBottom: scaleSize(25),
      }}
    >
      <View style={{ width: scaleSize(26) }}>
        <Image source={icon} />
      </View>
      <Text style={{ color: "#404040", fontSize: scaleSize(10) }}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  SHADOW: {
    backgroundColor: "#fff",
    borderRadius: scaleSize(4),
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 1 },
      },

      android: {
        elevation: 2,
      },
    }),
  },
  booking_txt: {
    color: "#0764B0",
    fontWeight: "bold",
    fontSize: scaleSize(18),
  },
});

const mapStateToProps = (state) => ({
  customerInfoById: state.customer.customerInfoById,
  pastAppointments: state.customer.pastAppointments,
  customerHistory: state.customer.customerHistory,
  isGetCustomerInfoByIdSuccess: state.customer.isGetCustomerInfoByIdSuccess,
  totalPastAppointmentPages: state.customer.totalPastAppointmentPages,
  currentPastAppointmentPage: state.customer.currentPastAppointmentPage,
  isLoadMorePastAppointment: state.customer.isLoadMorePastAppointment,
  stateCity: state.dataLocal.stateCity,
});

export default connectRedux(mapStateToProps, CustomerDetailTab);
