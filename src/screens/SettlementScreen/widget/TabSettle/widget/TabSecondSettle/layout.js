import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    Dimensions
} from 'react-native';
import * as Progress from 'react-native-progress';
import { NavigationEvents } from 'react-navigation';

import { scaleSzie, localize, } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import styles from './style';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class Layout extends React.Component {

    // ---------- Footer 2 ------
    renderFooter2() {
        return (
            <View style={{ flex: 1, padding: scaleSzie(10) }} >
                <View style={{ alignItems: 'center' }} >
                    <Text style={{ color: '#DB7D2A', fontSize: scaleSzie(16) }} >
                        Batch Settlement Successful
                    </Text>
                </View>
                <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginTop: scaleSzie(10), marginBottom: scaleSzie(4) }} >
                    Open Batch
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
                            Log message
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), }} >
                            - Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), }} >
                            - Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        </Text>
                    </View>
                </View>

            </View>
        );
    }

    // ---------- Footer 3 ------
    renderFooter3() {
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(10) }} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ color: '#4CD964', fontSize: scaleSzie(16) }} >
                        Batch Settlement Successful
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', height: scaleSzie(55) }} >
                    <View style={{ flex: 1 }} >
                        <ButtonCustom
                            width={'100%'}
                            height={55}
                            backgroundColor="#0764B0"
                            title="REVIEW BATCH HISTORY"
                            textColor="#fff"
                            onPress={this.searchCategories}
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
                            title="FINISH"
                            textColor="#fff"
                            onPress={this.searchCategories}
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
                            title="BACK"
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
                            title="SETTLE"
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
        return (
            <View style={{ flex: 1 }} >
                <View style={[styles.tableLeft, { paddingHorizontal: scaleSzie(18) }]} >
                    <View style={{ height: scaleSzie(45), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            Transactions:
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(22), fontWeight: 'bold' }} >
                            24
                        </Text>
                    </View>
                    {/* ------------ BOX ------------ */}
                    <View style={[styles.tableLeft, { padding: scaleSzie(10) }]} >
                        {/* ---------- Row 1 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Payment by Harmony account
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1000
                            </Text>
                        </View>
                        {/* ---------- Row 2 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Payment by Credit card
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1300
                            </Text>
                        </View>
                        {/* -------- Box Child ------- */}
                        <View style={styles.boxChild} >
                            {/* ---------- Row child 1 -------- */}
                            <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.visaLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View>
                            {/* ---------- Row child 2 -------- */}
                            <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.masterCardLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View>
                            {/* ---------- Row child 3 -------- */}
                            <View style={styles.rowBoxChild} >
                                <Image source={IMAGE.discoverLogo} style={styles.boxChildLogo} />
                                <Text style={styles.textBoxChild} >
                                    $ 1300
                                </Text>
                            </View>
                        </View>
                        {/* ---------- Row 3 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Payment by Cash
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1300
                            </Text>
                        </View>
                        {/* ---------- Row 4 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >
                                Other Payment
                            </Text>
                            <Text style={styles.textRightBox} >
                                $ 1300
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: scaleSzie(70), justifyContent: 'center' }} >
                        <View style={{
                            height: scaleSzie(40), backgroundColor: '#307FBF', flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scaleSzie(10)
                        }} >
                            <Text style={{ color: '#fff', fontSize: scaleSzie(14) }} >
                                Payment by Credit card
                        </Text>
                            <Text style={{ color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold' }} >
                                $ 1300
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
        return (
            <View style={[styles.container, { backgroundColor: '#F6F6F6' }]} >
                <NavigationEvents
                    onDidFocus={this.onDidFocus}
                />
                <View style={{ height: scaleSzie(20) }} />
                <View style={{ paddingHorizontal: scaleSzie(10), flexDirection: 'row' }} >
                    {/* --------- Left --------- */}
                    <View style={{ flex: 1, paddingRight: scaleSzie(30) }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                            Actual Amount
                </Text>
                        {/* ------------ Row 1 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#80C6FF', marginTop: scaleSzie(8), marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >
                                Payment by Harmony account
                    </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                                $ 1000
                    </Text>
                        </View>
                        {/* ------------ Row 2 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#307FBF', marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >
                                Payment by Credit card
                    </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                                $ 1000
                    </Text>
                        </View>
                        {/* ------------ Row 3 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#205580', marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#fff' }} >
                                Payment by Cash
                    </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#fff' }} >
                                $ 1000
                    </Text>
                        </View>
                        {/* ------------ Row 4 ------------ */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#BBEBFA', marginBottom: scaleSzie(2),
                            paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(13), color: '#6A6A6A' }} >
                                Other payment
                    </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#6A6A6A' }} >
                                $ 1000
                    </Text>
                        </View>
                        {/* -------- Total ------- */}
                        <View style={{
                            height: scaleSzie(35), backgroundColor: '#FAFAFA', marginTop: scaleSzie(10),
                            borderColor: '#4CD964', borderWidth: 1, flexDirection: 'row', paddingHorizontal: scaleSzie(10), alignItems: 'center',
                            justifyContent: 'space-between'
                        }} >
                            <Text style={{ fontSize: scaleSzie(20), color: '#0764B0' }} >
                                Total:
                        </Text>
                            <Text style={{ fontSize: scaleSzie(20), color: '#4CD964', fontWeight: 'bold' }} >
                                $ 3900
                        </Text>
                        </View>
                        {/* -------- Note ------- */}
                        <Text style={{ fontSize: scaleSzie(16), color: '#404040', marginTop: scaleSzie(20), marginBottom: scaleSzie(10) }} >
                            Note:
                    </Text>
                        <View style={{
                            height: scaleSzie(60), backgroundColor: '#F1F1F1', borderColor: '#C5C5C5', borderWidth: 1,
                            padding: scaleSzie(10)
                        }} >
                            <Text style={{ fontSize: scaleSzie(12), color: '#404040' }} >
                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                industry. Lorem Ipsum has been the industry's
                        </Text>
                        </View>
                    </View>
                    {/* --------- Right --------- */}
                    <View style={{ flex: 1 }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                            Open Batch
                </Text>
                        <View style={{
                            flex: 1, backgroundColor: '#fff', marginTop: scaleSzie(8),
                            borderWidth: 1, borderColor: '#C5C5C5'
                        }} >
                            {this.renderOpenBatch()}
                        </View>
                    </View>
                </View>
                {/* ------------ Footer -------- */}
                {this.renderFooter()}
            </View>
        );
    }

}

export default Layout;

