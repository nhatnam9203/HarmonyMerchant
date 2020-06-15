import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import moment from 'moment';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupCalendar } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { ItemSettle, HeaderTableSettle } from './widget';

class Layout extends React.Component {

    renderSearch() {
        const { language } = this.props;
        const { searchFilter } = this.state;
        const { keySearch } = searchFilter;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={localize('Invoice No / SKU number/customer phone number', language)}
                                    value={keySearch}
                                    onChangeText={(value) => {
                                        if (value === '') {
                                            this.props.actions.invoice.clearSearchBatchHistory();
                                        }
                                        this.updateSearchFilterInfo('keySearch', value)
                                    }}
                                    onSubmitEditing={this.searchBatchHistory}
                                />
                            </View>
                            <Button onPress={this.searchBatchHistory} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={IMAGE.search} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>

                        </View>
                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchBatchHistory}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language } = this.props;
        const { searchFilter, titleRangeTime } = this.state;
        const temptColorTextTimeRange = titleRangeTime === 'Time Range' ? 'rgb(155,155,155)' : 'rgb(38,38,38)';
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                            {localize('Filters', language)}
                        </Text>
                    </View>
                    {/* ------------- */}
                    <Button onPress={this.showCalendar} style={{ width: scaleSzie(220) }} >
                        <View style={[{ height: scaleSzie(40), width: '90%', flexDirection: 'row' }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Text style={{ color: temptColorTextTimeRange, fontSize: scaleSzie(15), marginLeft: scaleSzie(10) }} >
                                    {localize(titleRangeTime, language)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(6) }} >
                                <Image source={IMAGE.dropdown} style={{ width: scaleSzie(6), height: scaleSzie(3) }} />
                            </View>
                        </View>
                    </Button>
                </View>
            </View>
        );
    }

    renderLeftContent() {
        const { listBatchHistory, isShowSearchBatchHistory, listBatchHistorySearch, refreshingBatchHistory, language } = this.props;
        const temptData = isShowSearchBatchHistory ? listBatchHistorySearch : listBatchHistory;
        return (
            <View style={{ flex: 1, paddingRight: scaleSzie(10) }} >
                <View style={{ flex: 1 }} >
                    <HeaderTableSettle
                        language={language}
                    />
                    <View style={{ height: scaleSzie(5) }} />
                    <View style={styles.tableLeft} >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={temptData}
                            renderItem={({ item, index }) => <ItemSettle
                                ref={this.pushSettleIntoArray}
                                batchHistory={item}
                                onPress={this.selectSette}
                            />}
                            keyExtractor={(item, index) => `${index}`}
                            refreshing={refreshingBatchHistory}
                            onRefresh={() => this.props.actions.invoice.getBatchHistory(false)}
                        />

                    </View>
                    <View style={{ height: scaleSzie(6) }} />
                </View>
            </View>
        );
    }

    renderTabReport() {
        const { language } = this.props;
        const { settleSelected } = this.state;

        return (
            <View style={{ flex: 1 }} >
                <View style={[styles.tableLeft, { paddingHorizontal: scaleSzie(18) }]} >
                    <View style={{ height: scaleSzie(45), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            {`${localize('Transactions', language)}:`}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(22), fontWeight: 'bold' }} >
                            {settleSelected.settlementId ? settleSelected.settlementId : ''}
                        </Text>
                    </View>
                    {/* ------------ BOX ------------ */}
                    <View style={[styles.tableLeft, { padding: scaleSzie(10) }]} >
                        {/* ---------- Row 1 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >

                                {localize('Payment by Harmony account', language)}
                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${settleSelected.paymentByHarmony ? settleSelected.paymentByHarmony : ''}`}
                            </Text>
                        </View>
                        {/* ---------- Row 2 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >

                                {localize('Payment by Credit card', language)}
                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${settleSelected.paymentByCreditCard ? settleSelected.paymentByCreditCard : ''}`}
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

                                {localize('Payment by Cash', language)}
                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${settleSelected.paymentByCash ? settleSelected.paymentByCash : ''}`}
                            </Text>
                        </View>
                        {/* ---------- Row 4 -------- */}
                        <View style={styles.rowBox} >
                            <Text style={styles.textLeftBox} >

                                {localize('Other payment', language)}
                            </Text>
                            <Text style={styles.textRightBox} >
                                {`$ ${settleSelected.otherPayment ? settleSelected.otherPayment : ''}`}
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: scaleSzie(70), justifyContent: 'center' }} >
                        <View style={{
                            height: scaleSzie(40), backgroundColor: '#307FBF', flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scaleSzie(10)
                        }} >
                            <Text style={{ color: '#fff', fontSize: scaleSzie(14) }} >

                                {localize('Payment by Credit card', language)}
                            </Text>
                            <Text style={{ color: '#fff', fontSize: scaleSzie(20), fontWeight: 'bold' }} >
                                {`$ ${settleSelected.paymentByCreditCard ? settleSelected.paymentByCreditCard : ''}`}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* ---------- Card Transactions Button -------- */}
                <View style={{ height: scaleSzie(6) }} />
                <Button onPress={this.gotoTabCardTransactions} style={[styles.btnLogDetail, { flexDirection: 'row' }]} >
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                        {localize('Card Transactions', language)}
                    </Text>
                    <Image source={IMAGE.arrowLogDetail} />
                </Button>
                {/* ----------  Log Detail Button -------- */}
                <View style={{ height: scaleSzie(6) }} />
                <Button onPress={this.gotoTabDetail} style={[styles.btnLogDetail, { flexDirection: 'row' }]} >
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                        {localize('View Log Detail', language)}
                    </Text>
                    <Image source={IMAGE.arrowLogDetail} />
                </Button>
                <View style={{ height: scaleSzie(6) }} />
            </View>
        );
    }

    renderTabDetail() {
        const { language } = this.props;
        const { settleSelected } = this.state;
        const dateDetail = settleSelected.settlementDate ? `${moment.parseZone(settleSelected.settlementDate).local().format('MM/DD/YYYY h:mm A')}` : '';

        return (
            <View style={{ flex: 1 }} >
                <View style={[styles.tableLeft, { padding: scaleSzie(10) }]} >
                    {/* -------- Header ------ */}
                    <View style={{ flexDirection: 'row' }} >
                        <Button onPress={this.backReport} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                            <Image source={IMAGE.arrowReport} style={{ width: scaleSzie(6), height: scaleSzie(12) }} />
                            <Text style={{ color: '#0764B0', fontSize: scaleSzie(12), marginLeft: scaleSzie(7) }} >

                                {localize('Report', language)}
                            </Text>
                        </Button>
                        <View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >

                                {localize('Log Detail', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                    {/* -------- Content ------ */}
                    <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), marginTop: scaleSzie(20) }} >
                        {/* ------- Item ------ */}
                        <View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                                {dateDetail}
                            </Text>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                                {settleSelected.note ? settleSelected.note : ''}
                            </Text>
                        </View>

                    </View>
                </View>
                <View style={{ height: scaleSzie(6) }} />
            </View>
        );
    }

    renderRightContent() {
        const { language } = this.props;

        return (
            <View style={{ flex: 1, paddingLeft: scaleSzie(10) }} >
                {/* ---------- Header -------- */}
                <View style={{ flexDirection: 'row', height: scaleSzie(30) }} >
                    <View style={{ flex: 0.7, justifyContent: 'flex-end' }} >
                        <Text style={[styles.textTitleLefConten, { marginLeft: scaleSzie(10) }]} >

                            {localize('Settlement', language)}
                        </Text>
                    </View>
                </View>
                {/* ---------- Line -------- */}
                <View style={{ height: scaleSzie(5) }} />
                {/* ---------- Table -------- */}
                <View style={{ flex: 1 }} >
                    <ScrollableTabView
                        ref={this.scrollTabRef}
                        style={{}}
                        initialPage={0}
                        locked={true}
                        renderTabBar={() => <View />}
                    >
                        {this.renderTabReport()}
                        {this.renderTabDetail()}
                    </ScrollableTabView>
                </View>

            </View>
        );
    }

    renderContent() {
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {this.renderLeftContent()}
                    {this.renderRightContent()}
                </View>
            </View>
        );
    }


    render() {
        const { visibleCalendar } = this.state;
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(6) }} />
                {this.renderContent()}
                <PopupCalendar
                    ref={this.modalCalendarRef}
                    visible={visibleCalendar}
                    onRequestClose={() => this.setState({ visibleCalendar: false })}
                    changeTitleTimeRange={this.changeTitleTimeRange}
                    paddingTop={182}
                />
            </View>
        );
    }

}

export default Layout;

