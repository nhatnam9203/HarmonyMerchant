import React from 'react';
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import _ from 'ramda';

import { ScaleSzie, } from '@utils';
import {
    Text,
    Button
} from '@components';
import ICON from "@resources";
import { formatMoney } from '@utils';

export const StaffsHeaderTable = () => {
    return (
        <View style={{
            height: ScaleSzie(30), backgroundColor: "#F1F1F1", borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
            flexDirection: "row"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: ScaleSzie(13) }, styles.container]} >
                <Text style={styles.txt_normal} >
                    {`Name`}
                </Text>
            </View>
            {/* ---------- Sales -------- */}
            <View style={[{ flex: 0.6 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    {`Sales`}
                </Text>
            </View>
            {/* ---------- Tax -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    {`Tax`}
                </Text>
            </View>
            {/* ---------- Tip -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    {`Tip`}
                </Text>
            </View>
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8 }, styles.container]} >
                <Text style={styles.txt_normal} >
                    {`Total Sales`}
                </Text>
            </View>
        </View>
    );
}

export const StaffsItem = ({ staff, onPress }) => {

    return (
        <Button onPress={() => onPress(staff?.staffId || 0)} style={{
            height: ScaleSzie(32), borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
            flexDirection: "row", backgroundColor: "#FAFAFA"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: ScaleSzie(13) }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "500" }]} >
                    {staff?.name || ""}
                </Text>
            </View>
            {/* ---------- Sales -------- */}
            <View style={[{ flex: 0.6 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "300" }]} >
                    {`$  ${staff?.sales || 0.00}`}

                </Text>
            </View>
            {/* ---------- Tax -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "300" }]} >
                    {`$  ${staff?.tax || 0.00}`}
                </Text>
            </View>
            {/* ---------- Tip -------- */}
            <View style={[{ flex: 0.5 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "300" }]} >
                    {`$  ${staff?.tip || 0.00}`}
                </Text>
            </View>
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]} >
                <Text style={[styles.txt_item, { fontWeight: "600" }]} >
                    {`$  ${staff?.total || 0.00}`}
                </Text>
                <Image source={ICON.staff_invoice} style={{ marginRight: ScaleSzie(8) }} />
            </View>
        </Button>
    );
}

export const GiftCardItem = ({ total, onPress }) => {

    return (
        <Button onPress={() => onPress()} style={{
            height: ScaleSzie(32), borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
            flexDirection: "row", backgroundColor: "#FAFAFA"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: ScaleSzie(13) }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "500", color: "#0764B0" }]} >
                    {`Gift Card Sold`}
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
                    {`$  ${total ? total : 0.00}`}
                </Text>
                <Image source={ICON.staff_invoice_blue} style={{ marginRight: ScaleSzie(8) }} />
            </View>
        </Button>
    );
}

export const TotalItem = ({ total }) => {

    return (
        <View style={{
            height: ScaleSzie(35),
            flexDirection: "row", backgroundColor: "#DCF7FF", paddingHorizontal: ScaleSzie(13)
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "600", color: "#404040", fontSize: ScaleSzie(14) }]} >
                    {"Total"}
                </Text>
            </View>
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8, justifyContent: "center", alignItems: "flex-end" }]} >
                <Text style={[styles.txt_item, { fontWeight: "600", color: "#4CD964", fontSize: ScaleSzie(14) }]} >
                    {`$  ${total ? total : 0.00}`}
                </Text>
            </View>
        </View>
    );
}

export const HeaderPaymentsReport = ({ total }) => {

    return (
        <View style={{
            height: ScaleSzie(33),
            flexDirection: "row", backgroundColor: "#F1F1F1"
        }} >
            <View style={{ justifyContent: "center" }} >
                <Text style={[styles.txt_normal, { marginLeft: ScaleSzie(15) }]} >
                    {`Payments`}
                </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", }} >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                    <Text style={styles.txt_normal} >
                        {`Amount`}
                    </Text>
                </View>
                <View style={{ width: ScaleSzie(45) }} >

                </View>
            </View>
        </View>
    );
}

export default class ItemPaymentsReport extends React.Component {

    onPress = () => {
        if (this.props.activeOpacity) {
            this.props.onPress();
        }
    }

    render() {
        const { backgroundColor, title, txtStyle, value,
            isChange, amountStatistic, titStyle, activeOpacity
        } = this.props;
        const tempActiveOpacity = activeOpacity ? 0.5 : 1;

        return (
            <TouchableOpacity
                activeOpacity={tempActiveOpacity}
                onPress={this.onPress}
                style={{
                    height: ScaleSzie(29),
                    flexDirection: "row", backgroundColor: backgroundColor
                }} >
                <View style={{ justifyContent: "center" }} >
                    <Text style={[styles.txt_item, { marginLeft: ScaleSzie(15), color: "#fff", fontWeight: "400" }, txtStyle, titStyle]} >
                        {title}
                    </Text>
                </View>
                {
                    <View style={{ flex: 1, flexDirection: "row" }} >
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                            <Text style={[styles.txt_item, { color: "#fff", fontWeight: "bold" }, txtStyle]} >
                                {`$ ${value ? formatMoney(value) : '0.00'}`}
                            </Text>
                            {
                                isChange && amountStatistic != value ?
                                    <Text style={{
                                        color: "#FFFFFF", fontWeight: "500", textDecorationLine: "line-through",
                                        fontSize: ScaleSzie(8)
                                    }} >
                                        {`   $ ${amountStatistic} `}
                                    </Text> : null
                            }

                        </View>
                        <View style={{ width: ScaleSzie(45), justifyContent: "center" }} />
                    </View>
                }
            </TouchableOpacity>
        );
    }

}





const styles = ({
    container: {
        justifyContent: "center"
    },
    txt_normal: {
        color: "#404040",
        fontSize: ScaleSzie(12),
        fontWeight: "500"
    },
    txt_item: {
        color: "#404040",
        fontSize: ScaleSzie(10),
    }

})