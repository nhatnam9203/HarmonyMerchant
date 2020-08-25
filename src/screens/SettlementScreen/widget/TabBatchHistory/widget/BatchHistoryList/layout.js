import React from 'react';
import {
    View,
    FlatList,
    Image,
    TextInput,
    ActivityIndicator
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, localize, formatWithMoment } from '@utils';
import {
    Text, Button, PopupCalendar, ButtonCustom
} from '@components';
import styles from "./style";
import ICON from "@resources";

class Layout extends React.Component {

    renderSearch() {
        const { language } = this.props;
        const { keySearch } = this.state;

        return (
            <View style={{ height: scaleSzie(35), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(17), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={localize('Search', language)}
                                    value={keySearch}
                                    onChangeText={(keySearch) => this.setState({keySearch}) }
                                    onSubmitEditing={this.searchBatchHistory}
                                />
                            </View>
                            <Button onPress={this.searchBatchHistory} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={ICON.search} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>

                        </View>
                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={35}
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
        const { titleRangeTime } = this.state;
        const temptColorTextTimeRange = titleRangeTime === 'Time Range' ? 'rgb(155,155,155)' : 'rgb(38,38,38)';

        return (
            <View style={{ height: scaleSzie(35), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(17), color: '#6A6A6A' }} >
                                {localize('Filters', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            {/* ------------- */}
                            <Button onPress={this.showCalendar} style={{ width: scaleSzie(220) }} >
                                <View style={[{ height: scaleSzie(40), width: '90%', flexDirection: 'row' }, styles.borderStyle]} >
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                        <Text style={{ color: temptColorTextTimeRange, fontSize: scaleSzie(15), marginLeft: scaleSzie(10) }} >
                                            {localize(titleRangeTime, language)}
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(6) }} >
                                        <Image source={ICON.dropdown} style={{ width: scaleSzie(6), height: scaleSzie(3) }} />
                                    </View>
                                </View>
                            </Button>
                        </View>
                    </View>
                </View>
                {/* ----------- ICON ----------- */}
                <Button onPress={this.shareBatchHistoryList} style={{
                    position: "absolute", top: scaleSzie(3), right: scaleSzie(10),
                    justifyContent: "center"
                }} >
                    <Image source={ICON.share_batch_history}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button>

                {/* <Button onPress={this.printBatchHistoryList} style={{
                    position: "absolute", top: scaleSzie(3), right: scaleSzie(50),
                    justifyContent: "center"
                }} >
                    <Image source={ICON.print_batch_history}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button> */}
            </View>
        );
    }


    render() {
        const { listBatchHistory, refreshingBatchHistory, isLoadMoreBatchHistoryList } = this.props;
        const { visibleCalendar } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }} >
                <View style={{ height: scaleSzie(15) }} />
                {this.renderSearch()}
                <View style={{ height: scaleSzie(8) }} />
                {this.renderFilter()}

                {/* ---------  Table  ---------- */}
                <HeaderTable />
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={listBatchHistory}
                        renderItem={({ item, index }) => <RowTable
                            data={item}
                            onPress={this.gotoSettlementDetail}
                        />}
                        keyExtractor={(item, index) => `${item.settlementId}_${index}`}
                        style={{ flex: 1, borderColor: "#C5C5C5", borderWidth: 1 }}
                        refreshing={refreshingBatchHistory}
                        onRefresh={this.onRefresBathHistoryList}
                        onEndReached={this.loadMoreBatchHistoryList}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        removeClippedSubviews={true}
                        initialNumToRender={20}
                        maxToRenderPerBatch={5}
                        ListFooterComponent={() => <View style={{ height: scaleSzie(30), alignItems: "center", justifyContent: "center" }} >
                            {
                                isLoadMoreBatchHistoryList ? <ActivityIndicator
                                    size="large"
                                    color="#0764B0"
                                /> : null
                            }
                        </View>}
                    />
                </View>
                <PopupCalendar
                    ref={this.modalCalendarRef}
                    visible={visibleCalendar}
                    onRequestClose={() => this.setState({ visibleCalendar: false })}
                    changeTitleTimeRange={this.changeTitleTimeRange}
                    paddingTop={170}
                />
            </View>
        );
    }

}


const HeaderTable = ({ }) => {
    return (
        <View style={{
            height: scaleSzie(40), marginTop: scaleSzie(20), flexDirection: "row",
            paddingHorizontal: scaleSzie(10)
        }} >
            {/* --------- Batch ID  ---------- */}
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text style={styles.txt_header_table} >
                    {`Batch ID`}
                </Text>
            </View>

            {/* --------- Date  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Date`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={styles.txt_header_table} >
                    {`Time`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={styles.txt_header_table} >
                    {`Amount`}
                </Text>
            </View>
            <View style={{ width: scaleSzie(70) }} >

            </View>
        </View>
    );
}

const RowTable = ({ data, onPress }) => {
    return (
        <Button onPress={() => onPress(data)} style={{
            height: scaleSzie(40), backgroundColor: "#F8F8F8",
            flexDirection: "row", marginBottom: 2,
            borderBottomColor: "#C5C5C5", borderBottomWidth: 1
        }} >
            {/* --------- Batch ID  ---------- */}
            <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                <Text numberOfLines={1} style={styles.txt_row_table} >
                    {`#${data.settlementId ? data.settlementId : ""}`}
                </Text>
            </View>
            {/* --------- Date  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styles.txt_row_table, {}]} >
                    {`${data.settlementDate ? formatWithMoment(data.settlementDate, "MMMM DD, YYYY") : ""}`}
                </Text>
            </View>
            {/* --------- Time  ---------- */}
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "600" }]} >
                    {`${data.settlementDate ? formatWithMoment(data.settlementDate, "hh:mm A") : ""}`}
                </Text>
            </View>
            {/* --------- Amount  ---------- */}
            <View style={{ flex: 2, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styles.txt_row_table, { fontWeight: "800" }]} >
                    {`$ ${data.total ? data.total : "0.00"}`}
                </Text>
            </View>
            <View style={{ width: scaleSzie(60), justifyContent: "center", alignItems: "center" }} >
                <Image source={ICON.staff_invoice} style={{ width: scaleSzie(16), height: scaleSzie(16) }} />
            </View>
        </Button>
    );
}

export default Layout;

