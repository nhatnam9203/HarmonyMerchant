import React from 'react';
import {
    View,
    TextInput,
    Image,
    FlatList
} from 'react-native';
import _ from 'ramda';
import LinearGradient from 'react-native-linear-gradient';

import { Button, PopupCalendar, Text, GradientButton } from "@components";
import styles from './style';
import ICON from "@resources";
import { scaleSize, localize, formatWithMoment } from '@utils';
import FilterModal from "../FilterModal";


class Layout extends React.Component {

    render() {
        const { language, orderListOfRetailer } = this.props;
        const { searchKeyword, titleRangeTime, visibleFilterModal, purchansePointSelectedFilter, statusSelectedFilter, visibleCalendar } = this.state;

        return (
            <View style={styles.container} >
                {/* -------------- Row 1 ------------- */}
                <View style={styles.row_search_box} >
                    {/* ------------ Search Input ------------ */}
                    <View style={styles.search_input} >
                        <View style={{ flex: 1, paddingHorizontal: scaleSize(12) }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSize(12) }}
                                placeholder={localize('Search', language)}
                            />
                        </View>
                        <View style={{ width: scaleSize(35), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={ICON.search} />
                        </View>
                    </View>

                    {/* ------------ Search Input ------------ */}
                    <GradientButton
                        colors={["#FFFFFF", "#F1F1F1"]}
                        width={scaleSize(100)}
                        title={localize('Search', language)}
                        textColor="#6A6A6A"
                        height={34}
                        onPress={this.search}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 1 }}
                        styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                    />
                    {/* ------------ New Order Btn ------------ */}
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <GradientButton
                            colors={["#0764B0", "#065596"]}
                            width={scaleSize(100)}
                            title={localize('New Order', language)}
                            textColor="#fff"
                            height={34}
                            onPress={this.handleNewOrder}
                            style={{ borderWidth: 1, borderColor: '#0764B0', borderRadius: scaleSize(4) }}
                            styleText={{ fontSize: scaleSize(12), fontWeight: '600', }}
                        />
                    </View>
                </View>

                {/* -------------- Row 2 ------------- */}
                <View style={[styles.row_search_box, { marginTop: scaleSize(16) }]} >
                    {/* ------------ Calendar Btn ------------ */}
                    <Button onPress={this.showCalendar} style={[styles.search_input, { width: scaleSize(150) }]} >
                        <View style={{ flex: 1, paddingHorizontal: scaleSize(12), justifyContent: "center" }} >
                            <Text style={{ color: "#404040", fontSize: scaleSize(12) }} >
                                {`${titleRangeTime}`}
                            </Text>
                        </View>
                        <View style={{ width: scaleSize(35), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={ICON.order_calendar} />
                        </View>
                    </Button>

                    {/* ------------ Filter Btn ------------ */}
                    <Button onPress={this.showFilterModal} style={[styles.search_input, { width: scaleSize(100) }]} >
                        <View style={{ flex: 1, paddingHorizontal: scaleSize(12), justifyContent: "center" }} >
                            <Text style={{ color: "#404040", fontSize: scaleSize(12) }} >
                                {`Filters`}
                            </Text>
                        </View>
                        <View style={{ width: scaleSize(35), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={ICON.filter}
                            // style={{width:scaleSize(22),hieght:scaleSize(22)}}
                            />
                        </View>
                    </Button>

                    {/* -------------- Filter Value -------------- */}
                    <View style={{ flex: 1, flexDirection: "row" }} >
                        {/* ----------- Purchase Point ---------- */}
                        {
                            purchansePointSelectedFilter !== "All Points" && <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "#0764B0", fontSize: scaleSize(14), fontWeight: "600" }} >
                                    {`Purchase Point: ${purchansePointSelectedFilter}`}
                                </Text>
                                <Button onPress={this.clearPurchansePointFilter} >
                                    <Image source={ICON.clear_order_filter} style={{ width: scaleSize(24), height: scaleSize(24), marginLeft: scaleSize(8) }} />
                                </Button>
                            </View>
                        }

                        {/* ----------- Status ---------- */}
                        {
                            statusSelectedFilter !== "All Status" && <View style={{ flexDirection: "row", alignItems: "center", marginLeft: scaleSize(12) }}>
                                <Text style={{ color: "#0764B0", fontSize: scaleSize(14), fontWeight: "600" }} >
                                    {`Status: ${statusSelectedFilter}`}
                                </Text>
                                <Button onPress={this.clearStatusFilter} >
                                    <Image source={ICON.clear_order_filter} style={{ width: scaleSize(24), height: scaleSize(24), marginLeft: scaleSize(8) }} />
                                </Button>
                            </View>
                        }

                        {/* ----------- Clear All ---------- */}
                        {
                            purchansePointSelectedFilter !== "All Points" || statusSelectedFilter !== "All Status" ? <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }} >
                                <Button onPress={this.clearAllFilter}>
                                    <Text style={{ color: "#FF3B30", fontSize: scaleSize(12), fontWeight: "600" }} >
                                        {"Clear all"}
                                    </Text>
                                </Button>
                            </View> : null
                        }

                    </View>
                </View>

                {/* -------------- Row 2 ------------- */}
                <View style={[styles.row_search_box, {
                    marginTop: scaleSize(20), justifyContent: "flex-end", height: scaleSize(30),
                    marginBottom: scaleSize(10)
                }]} >
                    {/* ------------ Export Btn ------------ */}
                    <LinearGradient
                        colors={["#FFFFFF", "#F1F1F1"]}
                        style={[styles.search_input, { width: scaleSize(100), marginRight: 0 }]} >

                        <View style={{ flex: 1, paddingHorizontal: scaleSize(12), justifyContent: "center" }} >
                            <Text style={{ color: "#0764B0", fontSize: scaleSize(12) }} >
                                {`Export`}
                            </Text>
                        </View>
                        <View style={{ width: scaleSize(35), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={ICON.blue_order_export} />
                        </View>
                    </LinearGradient>

                </View>

                {/* ---------------- Table Header ------------------- */}
                <View style={styles.tbl_header} >
                    <TableHeaderColumn
                        title={"ID"}
                    />
                    <TableHeaderColumn
                        title={"Purchase Point"}
                        style={{ flex: 1.2 }}
                    />
                    <TableHeaderColumn
                        title={"Purchase Date"}
                        style={{ flex: 1.4 }}
                    />
                    <TableHeaderColumn
                        title={"Bill-to Name"}
                        style={{ flex: 1.2 }}
                    />
                    <TableHeaderColumn
                        title={"Ship-to Name"}
                        style={{ flex: 1.2 }}
                    />
                    <TableHeaderColumn
                        title={"Status"}
                        style={{ flex: 1.2 }}
                    />
                    <TableHeaderColumn
                        title={"Grand Total"}
                    />
                </View>

                <FlatList
                    data={orderListOfRetailer}
                    renderItem={({ item, index }) => <Button onPress={this.goToOrderRetailDetail(item)} style={styles.order_item} >
                        <OrderItemColumn
                            value={item?.code}
                        />
                        <OrderItemColumn
                            value={item?.purchasepoint}
                            style={{ flex: 1.2 }}
                        />
                        <OrderItemColumn
                            value={formatWithMoment(item?.createdDate, "MMM DD, YYYY hh:mm A")}
                            style={{ flex: 1.4 }}
                        />
                        <OrderItemColumn
                            value={item?.billptoname}
                            style={{ flex: 1.2 }}
                        />
                        <OrderItemColumn
                            value={item?.shiptoname}
                            style={{ flex: 1.2 }}
                        />
                        <OrderItemColumn
                            value={item?.status}
                            style={{ flex: 1.2 }}
                            isStatus={true}
                        />
                        <OrderItemColumn
                            value={`$ ${item?.total}`}
                            txtStyle={{
                                fontWeight: "600"
                            }}
                        />
                    </Button>}
                    keyExtractor={(item, index) => `${item}_${index}`}
                    onEndReached={this.loadMoreOrderList}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                />

                {/* ---------------- Table Row ------------------- */}
                <FilterModal
                    visible={visibleFilterModal}
                    closeFilterModal={this.closeFilterModal}
                    applyFilter={this.applyFilter}
                    resetFilter={this.resetFilter}
                    setStateFromParent={this.passFilterStateToFilterModal}
                />

                <PopupCalendar
                    ref={this.modalCalendarRef}
                    visible={visibleCalendar}
                    paddingLeft={scaleSize(90)}
                    paddingTop={147}
                    onRequestClose={() => this.setState({ visibleCalendar: false })}
                    changeTitleTimeRange={this.changeTitleTimeRange}

                />
            </View>
        );
    }

}


const TableHeaderColumn = ({ style, title }) => {
    return (
        <View style={[styles.tbl_header_col, style]} >
            <Text style={styles.txt_tbl_header_col} >
                {`${title}`}
            </Text>
        </View>
    );
}

const OrderItemColumn = ({ style, value, txtStyle, isStatus }) => {
    return (
        <View style={[styles.order_item_col, style]} >
            {
                !isStatus ? <Text style={[styles.txt_order_item_col, txtStyle]} >
                    {`${value}`}
                </Text> :
                    <View style={styles.status_box} >
                        <Text style={styles.txt_status} >
                            {`${value}`}
                        </Text>
                    </View>
            }

        </View>
    );
}

export default Layout;

