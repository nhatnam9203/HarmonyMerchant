import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    FlatList,
    ActivityIndicator,
    ScrollView
} from 'react-native';

import { Button, Text } from '@components';
import {
    scaleSzie, formatWithMoment, getArrayProductsFromAppointment, getArrayServicesFromAppointment, getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment,
    getColorStatus
} from '@utils';
import Configs from "@configs";
import ICON from "@resources";
import connectRedux from '@redux/ConnectRedux';
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
                    "street": "",
                    "state": 0,
                    "city": "",
                    "zip": ""
                },

            },
            visible: false
        };
        this.onEndReachedCalledDuringMomentum = true;
        this.popupAppointmentDetailRef = React.createRef();
    }

    setStateFromParent = async (customer) => {
        await this.setState({
            customer
        })
    }

    showAppointmentDetail = (appointment) => {
        this.popupAppointmentDetailRef.current.setStateFromParent(appointment);
        this.setState({
            visible: true
        })
    }

    closePopup = () => {
        this.setState({
            visible: false
        })
    }

    loadMorePastAppointments = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { totalPastAppointmentPages, currentPastAppointmentPage } = this.props;
            if (currentPastAppointmentPage < totalPastAppointmentPages) {
                this.props.actions.customer.getPastAppointments(this.state?.customer?.customerId || 0, currentPastAppointmentPage + 1, true, false);
                this.onEndReachedCalledDuringMomentum = true;
            }
        }
    }

    editCustomer = () => {
        this.props.editCustomer(this.state.customer);
    }

    renderHeaderFlatlist() {
        const { customerHistory } = this.props;
        const upcomings = customerHistory?.upcomings || [];

        return (
            <View style={{ marginTop: scaleSzie(15) }} >
                <View style={{ minHeight: scaleSzie(130 - 35) }} >
                    <View style={{ flex: 1, flexDirection: "row", }} >
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                {`${customerHistory?.allBooking || 0}`}
                            </Text>
                            <View style={{ height: scaleSzie(10) }} />
                            <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                {`All bookings`}
                            </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                {`${customerHistory?.upcoming || 0}`}
                            </Text>
                            <View style={{ height: scaleSzie(10) }} />
                            <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                {`Upcoming`}
                            </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                {`${customerHistory?.completed || 0}`}
                            </Text>
                            <View style={{ height: scaleSzie(10) }} />
                            <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                {`Completed`}
                            </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                {`${customerHistory?.cancelled || 0}`}
                            </Text>
                            <View style={{ height: scaleSzie(10) }} />
                            <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                {`Cancelled`}
                            </Text>
                        </View>
                    </View>

                    {
                        upcomings.length > 0 ? <View style={{ height: scaleSzie(40), paddingLeft: scaleSzie(14), justifyContent: "center" }} >
                            <Text style={{ color: "#404040", fontSize: scaleSzie(14), fontWeight: "600" }} >
                                {`Upcoming`}
                            </Text>
                        </View> : <View />
                    }

                </View>
                {/* --------------- Line ----------- */}
                <View style={{ height: scaleSzie(1), backgroundColor: "#EEEEEE" }} />

                {/* -------------- Appointment Item ------------ */}
                {
                    upcomings.map((appointment) => <AppointmentItem
                        key={appointment?.appointmentId}
                        appointment={appointment}
                        showAppointmentDetail={() => this.showAppointmentDetail(appointment)}
                    />)
                }

            </View>
        );
    }

    render() {
        const { pastAppointments, customerHistory, isLoadMorePastAppointment } = this.props;
        const { customer, visible } = this.state;
        const firstLetter = customer?.firstName ? customer?.firstName[0] : "";
        const upcomings = customerHistory?.upcomings || [];

        return (
            <View style={{ flex: 1, padding: scaleSzie(10) }} >
                <View style={{ flex: 1, flexDirection: "row" }} >
                    {/* --------------- Left Content ----------- */}
                    <View style={{ flex: 1, ...styles.SHADOW }} >
                        {/* ------------- Customer Avatar ---------- */}
                        <View style={{ height: scaleSzie(90), alignItems: "center", justifyContent: "flex-end" }} >
                            <View style={{
                                width: scaleSzie(80), height: scaleSzie(80), borderRadius: scaleSzie(40),
                                overflow: "hidden", backgroundColor: "#E5E5E5", justifyContent: "center",
                                alignItems: "center"
                            }} >
                                <Text style={{ color: "#404040", fontSize: scaleSzie(40), fontWeight: "bold" }} >
                                    {`${firstLetter}`}
                                </Text>
                            </View>
                        </View>

                        {/* ------------- Customer Name ---------- */}
                        <Text style={{
                            color: "#404040", fontSize: scaleSzie(14), fontWeight: "600", textAlign: "center",
                            marginVertical: scaleSzie(8)
                        }} >
                            {`${customer?.firstName || ""} ${customer?.lastName || ""}`}
                        </Text>

                        {/* ------------- Customer VIP or Normal Status  ---------- */}
                        {
                            customer?.isVip ?

                                < View style={{ height: scaleSzie(28), alignItems: "center", marginBottom: scaleSzie(10) }} >
                                    <View style={{
                                        height: scaleSzie(28), width: scaleSzie(80), backgroundColor: "rgb(76,217,100)", borderRadius: scaleSzie(30),
                                        justifyContent: "center", alignItems: "center", flexDirection: "row"
                                    }} >
                                        <Image source={ICON.vip_icon} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                                        <Text style={{ color: "#fff", fontSize: scaleSzie(12), marginLeft: scaleSzie(4) }} >
                                            {`VIP`}
                                        </Text>
                                    </View>
                                </View>
                                :
                                <View style={{ height: scaleSzie(28), alignItems: "center", marginBottom: scaleSzie(10) }} >
                                    <View style={{
                                        height: scaleSzie(28), width: scaleSzie(80), backgroundColor: "#0764B0", borderRadius: scaleSzie(30),
                                        justifyContent: "center", alignItems: "center"
                                    }} >
                                        <Text style={{ color: "#fff", fontSize: scaleSzie(12) }} >
                                            {`Normal`}
                                        </Text>
                                    </View>
                                </View>
                        }

                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                            {/* ------------- Customer Note  ---------- */}
                            <View style={{
                                flexDirection: "row", paddingRight: scaleSzie(10), alignItems: "center",
                                maxHeight: scaleSzie(70)
                            }} >
                                <View style={{ width: scaleSzie(26) }} >
                                    <Image source={ICON.note_customer} />
                                </View>
                                <View style={{ flex: 1 }} >
                                    <ScrollView>
                                        <Text style={{ color: "#A9A9A9", fontSize: scaleSzie(12) }} >
                                            {`${customer?.note || ""}`}
                                        </Text>
                                    </ScrollView>
                                </View>

                            </View>

                            {/* ------------- Line  ---------- */}
                            <View style={{ height: scaleSzie(1), backgroundColor: "#EEEEEE", marginVertical: scaleSzie(14) }} />

                            {
                                customer?.phone ? <ItemCustomerInfo
                                    icon={ICON.customer_phone}
                                    title={`${customer?.phone || ""}`}
                                /> : null
                            }

                            {
                                customer?.email ? <ItemCustomerInfo
                                    icon={ICON.customer_email}
                                    title={`${customer?.email || ""}`}
                                /> : null
                            }

                            {
                                customer?.gender && customer?.gender != "undefined" ? <ItemCustomerInfo
                                    icon={ICON.customer_gender}
                                    title={`${customer?.gender || ""}`}
                                /> : null
                            }

                            {
                                customer?.birthdate ? <ItemCustomerInfo
                                    icon={ICON.customer_birthday}
                                    title={`${formatWithMoment(customer?.birthdate, "MM/DD/YYYY")}`}
                                /> : null
                            }

                            {
                                customer?.addressPost?.street && customer?.addressPost?.city && customer?.addressPost?.state ?
                                    <ItemCustomerInfo
                                        icon={ICON.customer_location}
                                        title={`${customer?.addressPost?.street} ${customer?.addressPost?.city} ${customer?.addressPost?.state}`}
                                    /> : null
                            }


                            {
                                customer?.referrerBy && customer?.referrerPhone ? <ItemCustomerInfo
                                    icon={ICON.customer_ref_phone}
                                    title={`${customer?.referrerBy || ""} ${customer?.referrerPhone || ""}`}
                                /> : null
                            }

                        </View>

                        <Button onPress={this.editCustomer} style={{ position: "absolute", top: scaleSzie(14), right: scaleSzie(14) }} >
                            <Image source={ICON.edit_customer_icon} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                        </Button>
                    </View>

                    {/* --------------- Line ----------- */}
                    <View style={{ width: scaleSzie(12) }} />

                    {/* --------------- Right Content ----------- */}
                    <View style={{ flex: 1.6 }} >
                        {/* --------------- Top Right Content ----------- */}
                        <View style={{ height: scaleSzie(130), ...styles.SHADOW }} >
                            <View style={{ height: scaleSzie(40), paddingLeft: scaleSzie(14), justifyContent: "center" }} >
                                <Text style={{ color: "#0764B0", fontSize: scaleSzie(14), fontWeight: "600" }} >
                                    {`Sales`}
                                </Text>
                            </View>

                            {/* --------------- Line ----------- */}
                            <View style={{ height: scaleSzie(1), backgroundColor: "#EEEEEE" }} />

                            <View style={{ flex: 1, flexDirection: "row" }} >
                                <View style={{ flex: 1, paddingLeft: scaleSzie(14), paddingVertical: scaleSzie(5), justifyContent: "space-around" }} >
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(20), fontWeight: "bold" }} >
                                        {`$  ${customerHistory?.totalSales || "0.00"}`}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(13) }} >
                                        {`Total sales`}
                                    </Text>
                                </View>
                                {/* --------------- Line ----------- */}
                                <View style={{ width: scaleSzie(1), backgroundColor: "#EEEEEE" }} />
                                <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingVertical: scaleSzie(5), justifyContent: "space-around" }} >
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(20), fontWeight: "bold" }} >
                                        {`$  ${customerHistory?.lastVisitSale || "0.00"}`}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}  >
                                        <Text style={{ color: "#404040", fontSize: scaleSzie(13) }} >
                                            {`Last visit sales`}
                                        </Text>

                                        <Text style={{ color: "#404040", fontSize: scaleSzie(13), fontWeight: "300" }} >
                                            {`${formatWithMoment(customerHistory?.lastVisitDate, "MM/DD/YYYY")}`}
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                        {/* --------------- Line ----------- */}
                        <View style={{ height: scaleSzie(12) }} />
                        {/* --------------- Bottom Right Content ----------- */}
                        <View style={{ flex: 1, ...styles.SHADOW }} >
                            <View style={{ height: scaleSzie(40), paddingLeft: scaleSzie(14), justifyContent: "center" }} >
                                <Text style={{ color: "#0764B0", fontSize: scaleSzie(14), fontWeight: "600" }} >
                                    {`Appointments`}
                                </Text>
                            </View>

                            {/* --------------- Line ----------- */}
                            <View style={{ height: scaleSzie(1), backgroundColor: "#EEEEEE" }} />

                            <View style={{ flex: 1 }} >
                                <FlatList
                                    data={pastAppointments}
                                    renderItem={({ item, index }) => <AppointmentItem
                                        appointment={item}
                                        isPastAppointment={true}
                                        showAppointmentDetail={() => this.showAppointmentDetail(item)}
                                    />}
                                    ListHeaderComponent={() => this.renderHeaderFlatlist()}
                                    keyExtractor={(item, index) => `${item?.appointmentId}_${index}`}
                                    onEndReached={this.loadMorePastAppointments}
                                    onEndReachedThreshold={0.5}
                                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                    removeClippedSubviews={true}
                                    initialNumToRender={20}
                                    maxToRenderPerBatch={5}
                                    ListFooterComponent={() => <View style={{ height: scaleSzie(30), alignItems: "center", justifyContent: "center" }} >
                                        {
                                            isLoadMorePastAppointment ? <ActivityIndicator
                                                size="large"
                                                color="#0764B0"
                                            /> : null
                                        }
                                    </View>}
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
            </View >
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const { isGetCustomerInfoByIdSuccess, customerInfoById } = this.props;

        if (isGetCustomerInfoByIdSuccess && prevProps.isGetCustomerInfoByIdSuccess !== isGetCustomerInfoByIdSuccess) {
            // console.log("---- Update ne ----");
            this.setState({
                customer: customerInfoById
            })
            this.props.actions.customer.resetIsGetCustomerInfoByIdState();
        }
    }

}

const AppointmentItem = ({ appointment, isPastAppointment, showAppointmentDetail }) => {
    const fromTime = appointment?.fromTime;
    const arrayProducts = getArrayProductsFromAppointment(appointment?.products || []);
    const arryaServices = getArrayServicesFromAppointment(appointment?.services || []);
    const arrayExtras = getArrayExtrasFromAppointment(appointment?.extras || []);
    const arrayGiftCards = getArrayGiftCardsFromAppointment(appointment?.giftCards || []);

    return (
        <Button onPress={showAppointmentDetail} style={{ paddingHorizontal: scaleSzie(10), borderBottomColor: "#EEEEEE", borderBottomWidth: scaleSzie(1), }} >

            {
                isPastAppointment ? <View style={{ width: scaleSzie(55), alignItems: "center" }} >
                    <Text style={{
                        color: "#404040", fontSize: scaleSzie(16), fontWeight: "600",
                        marginTop: scaleSzie(22), marginBottom: scaleSzie(10)
                    }} >
                        {`Past`}
                    </Text>
                </View> : <View />
            }

            <View style={{
                minHeight: scaleSzie(100), flexDirection: "row", paddingVertical: scaleSzie(14),
            }} >
                <View style={{ width: scaleSzie(55), alignItems: "center" }} >
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600" }} >
                        {`${formatWithMoment(fromTime, "D")}`}
                    </Text>
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600", marginVertical: scaleSzie(3) }} >
                        {`${formatWithMoment(fromTime, "MMM")}`}
                    </Text>
                    {
                        isPastAppointment ? <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600" }} >
                            {`${formatWithMoment(fromTime, "YYYY")}`}
                        </Text> : null
                    }

                </View>
                <View style={{ flex: 1 }} >
                    <Text style={{ color: "#404040", fontSize: scaleSzie(14), marginBottom: scaleSzie(10), fontWeight: "600" }} >
                        {`${formatWithMoment(fromTime, "dddd")} - ${formatWithMoment(fromTime, "h:mm A")}`}
                    </Text>
                    {/* ----------- Services ------------ */}
                    {
                        arryaServices.map((service) => <Text key={service?.id} style={{ color: "#404040", fontSize: scaleSzie(14), marginTop: scaleSzie(12) }} >
                            {`${service?.data?.name || ""}- `}
                            <Text style={{ fontWeight: "300" }} >
                                {`${service?.staff?.displayName}`}
                            </Text>
                        </Text>)
                    }

                    {/* ----------- Extras  ------------ */}
                    {
                        arrayExtras.map((extra) => <Text key={extra?.id} style={{ color: "#404040", fontSize: scaleSzie(14), marginTop: scaleSzie(12) }} >
                            {`${extra?.data?.name || ""} `}
                            <Text style={{ fontWeight: "300" }} >
                                {`(Extra)`}
                            </Text>
                        </Text>)
                    }

                    {/* ----------- Products  ------------ */}
                    {
                        arrayProducts.map((product) => <Text key={product?.id} style={{ color: "#404040", fontSize: scaleSzie(14), marginTop: scaleSzie(12) }} >
                            {`${product?.data?.name || ""} `}
                            <Text style={{ fontWeight: "300" }} >
                                {`(Product)`}
                            </Text>
                        </Text>)
                    }

                    {/* ----------- Giftcards  ------------ */}
                    {
                        arrayGiftCards.map((giftcard) => <Text key={giftcard?.id} style={{ color: "#404040", fontSize: scaleSzie(14), marginTop: scaleSzie(12) }} >
                            {`${giftcard?.data?.name || ""} `}
                            <Text style={{ fontWeight: "300" }} >
                                {`(Gift Card)`}
                            </Text>
                        </Text>)
                    }

                </View>
                <View style={{ width: scaleSzie(140), paddingRight: scaleSzie(12), alignItems: "flex-end", justifyContent: "space-between" }} >
                    <Text style={{ color: getColorStatus(appointment?.status), fontSize: scaleSzie(16) }} >
                        {`${`${appointment?.status}`.toUpperCase() || ""}`}
                    </Text>
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(20), fontWeight: "600" }} >
                        {`$ ${appointment?.total || 0.00}`}
                    </Text>
                </View>
            </View>
        </Button>

    );
}


const ItemCustomerInfo = ({ icon, title }) => {

    return (
        <View style={{
            flexDirection: "row", paddingRight: scaleSzie(20), alignItems: "center", marginBottom: scaleSzie(25)
        }} >
            <View style={{ width: scaleSzie(26) }} >
                <Image source={icon} />
            </View>
            <Text style={{ color: "#404040", fontSize: scaleSzie(10) }} >
                {title}
            </Text>
        </View>
    );

}

const styles = StyleSheet.create({
    SHADOW: {
        backgroundColor: "#fff",
        borderRadius: scaleSzie(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.6,
                shadowOffset: { width: 0, height: 1 },
            },

            android: {
                elevation: 2,
            },
        })
    },

})


const mapStateToProps = state => ({
    customerInfoById: state.customer.customerInfoById,
    pastAppointments: state.customer.pastAppointments,
    customerHistory: state.customer.customerHistory,
    isGetCustomerInfoByIdSuccess: state.customer.isGetCustomerInfoByIdSuccess,
    totalPastAppointmentPages: state.customer.totalPastAppointmentPages,
    currentPastAppointmentPage: state.customer.currentPastAppointmentPage,
    isLoadMorePastAppointment: state.customer.isLoadMorePastAppointment
})



export default connectRedux(mapStateToProps, CustomerDetailTab);