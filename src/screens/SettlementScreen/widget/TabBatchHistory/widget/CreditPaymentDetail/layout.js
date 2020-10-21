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
        const { paymentTransaction } = this.state;
        const transactionsCount = paymentTransaction.length > 0 ? paymentTransaction.length : "";

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <Text style={[styles.txt_top_title]} >
                    {`Credit Card Transactions:      ${transactionsCount}`}
                </Text>
                <HeaderTable />
                {/* --------- Row Table  ---------- */}
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={paymentTransaction}
                        renderItem={({ item, index }) => <RowTable data={item} />}
                        keyExtractor={(item, index) => `${item.appointmentCode}_${index}`}
                    />
                </View>
            </View>
        );
    }

}


const HeaderTable = () => {
    return (
        <View style={{
            height: scaleSzie(32), backgroundColor: "#F1F1F1", marginTop: scaleSzie(20), flexDirection: "row",
            paddingHorizontal: scaleSzie(10)
        }} >
            {/* --------- Trans ID  ---------- */}
            <View style={{ flex: 1.2, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Trans ID`}
                </Text>
            </View>

            {/* --------- Invoice  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Invoice`}
                </Text>
            </View>

            {/* --------- Payments  ---------- */}
            <View style={{ flex: 1, justifyContent: "center", }} >
                <Text style={styles.txt_header_table} >
                    {`Payments`}
                </Text>
            </View>

            {/* --------- Amount  ---------- */}
            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", }} >
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
            {/* --------- Trans ID  ---------- */}
            <View style={{ flex: 1.2, justifyContent: "center" }} >
                <Text numberOfLines={1} style={styles.txt_row_table} >
                    {`#${data.transactionId ? data.transactionId : ""}`}
                </Text>
            </View>
            {/* --------- Invoice  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`#${data.checkoutId ? data.checkoutId : ""}`}
                </Text>
            </View>
            {/* --------- Payments  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`${formatWithMoment(data.date ? data.date : new Date(), "hh:mm A")}`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 1, justifyContent: "center",alignItems:"flex-end" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                    {`$ ${data.sales ? data.sales : "0.00"}`}
                </Text>
            </View>
        </View>
    );
}

export default Layout;

