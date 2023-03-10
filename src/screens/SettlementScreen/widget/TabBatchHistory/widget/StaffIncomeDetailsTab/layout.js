import React from 'react';
import {
    View,
    FlatList,
    Image
} from 'react-native';
import _ from 'ramda';

import { scaleSize, formatMoney, formatWithMoment } from '@utils';
import {
    Text, Button, Dropdown
} from '@components';
import styles from "./style";
import ICON from "@resources";

class Layout extends React.Component {

    render() {
        const { staffSalesDetail, staffName, total, sales, tax, tip } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <Text style={[styles.txt_top_title]} >
                    {"Staff Income Details"}
                </Text>

                {/* --------- Dropdown ---------- */}
                <View style={{
                    height: scaleSize(35), width: scaleSize(180),
                    marginLeft: scaleSize(10), marginTop: scaleSize(20)
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
                    height: scaleSize(40), backgroundColor: "#0764B0", flexDirection: "row", paddingHorizontal: scaleSize(10)
                }} >
                    <View style={{ flex: 1, justifyContent: "center" }} >
                        <Text style={[styles.txt_header_table, { color: "#fff" }]} >
                            {`Total`}
                        </Text>
                    </View>
                    <View style={{ flex: 0.8 }} />
                    <View style={{ flex: 0.6 }} />
                    <View style={{ flex: 0.6, justifyContent: "center" }} >
                        <Text style={[styles.txt_header_table, { color: "#fff", fontWeight: "bold" }]} >
                            {`$ ${formatMoney(sales)}`}
                        </Text>
                    </View>
                    <View style={{ flex: 0.6, justifyContent: "center" }} >
                        <Text style={[styles.txt_header_table, { color: "#fff", fontWeight: "bold" }]} >
                            {`$ ${formatMoney(tax)}`}
                        </Text>
                    </View>
                    <View style={{ flex: 0.6, justifyContent: "center" }} >
                        <Text style={[styles.txt_header_table, { color: "#fff", fontWeight: "bold" }]} >
                            {`$ ${formatMoney(tip)}`}
                        </Text>
                    </View>
                    <View style={{ flex: 0.7, justifyContent: "center", alignItems: "flex-end" }} >
                        <Text style={[styles.txt_header_table, { color: "#fff", fontWeight: "bold" }]} >
                            {`$ ${formatMoney(total)}`}
                        </Text>
                    </View>

                </View>
            </View>
        );
    }

}


const HeaderTable = () => {
    return (
        <View style={{
            height: scaleSize(32), backgroundColor: "#F1F1F1", marginTop: scaleSize(20), flexDirection: "row",
            paddingHorizontal: scaleSize(10)
        }} >
            {/* --------- Services / Products  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Services/ Products`}
                </Text>
            </View>
            {/* --------- Appointment ID  ---------- */}
            <View style={{ flex: 0.8, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Appointment ID`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Time`}
                </Text>
            </View>
            {/* --------- Sales  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Sales`}
                </Text>
            </View>
            {/* --------- Tax  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Tax`}
                </Text>
            </View>
            {/* --------- Tip  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Tip`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 0.7, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={styles.txt_header_table} >
                    {`Total Sales`}
                </Text>
            </View>
        </View>
    );
}

const RowTable = ({ data }) => {
    return (
        <View style={{
            height: scaleSize(35), backgroundColor: "#FAFAFA", flexDirection: "row", paddingHorizontal: scaleSize(10), marginBottom: 2
        }} >
            {/* --------- Services / Products  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text numberOfLines={1} style={styles.txt_row_table} >
                    {`${data.name ? data.name : ""}`}
                </Text>
            </View>
            {/* --------- Appointment ID  ---------- */}
            <View style={{ flex: 0.8, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`# ${data.appointmentCode ? data.appointmentCode : ""}`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`${formatWithMoment(data.date ? data.date : new Date(), "hh:mm A")}`}
                </Text>
            </View>
            {/* --------- Sales  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                    {`$ ${data.sales ? data.sales : "0.00"}`}
                </Text>
            </View>
            {/* --------- Tax  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                    {`$ ${data.tax ? data.tax : "0.00"}`}
                </Text>
            </View>
            {/* --------- Tip  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                    {`$ ${data.tip ? data.tip : "0.00"}`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 0.7, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                    {`$ ${data.total ? data.total : "0.00"}`}
                </Text>
            </View>
        </View>
    );
}

export default Layout;

