import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    Dimensions
} from 'react-native';
import * as Progress from 'react-native-progress';

import { scaleSzie, localize, formatMoney } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import styles from './style';
import IMAGE from '@resources';

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
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(10) }} >
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
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(10) }} >
                <View style={{ flex: 1 }} >
                </View>
                <View style={{ flexDirection: 'row', height: scaleSzie(55) }} >
                    <View style={{ flex: 1 }} >
                        <ButtonCustom
                            width={'100%'}
                            height={55}
                            backgroundColor="#F1F1F1"
                            title={localize('BACK', language)}
                            textColor="#6A6A6A"
                            onPress={this.backTabFirstSettle}
                            style={{ borderWidth: 0.5, borderColor: '#707070' }}
                            styleText={{ fontSize: scaleSzie(20), fontWeight: 'bold' }}
                        />
                    </View>
                    <View style={{ width: scaleSzie(25) }} />
                    <View style={{ flex: 1, }} >
                        <ButtonCustom
                            width={'100%'}
                            height={55}
                            backgroundColor="#4CD964"
                            title={localize('SETTLE', language)}
                            textColor="#fff"
                            onPress={this.settle}
                            style={{ borderWidth: 0.5, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(20), fontWeight: 'bold' }}
                        />
                    </View>
                </View>
            </View>
        );
    }


    renderOpenBatch() {
        const { language } = this.props;
        const { creditCount, settleTotal } = this.state;
        const { paymentByHarmony, paymentByCreditCard, paymentByCash, otherPayment, total, note } = settleTotal;
        return (
            <View style={{ flex: 1 }} >
                <View style={[styles.tableLeft, { paddingHorizontal: scaleSzie(18) }]} >
                    <View style={{ height: scaleSzie(45), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            {`${localize('Transactions', language)}:`}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(22), fontWeight: 'bold' }} >
                            {creditCount}
                        </Text>
                    </View>
                    {/* ------------ BOX ------------ */}
                    <View style={[styles.tableLeft, { padding: scaleSzie(10) }]} >
                        {/* ---------- Row 1 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >

                                {`${localize('Payment by Harmony account', language)}`}
                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${formatMoney(paymentByHarmony)}`}
                            </Text>
                        </View>
                        {/* ---------- Row 2 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >

                                {`${localize('Payment by Credit card', language)}`}
                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${formatMoney(paymentByCreditCard)}`}
                            </Text>
                        </View>
                        {/* -------- Box Child ------- */}
                        <View style={styles.boxChild} >
                            {/* ---------- Row child 1 -------- */}
                            {/* <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.visaLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View> */}
                            {/* ---------- Row child 2 -------- */}
                            {/* <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.masterCardLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View> */}
                            {/* ---------- Row child 3 -------- */}
                            {/* <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.discoverLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View> */}
                        </View>
                        {/* ---------- Row 3 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >

                                {`${localize('Payment by Cash', language)}`}
                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${formatMoney(paymentByCash)}`}
                            </Text>
                        </View>
                        {/* ---------- Row 4 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                {`${localize('Other Payment', language)}`}

                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${formatMoney(otherPayment)}`}
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: scaleSzie(70), justifyContent: 'center' }} >
                        <View style={{
                            height: scaleSzie(40), backgroundColor: '#307FBF', flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scaleSzie(10)
                        }} >
                            <Text style={{ color: '#fff', fontSize: scaleSzie(14) }} >

                                {`${localize('Payment by Credit card', language)}`}
                            </Text>
                            <Text style={{ color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold' }} >
                                {/* {`$ ${total}`} */}
                                {`$ ${formatMoney(paymentByCreditCard)}`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
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

    render() {
        const { settleWaiting, language } = this.props;
        const { creditAmount, settleTotal, paxErrorMessage } = this.state;
        const { paymentByHarmony, paymentByCreditCard, paymentByCash, otherPayment, total, note } = settleTotal;
        return (
            <View style={[styles.container, { backgroundColor: '#F6F6F6' }]} >
                <View style={{ height: scaleSzie(20) }} />
                <View style={{ paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                    {/* --------- Left --------- */}
                    <View style={{ flex: 1, paddingRight: scaleSzie(30) }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                            {localize('Actual Amount', language)}
                        </Text>
                        {/* ------------ Row 1 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#80C6FF', marginTop: scaleSzie(8), marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >

                                {localize('Payment by Harmony account', language)}
                            </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                                {`$ ${formatMoney(paymentByHarmony)}`}
                            </Text>
                        </View>
                        {/* ------------ Row 2 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#307FBF', marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >

                                {localize('Payment by Credit card', language)}
                            </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                                {`$ ${formatMoney(paymentByCreditCard)}`}
                            </Text>
                        </View>
                        {/* ------------ Row 3 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#205580', marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >

                                {localize('Payment by Cash', language)}
                            </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                                {`$ ${formatMoney(paymentByCash)}`}
                            </Text>
                        </View>
                        {/* ------------ Row 4 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#BBEBFA', marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#6A6A6A' }} >

                                {localize('Other payment', language)}
                            </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#6A6A6A' }} >
                                {`$ ${formatMoney(otherPayment)}`}
                            </Text>
                        </View>
                        {/* -------- Total ------- */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#FAFAFA', marginTop: scaleSzie(10),
                            borderColor: '#4CD964', borderWidth: 1, flexDirection: 'row', paddingHorizontal: scaleSzie(10), alignItems: 'center',
                            justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(20), color: '#0764B0' }} >
                                {`${localize('Total', language)}:`}
                            </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#4CD964', fontWeight: 'bold' }} >
                                {`$ ${formatMoney(total)}`}
                            </Text>
                        </View>
                        {/* -------- Note ------- */}
                        {
                            note === '' ?
                                <View >
                                    <Text style={{ fontSize: scaleSzie(16), color: '#404040', marginTop: scaleSzie(20), marginBottom: scaleSzie(10) }} >
                                    </Text>
                                    <View style={{ height: scaleSzie(60) }} />
                                </View>
                                :
                                <View>
                                    <Text style={{ fontSize: scaleSzie(16), color: '#404040', marginTop: scaleSzie(20), marginBottom: scaleSzie(10) }} >
                                        {`${localize('Note', language)}:`}
                                    </Text>
                                    <View style={{
                                        height: scaleSzie(60), backgroundColor: '#F1F1F1', borderColor: '#C5C5C5', borderWidth: 1,
                                        padding: scaleSzie(10)
                                    }} >
                                        <Text style={{ fontSize: scaleSzie(12), color: '#404040' }} >
                                            {note}
                                        </Text>
                                    </View>
                                </View>
                        }

                    </View>
                    {/* --------- Right --------- */}
                    <View style={{ flex: 1 }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >

                            {localize('Open Batch', language)}
                        </Text>
                        <View style={{
                            flex: 1, backgroundColor: '#fff', marginTop: scaleSzie(8),
                            borderWidth: 1, borderColor: '#C5C5C5'
                        }} >
                            {this.renderOpenBatch()}
                        </View>
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

export default Layout;

