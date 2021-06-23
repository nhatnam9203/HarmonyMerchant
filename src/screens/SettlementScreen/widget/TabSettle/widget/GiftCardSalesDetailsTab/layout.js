import React from 'react';
import {
    View,
    FlatList,
    Image
} from 'react-native';
import _ from 'ramda';

import { ScaleSzie, formatMoney, formatWithMoment ,formatNumberFromCurrency} from '@utils';
import {
    Text, Button, Dropdown
} from '@components';
import styles from "./style";
import ICON from "@resources";

class Layout extends React.Component {

    render() {
        const {giftCardType } = this.state;
        const {gitfCardSales} = this.props;

        let giftCardTotal = 0
        if (gitfCardSales.length > 0) {
            gitfCardSales.forEach(giftCard => {
                giftCardTotal = parseFloat(giftCardTotal) + parseFloat(formatNumberFromCurrency(giftCard.total ? giftCard.total : 0.00));
            });
        }
        const data = this.getDataGiftCardSales();

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <Text style={[styles.txt_top_title]} >
                    {"Gift Card Sold Statistics"}
                </Text>

                {/* --------- Dropdown ---------- */}
                <View style={{
                    height: ScaleSzie(35), width: ScaleSzie(180),
                    marginLeft: ScaleSzie(10), marginTop: ScaleSzie(20)
                }} >
                    <Dropdown
                        label={""}
                        data={this.getDataDropdownGiftCardSalesList()}
                        value={giftCardType}
                        onChangeText={this.onChangeGiftCardType}
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
                        data={data}
                        renderItem={({ item, index }) => <RowTable data={item} />}
                        keyExtractor={(item, index) => `${item.appointmentCode}_${index}`}
                    />
                </View>
                {/* --------- Footer Table  ---------- */}
                <View style={{
                    height: ScaleSzie(40), backgroundColor: "#0764B0", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                    paddingHorizontal: ScaleSzie(10)
                }} >
                    <Text style={[styles.txt_header_table, { color: "#fff" }]} >
                        {`Total`}
                    </Text>
                    <Text style={[styles.txt_header_table, { color: "#fff", fontWeight: "bold" }]} >
                        {`$ ${formatMoney(giftCardTotal)}`}
                    </Text>
                </View>
            </View>
        );
    }

}


const HeaderTable = () => {
    return (
        <View style={{
            height: ScaleSzie(32), backgroundColor: "#F1F1F1", marginTop: ScaleSzie(20), flexDirection: "row",
            paddingHorizontal: ScaleSzie(10)
        }} >
            <View style={{ flex: 0.9, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Date/ time`}
                </Text>
            </View>
            <View style={{ flex: 0.8, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Type`}
                </Text>
            </View>
            <View style={{ flex: 0.5, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Value`}
                </Text>
            </View>
             <View style={{ flex: 0.3, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Qty`}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
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
            height: ScaleSzie(35), backgroundColor: "#FAFAFA", flexDirection: "row", paddingHorizontal: ScaleSzie(10), marginBottom: 2
        }} >
            <View style={{ flex: 0.9, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`${data.dateString ? data.dateString : ""}`}
                </Text>
            </View>
            <View style={{ flex: 0.8, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`${data.name ? data.name : ""}`}
                </Text>
            </View>
            <View style={{ flex: 0.5, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`$ ${data.price ? data.price : ""}`}
                </Text>
            </View>
            <View style={{ flex: 0.3, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                {`${data.quantity ? data.quantity : ""}`}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "bold" }]} >
                {`$ ${data.total ? data.total : ""}`}
                </Text>
            </View>
        </View>
    );
}

export default Layout;

