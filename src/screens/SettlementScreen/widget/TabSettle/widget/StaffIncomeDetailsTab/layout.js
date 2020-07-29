import React from 'react';
import {
    View,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions,
    RefreshControl,
} from 'react-native';
import _, { T } from 'ramda';

import { scaleSzie, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber, formatWithMoment } from '@utils';
import {
    Text, ButtonCustom, Dropdown
} from '@components';
import TextInputAmount from './widget/TextInputAmount';
import ItemStaff from './widget/ItemStaff';
import TotalCustom from './widget/TotalCustom';
import styles from "./style";
import { StaffsHeaderTable, StaffsItem, GiftCardItem, TotalItem, HeaderPaymentsReport, ItemPaymentsReport } from "./widget/ItemsSettlement";

const { height } = Dimensions.get('window');

class Layout extends React.Component {

    render() {
        const { } = this.props

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
                        data={[{ value: '' }, { value: 'HP-Harmony Account' }, { value: 'HP-Credit Card' },
                        { value: 'Credit Card' }, { value: 'Cash' }, { value: 'Cheque/Bank Transfer' }
                        ]}
                        value={""}
                        onChangeText={(value) => { }}
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
                    <RowTable />
                    <RowTable />
                    <RowTable />
                    <RowTable />
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
                        {`$ 200.00`}
                    </Text>
                </View>

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

const RowTable = ({ }) => {
    return (
        <View style={{
            height: scaleSzie(37), backgroundColor: "#FAFAFA", flexDirection: "row",paddingHorizontal: scaleSzie(10),marginBottom:2
        }} >
            {/* --------- Services / Products  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`Signature Mani & Pedi `}
                </Text>
            </View>
            {/* --------- Appointment ID  ---------- */}
            <View style={{ flex: 0.6, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`#1212`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 0.5, justifyContent: "center" }} >
                <Text style={styles.txt_row_table} >
                    {`07:10 AM`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 0.8, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={styles.txt_row_table} >
                    {`$ 15.00`}
                </Text>
            </View>
        </View>
    );
}

export default Layout;

