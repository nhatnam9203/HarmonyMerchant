import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    StyleSheet
} from 'react-native';
import moment from "moment";

import { ButtonCustom, ModalCustom, Button } from '@components';
import { scaleSize, localize, checkIsTablet, formatWithMoment, getColorStatus,msToTime } from '@utils';
import ICON from "@resources";

const { width } = Dimensions.get("window");

class PopupAppointmentDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appointmentDetail: {}
        }
    }

    setStateFromParent = async (appointment) => {
        this.setState({
            appointmentDetail: appointment
        })
    }

    render() {
        const { visible, closePopup } = this.props;
        const { appointmentDetail } = this.state;

        const services = appointmentDetail?.services || [];
        const products = appointmentDetail?.products || [];
        const extras = appointmentDetail?.extras || [];
        const giftCards = appointmentDetail?.giftCards || [];
        const notes = appointmentDetail?.notes || [];
        const duration = appointmentDetail?.duration || 0;
        const tempDuration = msToTime(duration);

        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
            // style={style}
            >
                <View style={{
                    minHeight: scaleSize(200),
                    width: width - scaleSize(180),
                    backgroundColor: '#fff',
                    borderRadius: scaleSize(8),
                    overflow: "hidden",
                }} >
                    {/* --------- Header ---------- */}
                    <PopupHeader
                        closePopup={closePopup}
                        appointmentDetail={appointmentDetail}

                    />

                    <View style={{ paddingHorizontal: scaleSize(14) }} >
                        {/* ------------ Calendar --------- */}
                        <View style={{
                            height: scaleSize(30), width: scaleSize(130), backgroundColor: "#E5E5E5", borderRadius: 4,
                            marginTop: scaleSize(14), marginBottom: scaleSize(10), flexDirection: "row", paddingHorizontal: scaleSize(8),
                            alignItems: "center"
                        }} >
                            <Image source={ICON.appointment_calendar} style={{ width: scaleSize(18), height: scaleSize(18) }} />
                            <Text style={{ color: "#404040", fontSize: scaleSize(12), marginLeft: scaleSize(10) }} >
                                {`${formatWithMoment(appointmentDetail?.createdDate, "MM/DD/YYYY")}`}
                            </Text>
                            <View style={{ flex: 1, alignItems: "flex-end" }} >
                                <Image source={ICON.dropdown_appointment} />
                            </View>
                        </View>

                        {/* --------------- Table -------------- */}
                        <View style={{ borderColor: "#EEEEEE", borderWidth: 1 }} >
                            {/* --------- Table Header -------- */}
                            {
                                services.length > 0 || extras.length > 0 ? <ServiceHeader
                                    status={appointmentDetail?.status || ""}
                                /> : null
                            }
                            {
                                services.map((service, index) => <ServiceItem
                                    key={service?.bookingServiceId || index}
                                    service={service}
                                    status={appointmentDetail?.status || ""}
                                />)

                            }

                            {
                                extras.map((extra, index) => <ExtraItem
                                    key={extra?.bookingExtraId || index}
                                    extra={extra}
                                    status={appointmentDetail?.status || ""}
                                />)
                            }

                            {/* ---------------- Products  ------------- */}
                            {
                                products.length > 0 ? <ProductHeader /> : null
                            }
                            {
                                products.map((product, index) => <ProductItem
                                    key={product?.bookingProductId || index}
                                    product={product}
                                />)
                            }

                            {/* ---------------- GiftCards  ------------- */}
                            {giftCards.length > 0 ? <GiftCardHeader /> : null}

                            {
                                giftCards.map((giftcard, index) => <GiftCardItem
                                    key={`giftcard_${index}`}
                                    giftCard={giftcard}
                                />)
                            }

                        </View>


                        {/* ------------- Note ------------ */}
                        {
                            notes.length > 0 ? <Text style={{ color: "#404040", fontSize: scaleSize(12), fontWeight: "600", marginTop: scaleSize(12) }} >
                                {`Appointment note:`}
                            </Text> : null
                        }

                        {/* ------------- Note Item ------------ */}
                        {
                            notes.map((note, index) => <View style={{ flexDirection: "row", marginTop: scaleSize(10) }} >
                                <Text style={{ color: "#6A6A6A", fontSize: scaleSize(12), fontWeight: "400", width: scaleSize(130) }} >
                                    {`${formatWithMoment(note?.createDate, "MM/DD/YYYY hh:mm A")}`}
                                </Text>
                                <Text style={{ color: "#404040", fontSize: scaleSize(12), fontWeight: "600", width: scaleSize(90) }} >
                                    {`${note?.staffName || ""}`}
                                </Text>
                                <Text style={{ color: "#6A6A6A", fontSize: scaleSize(12), fontWeight: "500" }} >
                                    {`${note?.note || ""}`}
                                </Text>
                            </View>)
                        }

                        {
                            appointmentDetail?.status === "paid" ?
                                <>
                                    {/* ------------- Line ------------ */}
                                    <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: scaleSize(12), marginBottom: scaleSize(14) }} />

                                    {/* ------------- Subtotal + Discount + Tip + Tax  ------------ */}
                                    <View style={{ height: scaleSize(55), flexDirection: "row" }} >
                                        <View style={{ flex: 1, justifyContent: "space-between" }} >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                                <Text style={{ color: "#6A6A6A", fontSize: scaleSize(14) }} >
                                                    {`Subtotal:`}
                                                </Text>
                                                <Text style={{ color: "#404040", fontSize: scaleSize(14), fontWeight: "bold" }} >
                                                    {`$ ${appointmentDetail?.subTotal || 0.00}`}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                                <Text style={{ color: "#6A6A6A", fontSize: scaleSize(14) }} >
                                                    {`Tip:`}
                                                </Text>
                                                <Text style={{ color: "#404040", fontSize: scaleSize(14), fontWeight: "bold" }} >
                                                    {`$ ${appointmentDetail?.tipAmount || 0.00}`}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1.4, justifyContent: "space-between", paddingLeft: scaleSize(30) }} >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                                <Text style={{ color: "#6A6A6A", fontSize: scaleSize(14) }} >
                                                    {`Discount:`}
                                                </Text>
                                                <Text style={{ color: "#404040", fontSize: scaleSize(14), fontWeight: "bold" }} >
                                                    {`$ ${appointmentDetail?.discount || 0.00}`}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                                <Text style={{ color: "#6A6A6A", fontSize: scaleSize(14) }} >
                                                    {`Tax:`}
                                                </Text>
                                                <Text style={{ color: "#404040", fontSize: scaleSize(14), fontWeight: "bold" }} >
                                                    {`$ ${appointmentDetail?.tax || 0.00}`}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* ------------- Line ------------ */}
                                    <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: scaleSize(12), marginBottom: scaleSize(14) }} />

                                    {/* ------------- Total ------------ */}
                                    <View style={{ justifyContent: "space-between", flexDirection: "row" }} >
                                        <Text style={{ color: "#6A6A6A", fontSize: scaleSize(16), fontWeight: "bold" }} >
                                            {`Total`}
                                        </Text>
                                        <Text style={{ color: "#4CD964", fontSize: scaleSize(16), fontWeight: "bold" }} >
                                            {`$ ${appointmentDetail?.total || 0.00}`}
                                        </Text>
                                    </View>
                                </>

                                :

                                <>
                                    {/* ------------- Line ------------ */}
                                    <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: scaleSize(12), marginBottom: scaleSize(14) }} />

                                    {/* ------------- Total duration + Total ------------ */}
                                    <View style={{ alignItems: "flex-end" }} >
                                        <Text style={{ color: "#6A6A6A", fontSize: scaleSize(13) }} >
                                            {`Total duration:`}
                                            <Text style={{ fontWeight: "bold" }} >
                                                {`   ${tempDuration}`}
                                            </Text>
                                            <Text >
                                                {`           Total:`}
                                            </Text>
                                            <Text style={{ fontWeight: "bold", color: "#0764B0", fontSize: scaleSize(16) }} >
                                                {`   $ ${appointmentDetail?.total || 0.00}`}
                                            </Text>
                                        </Text>
                                    </View>
                                </>
                        }




                        <View style={{ height: scaleSize(16) }} />
                    </View>
                </View>
            </ModalCustom>
        );
    }

}

const PopupHeader = ({ closePopup, appointmentDetail }) => {
    const status = appointmentDetail?.status === "checkin" ? "check-in" : appointmentDetail?.status;

    return (
        <View style={[{
            height: scaleSize(50), backgroundColor: getColorStatus(appointmentDetail?.status), flexDirection: "row", paddingHorizontal: scaleSize(14),
            justifyContent: "space-between", alignItems: "center"
        }]} >
            <Text style={{ color: "#fff", fontSize: scaleSize(16), fontWeight: "bold" }} >
                {`#${appointmentDetail?.code || ""}`}
            </Text>

            <Text style={{ color: "#fff", fontSize: scaleSize(16), fontWeight: "bold" }} >
                {`${`${status ? status : ""}`.toUpperCase() || ""} APPOINTMENT`}
            </Text>
            <Button onPress={closePopup} >
                <Image source={ICON.close_appointment_popup} style={{ height: scaleSize(24), width: scaleSize(24) }} />
            </Button>

        </View>
    );
}

const ServiceHeader = ({ status }) => {
    return (
        <View style={{ height: scaleSize(25), backgroundColor: "#E5E5E5", flexDirection: "row" }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Services`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Staff`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Start time`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`${status === "paid" ? `Tip ($)` : `Duration (min)`}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center",alignItems:"flex-end", paddingHorizontal: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Price ($)`}
                </Text>
            </View>
        </View>
    );
}

const ProductHeader = ({ }) => {
    return (
        <View style={{ height: scaleSize(25), backgroundColor: "#E5E5E5", flexDirection: "row" }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Products`}
                </Text>
            </View>
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1, backgroundColor: "#fff" }} />

            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Quantity`}
                </Text>
            </View>

            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center",alignItems:"flex-end", paddingHorizontal: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Price ($)`}
                </Text>
            </View>
        </View>
    );
}

const GiftCardHeader = ({ }) => {
    return (
        <View style={{ height: scaleSize(25), backgroundColor: "#E5E5E5", flexDirection: "row" }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Gift Cards`}
                </Text>
            </View>
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1, backgroundColor: "#fff" }} />

            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Quantity`}
                </Text>
            </View>

            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center",alignItems:"flex-end", paddingHorizontal: scaleSize(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Price ($)`}
                </Text>
            </View>
        </View>
    );
}

const ServiceItem = ({ service, status }) => {

    return (
        <View style={{
            height: scaleSize(38), backgroundColor: "#fff", flexDirection: "row",
            borderTopColor: "#EEEEEE", borderTopWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${service?.serviceName || ""}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${service?.staff?.displayName || ""}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${formatWithMoment(service?.fromTime, "hh:mm A")}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${status === "paid" ? (service?.tipAmount || 0.00) : (service?.duration || 1)}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", alignItems:"flex-end", paddingHorizontal: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${service?.price || 0.00}`}
                </Text>
            </View>
        </View>
    );
}

const ExtraItem = ({ extra, status }) => {

    return (
        <View style={{
            height: scaleSize(38), backgroundColor: "#fff", flexDirection: "row",
            borderTopColor: "#EEEEEE", borderTopWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${extra?.extraName || ""}`}
                </Text>
            </View>
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />

            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${status === "paid" ? "0.00" : (extra?.duration || 1)}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", alignItems:"flex-end", paddingHorizontal: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${extra?.price || 0.00}`}
                </Text>
            </View>
        </View>
    );
}

const ProductItem = ({ product }) => {

    return (
        <View style={{
            height: scaleSize(38), backgroundColor: "#fff", flexDirection: "row",
            borderTopColor: "#EEEEEE", borderTopWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${product?.productName || ""}`}
                </Text>
            </View>
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />

            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${product?.quantity || 1}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", alignItems:"flex-end", paddingHorizontal: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${product?.price || 0.00}`}
                </Text>
            </View>
        </View>
    );
}

const GiftCardItem = ({ giftCard }) => {

    return (
        <View style={{
            height: scaleSize(38), backgroundColor: "#fff", flexDirection: "row",
            borderTopColor: "#EEEEEE", borderTopWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${giftCard?.name || ""}`}
                </Text>
            </View>
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1 }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} />
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />

            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${giftCard?.quantity || 1}`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center",alignItems:"flex-end", paddingHorizontal: scaleSize(10) }} >
                <Text style={styles.txt_item} >
                    {`${giftCard?.price || 0.00}`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    txt_title: {
        color: "#fff",
        fontSize: scaleSize(12)
    },
    txt_title_paid: {
        color: "#000000",
        fontSize: scaleSize(12),
        fontWeight: "600"
    },
    txt_item: {
        color: "#404040",
        fontSize: scaleSize(12)
    }
})




export default PopupAppointmentDetail;


