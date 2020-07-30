import React from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    Image,
    FlatList
} from 'react-native';
import * as Progress from 'react-native-progress';

import { scaleSzie, localize, formatMoney, getCredicardIcon } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import styles from './style';
import ICON from "@resources";

const { width } = Dimensions.get('window');

class Layout extends React.Component {

    // ---------- Footer 2 ------
    renderFooter2() {
        const { language } = this.props;
        const { progress, errorMessage } = this.state;
        return (
            <View style={{ flex: 1, padding: scaleSzie(10) }} >
                <View style={{ alignItems: 'center' }} >
                    <Text style={{ color: '#DB7D2A', fontSize: scaleSzie(16) }} >
                        {progress === 1 ? 'Batch Settlement Successful' : ''}
                    </Text>
                </View>
                <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10), marginBottom: scaleSzie(4) }} >

                    {localize('Open Batch', language)}
                </Text>
                <Progress.Bar
                    progress={this.state.progress}
                    width={width - scaleSzie(20)}
                    height={38}
                    color="#4CD964"
                    borderRadius={10}
                    showsText={true}
                />
                <View style={{ flex: 1, marginTop: scaleSzie(12), flexDirection: 'row' }} >
                    <View style={{ width: scaleSzie(140) }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), }} >

                            {localize('Log message', language)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), }} >
                            {`${errorMessage}`}
                        </Text>
                    </View>
                </View>

            </View>
        );
    }

    // ---------- Footer 3 ------
    renderFooter3() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(55), paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(10) }} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ color: '#4CD964', fontSize: scaleSzie(16) }} >
                        {localize('Batch Settlement Successful', language)}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', height: scaleSzie(55) }} >
                    <View style={{ flex: 1 }} >
                        <ButtonCustom
                            width={'100%'}
                            height={55}
                            backgroundColor="#0764B0"
                            title={localize('REVIEW BATCH HISTORY', language)}
                            textColor="#fff"
                            onPress={this.reviewBatchHistory}
                            style={{ borderWidth: 0.5, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(20), fontWeight: 'bold' }}
                        />
                    </View>
                    <View style={{ width: scaleSzie(25) }} />
                    <View style={{ flex: 1, }} >
                        <ButtonCustom
                            width={'100%'}
                            height={55}
                            backgroundColor="#4CD964"
                            title={localize('FINISH', language)}
                            textColor="#fff"
                            onPress={this.finishBatch}
                            style={{ borderWidth: 0.5, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(20), fontWeight: 'bold' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    // ---------- Footer 1 ------
    renderFooter1() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(55), flexDirection: 'row', paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(15) }} >
                <View style={{ flex: 1, alignItems: "center" }} >
                    <ButtonCustom
                        width={'80%'}
                        height={38}
                        backgroundColor="#F1F1F1"
                        title={localize('BACK', language)}
                        textColor="#404040"
                        onPress={this.backTabFirstSettle}
                        style={{ borderWidth: 0.5, borderColor: '#707070', borderRadius: 6 }}
                        styleText={{ fontSize: scaleSzie(14), fontWeight: '600' }}
                    />
                </View>
                <View style={{ width: scaleSzie(25) }} />
                <View style={{ flex: 1, alignItems: "center" }} >
                    <ButtonCustom
                        width={'80%'}
                        height={38}
                        backgroundColor="#4CD964"
                        title={localize('SETTLE', language)}
                        textColor="#fff"
                        onPress={this.settle}
                        style={{ borderWidth: 0.5, borderColor: '#C5C5C5', borderRadius: 6 }}
                        styleText={{ fontSize: scaleSzie(14), fontWeight: '600' }}
                    />
                </View>
            </View >
        );
    }



    renderFooter() {
        const { numberFooter } = this.state;
        if (numberFooter == 1) {
            return this.renderFooter1();
        } else if (numberFooter == 2) {
            return this.renderFooter2();
        } else {
            return this.renderFooter3();
        }
    }

    renderActualAmount() {
        const { paymentByHarmony, paymentByCreditCard, paymentByCash, otherPayment, discountSettlement, total, note } = this.state.settleTotal;

        return (
            <View style={{ flex: 1 }} >
                <ItemPaymentsReport
                    title="Harmony account"
                    backgroundColor="#054071"
                    value={paymentByHarmony}
                />
                <View style={{ height: 1 }} />
                <ItemPaymentsReport
                    title="Credit card"
                    backgroundColor="#075BA0"
                    value={paymentByCreditCard}
                />
                <View style={{ height: 1 }} />
                <ItemPaymentsReport
                    title="Cash"
                    backgroundColor="#3480BE"
                    value={paymentByCash}
                />
                <View style={{ height: 1 }} />
                <ItemPaymentsReport
                    title="Other"
                    backgroundColor="#BBD4E9"
                    value={otherPayment}
                />
                <View style={{ height: 1 }} />
                <ItemPaymentsReport
                    title="Discount"
                    backgroundColor="#F1F1F1"
                    txtStyle={{
                        color: "#404040",

                    }}
                    value={discountSettlement}
                />
                <View style={{ height: 1 }} />
                <ItemPaymentsReport
                    title="Total"
                    backgroundColor="#DCF7FF"
                    txtStyle={{
                        color: "#4CD964",
                        fontWeight: "bold",
                        fontSize: scaleSzie(12)
                    }}
                    txtTitle={{
                        color: "#404040",
                        fontWeight: "bold"
                    }}
                    value={total}
                />
                <Text style={styles.txt_title_note} >
                    Note
                </Text>
                <View style={styles.box_note} >
                    <ScrollView  >
                        <Text style={styles.txt_note} >
                            {note}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        );
    }

    renderOpenBatch() {
        const { settleWaiting } = this.props;
        const { creditCount } = this.state;
        // const data = settleWaiting.paymentTransaction ? settleWaiting.paymentTransaction : [];
        const data = [{
            transactionId: 123,
            status: "pending",
            createdDate: "2020-06-07",
            checkoutId: "1234, 2726",
            amount: "20,00",
            paymentData: {
                message: "",
                transaction_type: "credit",
                transaction_id: "10284648393",
                card_type: "visa",
                validation_status: "pending",
                card_number: "1927",
                exp_date: "22/05",
                name_on_card: "pan and"
            }
        }]

        return (
            <View style={{ flex: 1, }} >
                <ItemPaymentsReport
                    title="Credit card transactions:"
                    backgroundColor="#0764B0"
                    txtStyle={{
                        color: "#ffff",
                        fontWeight: "bold",

                    }}
                    value={creditCount}
                    isNotMoney={true}
                />
                {/* -------- Header Table --------- */}
                <HeaderOpenBatchTable />
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => <ItemOpenBatchTable data={item} />}
                    keyExtractor={(item, index) => `${item.transactionId}_${index}`}
                />
            </View>
        );
    }

    render() {
        const { language } = this.props;
        const { paxErrorMessage } = this.state;

        return (
            <View style={[styles.container]} >
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                    {/* --------- Actual Amount --------- */}
                    <View style={{ flex: 1, }} >
                        <Text style={styles.txt_top_title} >
                            {localize('Actual Amount', language)}
                        </Text>
                        {this.renderActualAmount()}
                    </View>

                    <View style={{ width: scaleSzie(25) }} />

                    {/* --------- Open Batch --------- */}
                    <View style={{ flex: 1, }} >
                        <Text style={styles.txt_top_title} >
                            {localize('Open Batch', language)}
                        </Text>
                        {this.renderOpenBatch()}
                    </View>
                </View>
                <View style={{ height: scaleSzie(40), alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: scaleSzie(18), color: 'red', fontWeight: 'bold' }} >
                        {paxErrorMessage}
                    </Text>
                </View>
                {/* ------------ Footer -------- */}
                {this.renderFooter()}
            </View>
        );
    }

}

const ItemPaymentsReport = ({ backgroundColor, title, value, txtStyle, txtTitle, isNotMoney }) => {

    return (
        <View style={{
            height: scaleSzie(29),
            flexDirection: "row", backgroundColor: backgroundColor,
            justifyContent: "space-between", alignItems: "center", paddingHorizontal: scaleSzie(12)
        }} >
            <Text style={[styles.txt_item, { color: "#fff", fontWeight: "400" }, txtStyle, txtTitle]} >
                {title}
            </Text>
            {
                isNotMoney ? <Text style={[styles.txt_item, { color: "#fff", fontWeight: "bold" }, txtStyle]} >
                    {value}
                </Text>
                    :
                    <Text style={[styles.txt_item, { color: "#fff", fontWeight: "bold" }, txtStyle]} >
                        {`$ ${value ? formatMoney(value) : '0.00'}`}
                    </Text>
            }
        </View>
    );
}

const HeaderOpenBatchTable = () => {
    return (
        <View style={{
            height: scaleSzie(22), backgroundColor: "#F1F1F1", flexDirection: "row",
            paddingHorizontal: scaleSzie(10)
        }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_open_batch_table} >
                    {`Trans ID`}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_open_batch_table} >
                    {`Invoice`}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_open_batch_table} >
                    {`Payments`}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={styles.txt_header_open_batch_table} >
                    {`Amount`}
                </Text>
            </View>
        </View>
    );
}

const ItemOpenBatchTable = ({data}) => {

    return (
        <View style={{
            height: scaleSzie(22), backgroundColor: "#FAFAFA", flexDirection: "row",
            paddingHorizontal: scaleSzie(10), marginBottom: 1
        }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_item_open_batch_table} >
                    {`# ${data.transactionId ? data.transactionId : "" }`}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_item_open_batch_table} >
                    {`# ${data.checkoutId ? data.checkoutId : "" }`}
                </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }} >
                <Image source={getCredicardIcon(data.paymentData && data.paymentData.card_type  ?data.paymentData.card_type : "" )}
                    style={{ width: scaleSzie(17), height: scaleSzie(12), marginRight: scaleSzie(5) }}
                />
                <Text style={styles.txt_item_open_batch_table} >
                    {`x${data.paymentData && data.paymentData.card_number  ?data.paymentData.card_number : "" }`}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styles.txt_item_open_batch_table, { fontWeight: "bold" }]} >
                    {`$ 160.00`}
                </Text>
            </View>
        </View>
    );
}

export default Layout;

