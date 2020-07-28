import React from 'react';
import {
    View,
    Image
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, } from '@utils';
import {
    Text,
} from '@components';
import ICON from "@resources";

export const StaffsHeaderTable = () => {
    return (
        <View style={{
            height: scaleSzie(35), backgroundColor: "#F1F1F1", borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
            flexDirection: "row"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: scaleSzie(13) }, styles.container]} >
                <Text style={styles.txt_normal} >
                    Name
                </Text>
            </View>
            {/* ---------- Sales -------- */}
            <View style={[{ flex: 0.6 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    Sales
                </Text>
            </View>
            {/* ---------- Tax -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    Tax
                </Text>
            </View>
            {/* ---------- Tip -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    Tip
                </Text>
            </View>
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    Total sales
                </Text>
            </View>
        </View>
    );
}

export const StaffsItem = ({ staff }) => {

    return (
        <View style={{
            height: scaleSzie(32), borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
            flexDirection: "row", backgroundColor: "#FAFAFA"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: scaleSzie(13) }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "500" }]} >
                    {staff.name ? staff.name : ""}
                </Text>
            </View>
            {/* ---------- Sales -------- */}
            <View style={[{ flex: 0.6 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "300" }]} >
                    {`$  ${staff.sales ? staff.sales : 0.00}`}

                </Text>
            </View>
            {/* ---------- Tax -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "300" }]} >
                    {`$  ${staff.tax ? staff.tax : 0.00}`}
                </Text>
            </View>
            {/* ---------- Tip -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "300" }]} >
                    {`$  ${staff.tip ? staff.tip : 0.00}`}
                </Text>
            </View>
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]} >
                <Text style={[styles.txt_item, { fontWeight: "600" }]} >
                    {`$  ${staff.total ? staff.total : 0.00}`}
                </Text>
                <Image source={ICON.staff_invoice} style={{ marginRight: scaleSzie(8) }} />
            </View>
        </View>
    );
}

export const GiftCardItem = ({ giftCard }) => {

    return (
        <View style={{
            height: scaleSzie(32), borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
            flexDirection: "row", backgroundColor: "#FAFAFA"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: scaleSzie(13) }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "500", color: "#0764B0" }]} >
                    {giftCard.name ? giftCard.name : ""}
                </Text>
            </View>
            {/* ---------- Sales -------- */}
            <View style={[{ flex: 0.6 }, styles.container]} />
            {/* ---------- Tax -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} />
            {/* ---------- Tip -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} />
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]} >
                <Text style={[styles.txt_item, { fontWeight: "600", color: "#0764B0" }]} >
                    {`$  ${giftCard.total ? giftCard.total : 0.00}`}
                </Text>
                <Image source={ICON.staff_invoice_blue} style={{ marginRight: scaleSzie(8) }} />
            </View>
        </View>
    );
}

export const TotalItem = ({ total }) => {

    return (
        <View style={{
            height: scaleSzie(35),
            flexDirection: "row", backgroundColor: "#DCF7FF"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: scaleSzie(13) }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "600", color: "#404040" ,fontSize:scaleSzie(14)}]} >
                    {"Total"}
                </Text>
            </View>
            {/* ---------- Sales -------- */}
            <View style={[{ flex: 0.6 }, styles.container]} />
            {/* ---------- Tax -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} />
            {/* ---------- Tip -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} />
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8, justifyContent: "center" }]} >
                <Text style={[styles.txt_item, { fontWeight: "600", color: "#4CD964" ,fontSize:scaleSzie(14)}]} >
                    {`$  ${total ? total : 0.00}`}
                </Text>
                {/* <Image source={ICON.staff_invoice_blue} style={{ marginRight: scaleSzie(8) }} /> */}
            </View>
        </View>
    );
}


const styles = ({
    container: {
        justifyContent: "center"
    },
    txt_normal: {
        color: "#404040",
        fontSize: scaleSzie(12),
        fontWeight: "500"
    },
    txt_item: {
        color: "#404040",
        fontSize: scaleSzie(10),

    }

})