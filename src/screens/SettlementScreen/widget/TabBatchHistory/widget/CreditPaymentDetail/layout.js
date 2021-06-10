import React from 'react';
import {
    View,
    FlatList,
    Image
} from 'react-native';
import _ from 'ramda';

import { scaleSize, formatMoney, formatWithMoment, getCredicardIcon } from '@utils';
import {
    Text
} from '@components';
import styles from "./style";

class Layout extends React.Component {

    render() {
        const {creditBatchDetailById} = this.props;
        const transactionsCount = creditBatchDetailById?.paymentTransaction?.length || 0;

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <Text style={[styles.txt_top_title]} >
                    {`Credit Card Transactions:      ${transactionsCount}`}
                </Text>
                <HeaderTable />
                {/* --------- Row Table  ---------- */}
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={creditBatchDetailById?.paymentTransaction || []}
                        renderItem={({ item, index }) => <RowTable data={item} />}
                        keyExtractor={(item, index) => `${item.appointmentCode}_${index}`}
                    />
                </View>
                {/* --------- Footer Table  ---------- */}
                <View style={{
                    height: scaleSize(32),  backgroundColor: "#0764B0", marginTop: scaleSize(20), flexDirection: "row",
                    paddingHorizontal: scaleSize(10)
                }} >
                    <View style={{ flex: 1.2, justifyContent: "center", }} >
                        <Text style={[styles.txt_header_table,{color:"#fff"}]} >
                            {`Total`}
                        </Text>
                    </View>

                    <View style={{ flex: 1}} />
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", }} >
                        <Text style={[styles.txt_header_table,,{color:"#fff"}]} >
                            {`$ ${creditBatchDetailById?.paymentByCreditCard || '0.00'}`}
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
            {/* --------- Payments  ---------- */}
            <View style={{ flex: 0.5, justifyContent: "center", }} >
                <Text style={styles.txt_header_table} >
                    {`Status`}
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
    const creditCardLogo = getCredicardIcon(data.paymentData && data.paymentData.card_type ? `${data.paymentData.card_type}`.toLowerCase() : "");
    const cardNumber =  data?.paymentData?.card_number || "";

    return (
        <View style={{
            height: scaleSize(35), backgroundColor: "#FAFAFA", flexDirection: "row", paddingHorizontal: scaleSize(10), marginBottom: 2
        }} >
            {/* --------- Trans ID  ---------- */}
            <View style={{ flex: 1.2, justifyContent: "center" }} >
                <Text numberOfLines={1} style={styles.txt_row_table} >
                    {`#${data?.transactionId || ""}`}
                </Text>
            </View>
            {/* --------- Invoice  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`#${data?.checkoutId || ""}`}
                </Text>
            </View>
            {/* --------- Payments  ---------- */}
            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                <Image source={creditCardLogo} style={{ width: scaleSize(30), height: scaleSize(20) }} />
                <View style={{ width: 10 }} />
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSize(12)
                }} >
                    {cardNumber}
                </Text>
            </View>
             {/* --------- Invoice  ---------- */}
             <View style={{ flex: 0.5, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`${data?.status || ""}`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                    {`$ ${data?.amount || "0.00"}`}
                </Text>
            </View>
        </View>
    );
}

export default Layout;

