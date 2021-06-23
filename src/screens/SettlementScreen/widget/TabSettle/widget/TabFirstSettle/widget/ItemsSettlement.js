import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import _, { prop } from 'ramda';
import { TextInputMask } from 'react-native-masked-text';

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
             {/* ---------- SMS -------- */}
            <View style={{width:ScaleSzie(30)}} />
        </View>
    );
}

export const StaffsItem = ({ staff, onPress ,sendTotalViaSMS}) => {

    return (
        <Button onPress={() => onPress(staff.staffId ? staff.staffId : 0)} style={{
            height: ScaleSzie(32), borderBottomColor: "#DDDDDD", borderBottomWidth: 1,
            flexDirection: "row", backgroundColor: "#FAFAFA"
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1, paddingLeft: ScaleSzie(13) }, styles.container]} >
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
                <Image source={ICON.staff_invoice} style={{ marginRight: ScaleSzie(8) }} />
            </View>
            {/* ---------- SMS -------- */}
            <Button onPress={() => sendTotalViaSMS(staff)} style={{width:ScaleSzie(30),justifyContent:"center",alignItems:"center"}} >
                <Image source={ICON.sms_logo} 
                // style={{height:ScaleSzie(15),width:ScaleSzie(15)}} 
                />
            </Button>
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
            {/* ---------- SMS -------- */}
            <View style={{width:ScaleSzie(30)}} />
        </Button>
    );
}

export const TotalItem = ({ total }) => {

    return (
        <View style={{
            height: ScaleSzie(35),
            flexDirection: "row", backgroundColor: "#DCF7FF",paddingHorizontal: ScaleSzie(13)
        }} >
            {/* ---------- Name -------- */}
            <View style={[{ flex: 1 }, styles.container]} >
                <Text style={[styles.txt_item, { fontWeight: "600", color: "#404040", fontSize: ScaleSzie(14) }]} >
                    {"Total"}
                </Text>
            </View>
            {/* ---------- Total Sales -------- */}
            <View style={[{ flex: 0.8, justifyContent: "center",alignItems:"flex-end" }]} >
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

    constructor(props) {
        super(props);
        this.state = {
            amount: 0
        }

    }

    setStateFromParent = async (amount) => {
        await this.setState({
            amount
        })
    }

    render() {
        const { backgroundColor, title, txtStyle, value, isShowEditIcon, editAmount, isEdit, onFocus, cancelEditAmount, saveEditAmount,
            initValue, isChange
        } = this.props;
        const { amount } = this.state;

        return (
            <View style={{
                height: ScaleSzie(29),
                flexDirection: "row", backgroundColor: backgroundColor
            }} >
                <View style={{ justifyContent: "center" }} >
                    <Text style={[styles.txt_item, { marginLeft: ScaleSzie(15), color: "#fff", fontWeight: "400" }, txtStyle]} >
                        {title}
                    </Text>
                </View>
                {
                    isEdit ? <View style={{ flex: 1, flexDirection: "row", }} >
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                            <Button
                                onPress={() => cancelEditAmount()}
                                style={{ marginRight: ScaleSzie(12) }} >
                                <Image source={ICON.cancel_edit_amount} />
                            </Button>
                        </View>
                        <View style={{ minWidth: ScaleSzie(60), justifyContent: "center" }} >
                            <View style={{
                                height: ScaleSzie(20), backgroundColor: "#fff", borderRadius: 4,
                                paddingHorizontal: ScaleSzie(5)
                            }} >
                                <TextInputMask
                                    type={'money'}
                                    options={{
                                        precision: 2,
                                        separator: '.',
                                        delimiter: ',',
                                        unit: '',
                                        suffixUnit: ''
                                    }}
                                    style={{ flex: 1, fontSize: ScaleSzie(12), textAlign: "right",
                                padding:0,color:"#000"
                                }}
                                    placeholder="$ 0.00"
                                    value={amount}
                                    onChangeText={amount => this.setState({ amount })}
                                    onFocus={() => onFocus(92)}
                                    autoFocus={true}
                                />
                            </View>
                        </View>
                        <View style={{ width: ScaleSzie(45), justifyContent: "center" }} >
                            <Button
                                onPress={() => saveEditAmount()}
                                style={{ marginLeft: ScaleSzie(12) }} >
                                <Image source={ICON.save_edit_amount} />
                            </Button>
                        </View>
                    </View>
                        :
                        <View style={{ flex: 1, flexDirection: "row" }} >
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                                <Text style={[styles.txt_item, { color: "#fff", fontWeight: "bold" }, txtStyle]} >
                                    {`$ ${value ? formatMoney(value) : '0.00'}`}
                                </Text>
                                {
                                    isChange && initValue != value ? <Text style={{
                                        color: "#FFFFFF", fontWeight: "500", textDecorationLine: "line-through",
                                        fontSize: ScaleSzie(8)
                                    }} >
                                        {`   $ ${initValue} `}
                                    </Text> : null
                                }

                            </View>
                            <View style={{ width: ScaleSzie(45), justifyContent: "center" }} >
                                {
                                    isShowEditIcon ?
                                        <Button
                                            onPress={() => editAmount()}
                                            style={{ marginLeft: ScaleSzie(12) }} >
                                            <Image source={ICON.edit_amount} />
                                        </Button>
                                        : null
                                }
                            </View>
                        </View>
                }
            </View>
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