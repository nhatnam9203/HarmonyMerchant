import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';

import { scaleSize, localize, } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupCalendar, ClearTextInputIcon } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { ItemTransaction, HeaderTableTransaction } from './widget';

class Layout extends React.Component {

    renderSearch() {
        const { language } = this.props;
        const { searchFilter } = this.state;
        const { keySearch } = searchFilter;
        return (
            <View style={{ height: scaleSize(40), paddingHorizontal: scaleSize(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSize(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSize(18), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSize(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSize(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSize(18) }}
                                    placeholder={localize('Invoice/SKU/Customer Phone/Batch/Last 4-Digits', language)}
                                    value={keySearch}
                                    onChangeText={(value) => this.updateSearchFilterInfo('keySearch', value)}
                                    onSubmitEditing={this.searchTransactions}
                                />
                            </View>
                            {
                                keySearch.length > 0 ? <Button onPress={this.clearSearchText} style={{
                                    width: scaleSize(35), alignItems: 'center', justifyContent: 'center',

                                }} >
                                    <ClearTextInputIcon />
                                </Button> : null
                            }

                        </View>
                    </View>
                    <View style={{ width: scaleSize(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchTransactions}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSize(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language } = this.props;
        const { searchFilter, titleRangeTime } = this.state;
        const { status } = searchFilter;
        const temptColorTextTimeRange = titleRangeTime === 'Time Range' ? 'rgb(155,155,155)' : 'rgb(38,38,38)';
        return (
            <View style={{ height: scaleSize(40), paddingHorizontal: scaleSize(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ width: scaleSize(70), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSize(18), color: '#6A6A6A' }} >
                            {localize('Filters', language)}
                        </Text>
                    </View>
                    {/* ------------- */}
                    <Button onPress={this.showCalendar} style={{ width: scaleSize(220) }} >
                        <View style={[{ height: scaleSize(40), width: '90%', flexDirection: 'row' }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Text style={{ color: temptColorTextTimeRange, fontSize: scaleSize(15), marginLeft: scaleSize(10) }} >
                                    {localize(titleRangeTime, language)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSize(6) }} >
                                <Image source={IMAGE.dropdown} style={{ width: scaleSize(6), height: scaleSize(3) }} />
                            </View>
                        </View>
                    </Button>
                    {/* ------------- */}
                    <View style={{ width: scaleSize(170) }} >
                        <Dropdown
                            label={localize('Status', language)}
                            data={[{ value: '' }, { value: 'Complete' }, { value: 'Pending' }, { value: 'Paid' }, { value: 'Void' },
                            { value: 'Refund' }, { value: 'Cancel' }
                            ]}
                            value={status}
                            onChangeText={(value) => this.updateSearchFilterInfo('status', value)}
                            containerStyle={{
                                backgroundColor: 'rgb(246,246,246)',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1,
                                borderRadius: scaleSize(4)
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }


    renderContent() {
        const { transactionsSettlement, listTransactionSearch, isShowSearchTransaction,
            refreshingTransaction, language, isLoadMoreTransSettlement
        } = this.props;
        const tempData = isShowSearchTransaction ? listTransactionSearch : transactionsSettlement;
        return (
            <View style={styles.contentContainer} >
                <HeaderTableTransaction
                    language={language}
                />
                <View style={{ height: scaleSize(6) }} />
                {/* ---------- Table ------- */}
                <View style={styles.tableContainer} >
                    <FlatList
                        data={tempData}
                        renderItem={({ item, index }) => <ItemTransaction data={item} />}
                        keyExtractor={(item, index) => `${index}`}
                        refreshing={refreshingTransaction}
                        onRefresh={() => this.searchTransactions(1, false)}

                        onEndReached={this.loadMoreSettlement}
                        onEndReachedThreshold={0.1}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        removeClippedSubviews={true}
                        initialNumToRender={20}
                        maxToRenderPerBatch={5}
                        ListFooterComponent={() => <View style={{ height: scaleSize(30), alignItems: "center", justifyContent: "center" }} >
                            {
                                isLoadMoreTransSettlement ? <ActivityIndicator
                                    size="large"
                                    color="#0764B0"
                                /> : null
                            }
                        </View>}
                    />

                </View>
                <View style={{ height: scaleSize(6) }} />
            </View>
        );
    }

    render() {
        const { visibleCalendar } = this.state;
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSize(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSize(6) }} />
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

