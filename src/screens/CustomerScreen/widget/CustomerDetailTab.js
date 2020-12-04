import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
    FlatList
} from 'react-native';

import { Button, Text } from '@components';
import { scaleSzie, formatWithMoment, getArrayProductsFromAppointment, getArrayServicesFromAppointment, getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment } from '@utils';
import Configs from "@configs";
import ICON from "@resources";
import connectRedux from '@redux/ConnectRedux';

class CustomerDetailTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customer: {
                customerId: "",
                firstName: "",
                lastName: "",
                phone: "",
                referrerPhone: "",
                email: "",
                isVip: 0,
                birthdate: "",
                gender: "",
                favourite: "",
                addressPost: {
                    "street": "",
                    "state": 0,
                    "city": "",
                    "zip": ""
                },

            }
        }
    }

    setStateFromParent = async (customer) => {
        await this.setState({
            customer
        })
    }

    showAppointmentDetail = () => {
        this.props.showAppointmentDetail()
    }

    render() {
        const { customerInfoById, pastAppointments } = this.props;
        const { customer } = this.state;
        const firstLetter = customer?.firstName ? customer?.firstName[0] : "";
        const upcomings = customerInfoById?.customerHistory?.upcomings || [];

        return (
            <View style={{ flex: 1, padding: scaleSzie(10) }} >
                <View style={{ flex: 1, flexDirection: "row" }} >
                    {/* --------------- Left Content ----------- */}
                    <View style={{ flex: 1, ...styles.SHADOW }} >
                        {/* ------------- Customer Avatar ---------- */}
                        <View style={{ height: scaleSzie(100), alignItems: "center", justifyContent: "flex-end" }} >
                            <View style={{
                                width: scaleSzie(86), height: scaleSzie(86), borderRadius: scaleSzie(43),
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
                                flexDirection: "row", paddingRight: scaleSzie(20), alignItems: "center"
                            }} >
                                <View style={{ width: scaleSzie(26) }} >
                                    <Image source={ICON.note_customer} />
                                </View>
                                <Text style={{ color: "#A9A9A9", fontSize: scaleSzie(12) }} >
                                    {`${customer?.favourite || ""}`}
                                </Text>
                            </View>

                            {/* ------------- Line  ---------- */}
                            <View style={{ height: scaleSzie(1), backgroundColor: "#EEEEEE", marginVertical: scaleSzie(14) }} />

                            <ItemCustomerInfo
                                icon={ICON.customer_phone}
                                title={`${customer?.phone || ""}`}
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_email}
                                title={`${customer?.email || ""}`}
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_gender}
                                title={`${customer?.gender || ""}`}
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_birthday}
                                title={`${customer?.birthdate || ""}`}
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_location}
                                title={`${customer?.addressPost?.street} ${customer?.addressPost?.city} ${customer?.addressPost?.state}`}

                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_ref_phone}
                                title={`${customer?.referrerPhone || ""}`}
                            />
                        </View>

                        <Button style={{ position: "absolute", top: scaleSzie(14), right: scaleSzie(14) }} >
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
                                        {`$  ${customerInfoById?.customerHistory?.totalSales || "0.00"}`}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(13) }} >
                                        {`Total sales`}
                                    </Text>
                                </View>
                                {/* --------------- Line ----------- */}
                                <View style={{ width: scaleSzie(1), backgroundColor: "#EEEEEE" }} />
                                <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingVertical: scaleSzie(5), justifyContent: "space-around" }} >
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(20), fontWeight: "bold" }} >
                                        {`$  ${customerInfoById?.customerHistory?.lastVisitSale || "0.00"}`}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}  >
                                        <Text style={{ color: "#404040", fontSize: scaleSzie(13) }} >
                                            {`Last visit sales`}
                                        </Text>

                                        <Text style={{ color: "#404040", fontSize: scaleSzie(13), fontWeight: "300" }} >
                                            {`${formatWithMoment(customerInfoById?.customerHistory?.lastVisitDate, "MM/DD/YYYY")}`}
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
                                <ScrollView>
                                    <View style={{ height: scaleSzie(130) }} >
                                        <View style={{ flex: 1, flexDirection: "row", }} >
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                                    {`${customerInfoById?.customerHistory?.allBooking || 0}`}
                                                </Text>
                                                <View style={{ height: scaleSzie(10) }} />
                                                <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                                    {`All bookings`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                                    {`${customerInfoById?.customerHistory?.upcoming || 0}`}
                                                </Text>
                                                <View style={{ height: scaleSzie(10) }} />
                                                <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                                    {`Upcoming`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                                    {`${customerInfoById?.customerHistory?.completed || 0}`}
                                                </Text>
                                                <View style={{ height: scaleSzie(10) }} />
                                                <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                                    {`Completed`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                                    {`${customerInfoById?.customerHistory?.cancelled || 0}`}
                                                </Text>
                                                <View style={{ height: scaleSzie(10) }} />
                                                <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                                    {`Cancelled`}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ height: scaleSzie(35), paddingLeft: scaleSzie(14) }} >
                                            <Text style={{ color: "#404040", fontSize: scaleSzie(14), fontWeight: "600" }} >
                                                {`Upcoming`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* --------------- Line ----------- */}
                                    <View style={{ height: scaleSzie(1), backgroundColor: "#EEEEEE" }} />

                                    {/* -------------- Appointment Item ------------ */}
                                    {
                                        upcomings.map((appointment) => <AppointmentItem
                                            key={appointment?.appointmentId}
                                            appointment={appointment}
                                        />)
                                    }

                                    <FlatList
                                        data={pastAppointments}
                                        renderItem={({ item, index }) => <AppointmentItem
                                            appointment={item}
                                            isPastAppointment={true}
                                        />}
                                        keyExtractor={(item, index) => `${item?.appointmentId}_${index}`}
                                    />

                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            </View >
        );
    }
}

const AppointmentItem = ({ appointment, isPastAppointment }) => {
    const createdDate = appointment?.createdDate;
    const arrayProducts = getArrayProductsFromAppointment(appointment?.products || []);
    const arryaServices = getArrayServicesFromAppointment(appointment?.services || []);
    const arrayExtras = getArrayExtrasFromAppointment(appointment?.extras || []);
    const arrayGiftCards = getArrayGiftCardsFromAppointment(appointment?.giftCards || []);

    return (
        <View style={{ paddingHorizontal: scaleSzie(10), borderBottomColor: "#EEEEEE", borderBottomWidth: scaleSzie(1), }} >

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

            <Button onPress={this.showAppointmentDetail} style={{
                minHeight: scaleSzie(100), flexDirection: "row", paddingVertical: scaleSzie(14),
            }} >
                <View style={{ width: scaleSzie(55), alignItems: "center" }} >
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600" }} >
                        {`${formatWithMoment(createdDate, "D")}`}
                    </Text>
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600", marginVertical: scaleSzie(3) }} >
                        {`${formatWithMoment(createdDate, "MMM")}`}
                    </Text>
                    {
                        isPastAppointment ? <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600" }} >
                            {`${formatWithMoment(createdDate, "YYYY")}`}
                        </Text> : null
                    }

                </View>
                <View style={{ flex: 1 }} >
                    <Text style={{ color: "#404040", fontSize: scaleSzie(16), marginBottom: scaleSzie(10), fontWeight: "600" }} >
                        {`${formatWithMoment(createdDate, "dddd")} - ${formatWithMoment(createdDate, "h:mm A")}`}
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
                <View style={{ width: scaleSzie(125), paddingRight: scaleSzie(12), alignItems: "flex-end", justifyContent: "space-between" }} >
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(20) }} >
                        {`${`${appointment?.status}`.toUpperCase() || ""}`}
                    </Text>
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(20), fontWeight: "600" }} >
                        {`$ ${appointment?.total || 0.00}`}
                    </Text>
                </View>
            </Button>
        </View>

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
    pastAppointments: state.customer.pastAppointments
})



export default connectRedux(mapStateToProps, CustomerDetailTab);