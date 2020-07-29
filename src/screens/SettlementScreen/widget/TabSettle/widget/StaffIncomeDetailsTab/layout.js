import React from 'react';
import {
    View,
    FlatList,
    Image
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, formatMoney, formatWithMoment } from '@utils';
import {
    Text, Button, Dropdown
} from '@components';
import styles from "./style";
import ICON from "@resources";

class Layout extends React.Component {

    render() {
        const { staffSalesDetail, staffName, total } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <Text style={[styles.txt_top_title]} >
                    {"Staff income details"}
                </Text>

                {/* --------- Dropdown ---------- */}
                <View style={{
                    height: scaleSzie(35), width: scaleSzie(180),
                    marginLeft: scaleSzie(10), marginTop: scaleSzie(20)
                }} >
                    <Dropdown
                        label={""}
                        data={this.getDataDropdownStaffSalesList()}
                        value={staffName}
                        onChangeText={this.onChangeStaff}
                        containerStyle={{
                            backgroundColor: '#fff',
                            borderWidth: 2,
                            borderColor: '#CCCCCC',
                            flex: 1,
                            borderRadius: 4
                        }}
                    />
                </View>
                <HeaderTable />
                {/* --------- Row Table  ---------- */}
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={staffSalesDetail}
                        renderItem={({ item, index }) => <RowTable data={item} />}
                        keyExtractor={(item, index) => `${item.appointmentCode}_${index}`}
                    />
                </View>
                {/* --------- Footer Table  ---------- */}
                <View style={{
                    height: scaleSzie(40), backgroundColor: "#0764B0", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                    paddingHorizontal: scaleSzie(10)
                }} >
                    <Text style={[styles.txt_header_table, { color: "#fff" }]} >
                        {`Total`}
                    </Text>
                    <Text style={[styles.txt_header_table, { color: "#fff", fontWeight: "bold" }]} >
                        {`$ ${formatMoney(total)}`}
                    </Text>
                </View>


                <Button onPress={this.backHomeTab} style={{
                    position: 'absolute', top: 0, right: 0,
                    width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                }} >
                    <Image source={ICON.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                </Button>

            </View>
        );
    }

}


const HeaderTable = ({ }) => {
    return (
        <View style={{
            height: scaleSzie(32), backgroundColor: "#F1F1F1", marginTop: scaleSzie(20), flexDirection: "row",
            paddingHorizontal: scaleSzie(10)
        }} >
            {/* --------- Services / Products  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Services / Products`}
                </Text>
            </View>
            {/* --------- Appointment ID  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Appointment ID`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 0.5, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Time`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 0.8, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={styles.txt_header_table} >
                    {`Amount`}
                </Text>
            </View>
        </View>
    );
}

const RowTable = ({ data }) => {
    return (
        <View style={{
            height: scaleSzie(35), backgroundColor: "#FAFAFA", flexDirection: "row", paddingHorizontal: scaleSzie(10), marginBottom: 2
        }} >
            {/* --------- Services / Products  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`${data.name ? data.name : ""}`}
                </Text>
            </View>
            {/* --------- Appointment ID  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`#${data.appointmentCode ? data.appointmentCode : ""}`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 0.5, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`${formatWithMoment(data.date ? data.date : new Date(), "MM/DD/YYYY hh:mm A")}`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 0.8, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                    {`$ ${data.amount ? data.amount : "0.00"}`}
                </Text>
            </View>
        </View>
    );
}

export default Layout;

