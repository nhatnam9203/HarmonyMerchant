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

import { ButtonCustom, ModalCustom, Button } from '@components';
import { scaleSzie, localize, checkIsTablet } from '@utils';
import ICON from "@resources";

const { width } = Dimensions.get("window");

class PopupAppointmentDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    setStateFromParent = async customer => {

    }

    render() {
        const { visible,closePopup } = this.props;
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
            // style={style}
            >
                <View style={{
                    minHeight: scaleSzie(200),
                    width: width - scaleSzie(180),
                    backgroundColor: '#fff',
                    borderRadius: scaleSzie(8),
                    overflow: "hidden",
                }} >
                    {/* --------- Header ---------- */}
                    <PopupHeader 
                    closePopup={closePopup}
                    />

                    <View style={{ paddingHorizontal: scaleSzie(14) }} >
                        {/* ------------ Calendar --------- */}
                        <View style={{
                            height: scaleSzie(30), width: scaleSzie(130), backgroundColor: "#E5E5E5", borderRadius: 4,
                            marginTop: scaleSzie(14), marginBottom: scaleSzie(10), flexDirection: "row", paddingHorizontal: scaleSzie(8),
                            alignItems: "center"
                        }} >
                            <Image source={ICON.appointment_calendar} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                            <Text style={{ color: "#404040", fontSize: scaleSzie(12), marginLeft: scaleSzie(10) }} >
                                {`1/14/2019`}
                            </Text>
                            <View style={{ flex: 1, alignItems: "flex-end" }} >
                                <Image source={ICON.dropdown_appointment} />
                            </View>
                        </View>

                        {/* --------------- Table -------------- */}
                        <View style={{ borderColor: "#EEEEEE", borderWidth: 1 }} >
                            {/* --------- Table Header -------- */}
                            {/* <TableHeader /> */}
                            <TableHeaderPaid />

                            {/* --------- Table Item -------- */}
                            <TableItem />
                            <TableItem />
                        </View>


                        {/* ------------- Note ------------ */}
                        <Text style={{ color: "#404040", fontSize: scaleSzie(12), fontWeight: "600", marginTop: scaleSzie(12) }} >
                            {`Appointment note:`}
                        </Text>
                        {/* ------------- Note Item ------------ */}
                        <View style={{ flexDirection: "row", marginTop: scaleSzie(10) }} >
                            <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(12), fontWeight: "400", width: scaleSzie(130) }} >
                                {`03/14/18, 10:00 AM`}
                            </Text>
                            <Text style={{ color: "#404040", fontSize: scaleSzie(12), fontWeight: "600", width: scaleSzie(90) }} >
                                {`Venessa`}
                            </Text>
                            <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(12), fontWeight: "500" }} >
                                {`Lorem ipsum dolor sit amet, consetetur sadipscing elitr.`}
                            </Text>
                        </View>

                        {/* ------------- Line ------------ */}
                        {/* <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: scaleSzie(12), marginBottom: scaleSzie(14) }} /> */}

                        {/* ------------- Total duration + Total ------------ */}
                        {/* <View style={{ alignItems: "flex-end" }} >
                            <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(13) }} >
                                {`Total duration:`}
                                <Text style={{ fontWeight: "bold" }} >
                                    {`   45 min`}
                                </Text>
                                <Text >
                                    {`           Total:`}
                                </Text>
                                <Text style={{ fontWeight: "bold", color: "#0764B0", fontSize: scaleSzie(16) }} >
                                    {`   $ 60.00`}
                                </Text>
                            </Text>
                        </View> */}

                        {/* ------------- Line ------------ */}
                        <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: scaleSzie(12), marginBottom: scaleSzie(14) }} />

                        {/* ------------- Subtotal + Discount + Tip + Tax  ------------ */}
                        <View style={{ height: scaleSzie(55), flexDirection: "row" }} >
                            <View style={{ flex: 1, justifyContent: "space-between" }} >
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                    <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(14) }} >
                                        {`Subtotal:`}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(14), fontWeight: "bold" }} >
                                        {`$ 100.00`}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                    <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(14) }} >
                                        {`Tip:`}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(14), fontWeight: "bold" }} >
                                        {`$ 10.00`}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flex: 1.4, justifyContent: "space-between", paddingLeft: scaleSzie(30) }} >
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                    <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(14) }} >
                                        {`Discount:`}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(14), fontWeight: "bold" }} >
                                        {`$ 100.00`}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                                    <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(14) }} >
                                        {`Tax::`}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(14), fontWeight: "bold" }} >
                                        {`$ 10.00`}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ------------- Line ------------ */}
                        <View style={{ height: 1, backgroundColor: "#EEEEEE", marginTop: scaleSzie(12), marginBottom: scaleSzie(14) }} />

                        {/* ------------- Total ------------ */}
                        <View style={{ justifyContent: "space-between", flexDirection: "row" }} >
                            <Text style={{ color: "#6A6A6A", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                                {`Total`}
                            </Text>
                            <Text style={{ color: "#4CD964", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                                {`$ 90.00`}
                            </Text>
                        </View>


                        <View style={{ height: scaleSzie(16) }} />
                    </View>
                </View>
            </ModalCustom>
        );
    }

}

const PopupHeader = ({ isPaid,closePopup }) => {
    const temp_backgroundColor = !isPaid ? { backgroundColor: "#4AD100" } : {};

    return (
        <View style={[{
            height: scaleSzie(50), backgroundColor: "#9DDFF2", flexDirection: "row", paddingHorizontal: scaleSzie(14),
            justifyContent: "space-between", alignItems: "center"
        }, temp_backgroundColor]} >
            <Text style={{ color: "#fff", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                {`#1`}
            </Text>

            <Text style={{ color: "#fff", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                {`Confirmed appointment`}
            </Text>
            <Button onPress={closePopup} >
                <Image source={ICON.close_appointment_popup} style={{ height: scaleSzie(24), width: scaleSzie(24) }} />
            </Button>

        </View>
    );
}

const TableHeader = ({ }) => {
    return (
        <View style={{ height: scaleSzie(25), backgroundColor: "#404040", flexDirection: "row" }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title} >
                    {`Services`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title} >
                    {`Staff`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title} >
                    {`Start time`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title} >
                    {`Duration (min)`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title} >
                    {`Price ($)`}
                </Text>
            </View>
        </View>
    );
}

const TableHeaderPaid = ({ }) => {
    return (
        <View style={{ height: scaleSzie(25), backgroundColor: "#E5E5E5", flexDirection: "row" }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Services`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Staff`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Start time`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Tip ($)`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#fff" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_title_paid} >
                    {`Price ($)`}
                </Text>
            </View>
        </View>
    );
}


const TableItem = ({ }) => {

    return (
        <View style={{
            height: scaleSzie(38), backgroundColor: "#fff", flexDirection: "row",
            borderTopColor: "#EEEEEE", borderTopWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_item} >
                    {`Services`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_item} >
                    {`Staff`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_item} >
                    {`Start time`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_item} >
                    {`Duration (min)`}
                </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_item} >
                    {`Price ($)`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    txt_title: {
        color: "#fff",
        fontSize: scaleSzie(12)
    },
    txt_title_paid: {
        color: "#000000",
        fontSize: scaleSzie(12),
        fontWeight: "600"
    },
    txt_item: {
        color: "#404040",
        fontSize: scaleSzie(12)
    }
})




export default PopupAppointmentDetail;


