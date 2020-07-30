import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    Dimensions
} from 'react-native';
import * as Progress from 'react-native-progress';

import { scaleSzie, localize, formatMoney, formatNumberFromCurrency } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import styles from './style';

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
            <View style={{ height: scaleSzie(55), flexDirection: 'row', paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(15)}} >
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
        return (
            <View style={{ flex: 1 }} >

            </View>
        );
    }

    renderOpenBatch() {
        return (
            <View style={{ flex: 1, backgroundColor: "red" }} >

            </View>
        );
    }

    render() {
        const { settleWaiting, language } = this.props;
        const { settleTotal, paxErrorMessage } = this.state;
        const { paymentByHarmony, paymentByCreditCard, paymentByCash, otherPayment, total, note } = settleTotal;


        return (
            <View style={[styles.container]} >
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                    {/* --------- Left --------- */}
                    <View style={{ flex: 1, }} >
                        <Text style={styles.txt_top_title} >
                            {localize('Actual Amount', language)}
                        </Text>
                        {this.renderActualAmount()}


                    </View>
                    {/* --------- Column --------- */}
                    <View style={{ width: scaleSzie(25) }} >

                    </View>
                    {/* --------- Right --------- */}
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

export default Layout;

