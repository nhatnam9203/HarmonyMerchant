import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    ScrollView
} from 'react-native';

import { Button, Text } from '@components';
import { scaleSzie } from '@utils';
import Configs from "@configs";
import ICON from "@resources";

class CustomerDetailTab extends React.Component {

    constructor(props) {
        super(props);
    }

    showAppointmentDetail = () =>{
       this.props.showAppointmentDetail()
    }
    render() {
        return (
            <View style={{ flex: 1, padding: scaleSzie(10) }} >
                <View style={{ flex: 1, flexDirection: "row" }} >
                    {/* --------------- Left Content ----------- */}
                    <View style={{ flex: 1, ...styles.SHADOW }} >
                        {/* ------------- Customer Avatar ---------- */}
                        <View style={{ height: scaleSzie(100), alignItems: "center", justifyContent: "flex-end" }} >
                            <View style={{
                                width: scaleSzie(86), height: scaleSzie(86), borderRadius: scaleSzie(43),
                                overflow: "hidden", backgroundColor: "yellow"
                            }} >

                            </View>
                        </View>

                        {/* ------------- Customer Name ---------- */}
                        <Text style={{
                            color: "#404040", fontSize: scaleSzie(14), fontWeight: "600", textAlign: "center",
                            marginVertical: scaleSzie(8)
                        }} >
                            {`Annette Schuster`}
                        </Text>

                        {/* ------------- Customer Status  ---------- */}
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

                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                            {/* ------------- Customer Note  ---------- */}
                            <View style={{
                                flexDirection: "row", paddingRight: scaleSzie(20), alignItems: "center"
                            }} >
                                <View style={{ width: scaleSzie(26) }} >
                                    <Image source={ICON.note_customer} />
                                </View>
                                <Text style={{ color: "#A9A9A9", fontSize: scaleSzie(12) }} >
                                    {`Don't like red`}
                                </Text>
                            </View>

                            {/* ------------- Line  ---------- */}
                            <View style={{ height: scaleSzie(1), backgroundColor: "#EEEEEE", marginVertical: scaleSzie(14) }} />

                            <ItemCustomerInfo
                                icon={ICON.customer_phone}
                                title="515-752-9610"
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_email}
                                title="Sean.Barrows@hotmail.com"
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_gender}
                                title="Female"
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_birthday}
                                title="Jan 21"
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_location}
                                title="864  Brown Avenue - Grover - South Carolina"
                            />
                            <ItemCustomerInfo
                                icon={ICON.customer_ref_phone}
                                title="+1 222 527 1450"
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
                                        {`$  100.00`}
                                    </Text>
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(13) }} >
                                        {`Total sales`}
                                    </Text>
                                </View>
                                {/* --------------- Line ----------- */}
                                <View style={{ width: scaleSzie(1), backgroundColor: "#EEEEEE" }} />
                                <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingVertical: scaleSzie(5), justifyContent: "space-around" }} >
                                    <Text style={{ color: "#404040", fontSize: scaleSzie(20), fontWeight: "bold" }} >
                                        {`$  42.00`}
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}  >
                                        <Text style={{ color: "#404040", fontSize: scaleSzie(13) }} >
                                            {`Last visit sales`}
                                        </Text>

                                        <Text style={{ color: "#404040", fontSize: scaleSzie(13), fontWeight: "300" }} >
                                            {`12/23/2018`}
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
                                                    {`4`}
                                                </Text>
                                                <View style={{ height: scaleSzie(10) }} />
                                                <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                                    {`All bookings`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                                    {`1`}
                                                </Text>
                                                <View style={{ height: scaleSzie(10) }} />
                                                <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                                    {`Upcoming`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                                    {`3`}
                                                </Text>
                                                <View style={{ height: scaleSzie(10) }} />
                                                <Text style={{ color: "#404040", fontSize: scaleSzie(14) }} >
                                                    {`Completed`}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                                <Text style={{ color: "#0764B0", fontWeight: "bold", fontSize: scaleSzie(20) }} >
                                                    {`0`}
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
                                    <Button onPress={this.showAppointmentDetail} style={{
                                        minHeight: scaleSzie(100), flexDirection: "row", paddingVertical: scaleSzie(14),
                                        paddingHorizontal: scaleSzie(10),borderBottomColor:"#EEEEEE",borderBottomWidth:scaleSzie(1),
                                    }} >
                                        <View style={{ width: scaleSzie(55), alignItems: "center" }} >
                                            <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600" }} >
                                                {`8`}
                                            </Text>
                                            <Text style={{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "600" }} >
                                                {`Jan`}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={{ color: "#404040", fontSize: scaleSzie(16), marginBottom: scaleSzie(10),fontWeight:"600" }} >
                                                {`Friday - 10:00 AM`}
                                            </Text>

                                            <Text style={{ color: "#404040", fontSize: scaleSzie(14), marginTop: scaleSzie(12) }} >
                                                {`Move For French- `}
                                                <Text style={{ fontWeight: "300" }} >
                                                    {`with Kerri`}
                                                </Text>
                                            </Text>

                                            <Text style={{ color: "#404040", fontSize: scaleSzie(14), marginTop: scaleSzie(12) }} >
                                                {`Paraffin Wax -`}
                                                <Text style={{ fontWeight: "300" }} >
                                                    {`with Kerri`}
                                                </Text>
                                            </Text>

                                        </View>
                                        <View style={{ width: scaleSzie(125),paddingRight:scaleSzie(12),alignItems:"flex-end",justifyContent:"space-between" }} >
                                            <Text style={{color:"#0764B0",fontSize:scaleSzie(20)}} >
                                                {`Confirmed`}
                                            </Text>
                                            <Text style={{color:"#0764B0",fontSize:scaleSzie(20),fontWeight:"600"}} >
                                                {`$ 60.00`}
                                            </Text>
                                        </View>
                                    </Button>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
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

export default CustomerDetailTab;

