import React from 'react';
import {
    View,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Platform,
    VirtualizedList
} from 'react-native';
import _ from 'ramda';
import Dash from 'react-native-dash';

import {
    Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, Dropdown, PopupCalendar, PopupCheckStaffPermission,
    PopupConfirmInvoiceStatus, PopupProcessingCredit, PopupInvoicePrint, PopupConfirmPrintInvoice, ClearTextInputIcon,
    ScrollableTabView
} from '@components';
import { scaleSzie, localize, formatWithMoment, getStaffNameForInvoice, formatMoney, getPaymentString, PAYMENT_METHODS } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    ItemInvoice, ItemButton, ItemHistory,
} from './widget';
import configs from "@configs";

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0', fontWeight: "600" }} >
                    {localize('Invoice', language)}
                </Text>
            </View>
        );
    }

    renderSearch() {
        const { language } = this.props;
        const { searchFilter } = this.state;
        const { keySearch } = searchFilter;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                    placeholder={`${localize('Invoice No /Phone Number/ Customer Name', language)}`}
                                    value={keySearch}
                                    onChangeText={(keySearch) => this.updateSearchFilterInfo('keySearch', keySearch)}
                                    onSubmitEditing={this.searchInvoiceWithKeyword}
                                />
                            </View>

                            {
                                keySearch.length > 0 ? <Button onPress={this.clearSearchText} style={{
                                    width: scaleSzie(35), alignItems: 'center', justifyContent: 'center',

                                }} >
                                    <ClearTextInputIcon />
                                </Button> : null
                            }

                        </View>
                    </View>
                    <View style={{ width: scaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchInvoiceWithKeyword}
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
        const { paymentMethod, status } = searchFilter;
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
                    <Button onPress={this.showCalendar} style={{ width: scaleSzie(180) }} >
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
                    {/* ------------- */}
                    <View style={{ width: scaleSzie(170), marginLeft: scaleSzie(16) }} >
                        <Dropdown
                            label={localize('Payment Method', language)}
                            data={PAYMENT_METHODS}
                            value={paymentMethod}
                            onChangeText={(value) => this.updateSearchFilterInfo('paymentMethod', value)}
                            containerStyle={{
                                backgroundColor: 'rgb(246,246,246)',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1,
                                borderRadius: scaleSzie(4)
                            }}
                        />
                    </View>
                    {/* ------------- */}
                    <View style={{ width: scaleSzie(140), marginLeft: scaleSzie(16) }} >
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
                                borderRadius: scaleSzie(4)
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderButtonVoid() {
        const { language, invoiceDetail } = this.props;
        const status = invoiceDetail?.status || '';

        let isDebitPayment = false;
        const paymentMethod = invoiceDetail?.paymentMethod || "";

        try {
            if (paymentMethod && paymentMethod === "credit_card") {
                const paymentInformation = invoiceDetail?.paymentInformation?.length > 0 || false;
                isDebitPayment = paymentInformation && paymentInformation[0]?.paymentData && `${paymentInformation[0]?.paymentData.transaction_type}`.toUpper() == "CREDIT" ? false : true;
            }
        } catch (error) {
            isDebitPayment = false;
        }


        if (status === 'paid' && !isDebitPayment) {
            return (
                <ButtonCustom
                    width={'100%'}
                    height={50}
                    backgroundColor="#0764B0"
                    title={localize('Refund', language)}
                    textColor="#fff"
                    onPress={this.changeStatustransaction}
                    style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    styleText={{ fontSize: scaleSzie(20), fontWeight: 'bold' }}
                />
            );
        } else if (status === 'complete' && !isDebitPayment) {
            return (
                <ButtonCustom
                    width={'100%'}
                    height={50}
                    backgroundColor="#0764B0"
                    title={localize('VOID', language)}
                    textColor="#fff"
                    onPress={this.changeStatustransaction}
                    style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    styleText={{ fontSize: scaleSzie(20), fontWeight: 'bold' }}
                />
            );
        } else {
            return <View />
        }
    }

    renderDetailInvoice() {
        const { profile, profileStaffLogin, invoiceDetail } = this.props;
        const basket = this.convertBasket(invoiceDetail?.basket || []);
        const checkoutPayments = invoiceDetail?.checkoutPayments?.slice(0).reverse() || [];
        const refundAmount = invoiceDetail?.refundAmount || 0.00;
        const promotionNotes = invoiceDetail?.promotionNotes?.note || "";
        const tempStyle = Platform.OS === "android" ? { paddingHorizontal: scaleSzie(10), backgroundColor: '#FFFFFF' } : { paddingHorizontal: scaleSzie(10) };
        const status = invoiceDetail?.status || '';
        const checkoutId = invoiceDetail?.checkoutId || '';

        return (
            <View style={{ flex: 1 }} >
                <View style={{ flex: 1, paddingHorizontal: scaleSzie(20), paddingTop: scaleSzie(8) }} >
                    <ScrollView
                        style={{ flex: 1 }}
                        automaticallyAdjustContentInsets={true}
                        keyboardShouldPersistTaps="always"
                    >
                        <View
                            ref={this.viewShotRef}
                            style={tempStyle}
                        >
                            {/* ------------- Store Name ----------- */}
                            <Text style={[styles.txt_normal, { fontSize: 24, fontWeight: "600", marginTop: scaleSzie(8) }]} >
                                {profile?.businessName || ""}
                            </Text>
                            {/* ------------- Store Address ----------- */}
                            <Text numberOfLines={1} style={[styles.txt_normal, { paddingHorizontal: scaleSzie(10), marginTop: scaleSzie(4) }]} >
                                {profile?.addressFull || ''}
                            </Text>
                            {/* ------------- Phone Address ----------- */}
                            <Text style={[styles.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                                {`Tel : ${profile?.phone || ""}`}
                            </Text>
                            {/* ------------- Company Website ----------- */}
                            {
                                profile?.webLink ? <Text style={[styles.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                                    {profile?.webLink || ""}
                                </Text> : <View />
                            }
                            {/* ------------- SALE/VOID/REFUND  ----------- */}
                            <Text style={[styles.txt_normal, {
                                fontSize: 20, fontWeight: "600",
                                marginTop: scaleSzie(6), marginBottom: scaleSzie(6)
                            }]} >
                                {`${status && status !== "paid" && status !== "pending" && status !== "complete" ? `${status}`.toUpperCase() : "SALE"}`}
                            </Text>
                            {/* ------------- Dot Border  ----------- */}
                            <Dash
                                style={{ width: "100%", height: 1 }}
                                dashGap={5}
                                dashLength={8}
                                dashThickness={1}
                                style={{ marginBottom: scaleSzie(10) }}
                            />

                            {/* ------------- Invoice Date ----------- */}
                            <View style={{ flexDirection: "row" }} >
                                <View style={{ width: scaleSzie(90) }} >
                                    <Text style={styles.txt_info} >
                                        {`Invoice Date `}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }} >
                                    <Text style={styles.txt_info} >
                                        {`: ${invoiceDetail?.createdDate ? formatWithMoment(invoiceDetail?.createdDate, "MM/DD/YYYY hh:mm A") : ""}`}
                                    </Text>
                                </View>
                            </View>

                            {/* ------------- Staff ----------- */}
                            <View style={{ flexDirection: "row" }} >
                                <View style={{ width: scaleSzie(90) }} >
                                    <Text style={styles.txt_info} >
                                        {`Staff Name`}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }} >
                                    <Text style={styles.txt_info} >
                                        {`: ${getStaffNameForInvoice(profileStaffLogin, basket)}`}
                                    </Text>
                                </View>
                            </View>

                            {/* ------------- Invoice No ----------- */}
                            <View style={{ flexDirection: "row" }} >
                                <View style={{ width: scaleSzie(90) }} >
                                    <Text style={styles.txt_info} >
                                        {`Invoice No`}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }} >
                                    <Text style={styles.txt_info} >
                                       
                                        {
                                            checkoutId ? `: # ${checkoutId}` : ':'
                                        }
                                    </Text>
                                </View>
                            </View>


                            {/* ------------- Dot Border  ----------- */}
                            <Dash
                                style={{ width: "100%", height: 1 }}
                                dashGap={5}
                                dashLength={8}
                                dashThickness={1}
                                style={{ marginBottom: scaleSzie(4), marginTop: scaleSzie(10) }}
                            />

                            {/* ------------- Header  ----------- */}
                            <View style={{ flexDirection: "row", marginTop: scaleSzie(6) }} >
                                <View style={{ flex: 0.8, justifyContent: "center" }} >
                                    <Text style={[styles.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                        {`DESCRIPTION`}
                                    </Text>
                                </View>
                                <View style={{ justifyContent: "center", width: scaleSzie(70) }} >
                                    <Text style={[styles.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                        {`PRICE`}
                                    </Text>
                                </View>
                                <View style={{ width: scaleSzie(30), justifyContent: "center", alignItems: "center" }} >
                                    <Text style={[styles.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                        {`QTY`}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.5, justifyContent: "center", alignItems: "flex-end" }} >
                                    <Text style={[styles.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                        {`TOTAL`}
                                    </Text>
                                </View>
                            </View>

                            {/* ------------- Dot Border  ----------- */}
                            <Dash
                                style={{ width: "100%", height: 1 }}
                                dashGap={5}
                                dashLength={8}
                                dashThickness={1}
                                style={{ marginBottom: scaleSzie(4), marginTop: scaleSzie(10) }}
                            />

                            {/* ------------- Item Invoice   ----------- */}
                            {
                                basket.map((item, index) => <ItemPrintBasket
                                    key={index}
                                    item={item}
                                    index={index}
                                />)
                            }

                            {/* ------------- Line end item invoice   ----------- */}
                            <View
                                style={{ height: 2, backgroundColor: "#000", marginVertical: scaleSzie(10) }}
                            />
                            {/* ------------- SubTotal   ----------- */}
                            <ItemTotal
                                title={"Subtotal"}
                                value={invoiceDetail?.subTotal || "0.00"}
                            />
                            <ItemTotal
                                title={"Discount"}
                                value={invoiceDetail?.discount || "0.00"}
                            />
                            <ItemTotal
                                title={"Tip"}
                                value={invoiceDetail?.tipAmount || "0.00"}
                            />
                            <ItemTotal
                                title={"Tax"}
                                value={invoiceDetail?.tax || "0.00"}
                            />
                            <ItemTotal
                                title={"Total"}
                                value={invoiceDetail?.total || "0.00"}
                            />

                            {
                                < View >
                                    {
                                        checkoutPayments.map((data, index) => <View key={index} style={{ marginBottom: scaleSzie(4) }} >
                                            <View style={{ flexDirection: "row" }} >
                                                <Text style={[styles.txt_total,]} >
                                                    {`- Entry method: ${getPaymentString(data?.paymentMethod)}`}
                                                    {/* ------------ Amount -------------- */}

                                                </Text>
                                                <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }} >
                                                    <Text style={[styles.txt_total, { fontSize: scaleSzie(10) }]} >
                                                        {`$${data?.amount || ""}`}
                                                    </Text>
                                                </View>
                                            </View>
                                            {
                                                data.paymentMethod === "credit_card" || data.paymentMethod === "debit_card" ?
                                                    <View style={{ marginTop: scaleSzie(5) }} >
                                                        <Text style={[styles.txt_total, { fontSize: scaleSzie(10) }]} >
                                                            {` ${data?.paymentInformation?.type || ""}: ***********${data?.paymentInformation?.number || ""}`}
                                                        </Text>
                                                        <Text style={[styles.txt_total, { fontSize: scaleSzie(10) }]} >
                                                            {` ${data?.paymentInformation?.name || ""}`}
                                                        </Text>
                                                        <Text style={[styles.txt_total, { fontSize: scaleSzie(10) }]} >
                                                            {` ${data?.paymentInformation?.sn ? `Terminal ID: ${data?.paymentInformation?.sn}` : ""}`}
                                                        </Text>
                                                        <Text style={[styles.txt_total, { fontSize: scaleSzie(10) }]} >
                                                            {` ${data?.paymentInformation?.refNum ? `Transaction #: ${data?.paymentInformation?.refNum}` : ""}`}
                                                        </Text>
                                                    </View>
                                                    : null
                                            }
                                        </View>)
                                    }
                                </View>
                            }

                            <View style={{ height: scaleSzie(16) }} />
                            {
                                parseFloat(refundAmount) > 0 ? <Text style={{ fontSize: scaleSzie(10), fontWeight: "bold" }} >
                                    {`Change : $ ${invoiceDetail?.refundAmount || 0.00}`}
                                </Text> : null
                            }

                            {
                                promotionNotes ? <Text style={{ fontSize: 16, fontWeight: "bold" }} >
                                    {`Discount note: `}
                                    <Text style={{ fontWeight: "500" }} >
                                        {`${promotionNotes}`}
                                    </Text>
                                </Text> : null
                            }




                            {/* ----------- Thanks , see you again -------- */}
                            <View style={{ height: scaleSzie(20) }} />
                            <Text style={[styles.txt_total, { alignSelf: "center", }]} >
                                {`Thank you !`}
                            </Text>
                            <Text style={[styles.txt_total, { alignSelf: "center", }]} >
                                {`Please come again`}
                            </Text>
                            <View style={{ height: scaleSzie(8) }} />
                            {/* ------------- This is not a bill   ----------- */}
                            <Text style={[styles.txt_total, { fontSize: scaleSzie(10), fontWeight: "300", alignSelf: "center" }]} >
                                {`*********** Customer's Receipt ***********`}
                            </Text>
                        </View>
                        <View style={{ height: scaleSzie(90) }} />
                    </ScrollView>
                </View>

                {/* ------- button void  ------ */}
                <View style={{ marginBottom: scaleSzie(5), paddingHorizontal: scaleSzie(10) }}  >
                    {
                        invoiceDetail?.checkoutId ? <ItemButton
                            title={'History'}
                            onPress={this.gotoHistory}
                        /> : null
                    }
                    {this.renderButtonVoid()}
                </View>
            </View >
        );
    }


    renderHistoryInvoice() {
        const { language, invoiceDetail } = this.props;
        const promotionNotes = invoiceDetail?.promotionNotes?.note || "";
        const history = invoiceDetail?.history || [];

        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), paddingTop: scaleSzie(8) }} >
                {/* ---------------- Header ---------------- */}
                <View style={{ flexDirection: 'row' }} >
                    <View style={{ flex: 1, paddingTop: scaleSzie(2) }} >
                        <Button onPress={this.backTab} style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <Image source={IMAGE.back} style={{
                                width: scaleSzie(7), height: scaleSzie(13),
                                marginRight: scaleSzie(6)
                            }} />
                            <Text style={{ color: '#0764B0', fontSize: scaleSzie(14) }} >
                                {localize('Back', language)}
                            </Text>
                        </Button>

                    </View>
                    <View style={{}} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            {localize('History', language)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
                {/* ----------- Body --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <View style={{ flex: 1 }} >
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' >
                            {
                                history.map((item, index) => <ItemHistory
                                    key={index}
                                    data={item}
                                />)
                            }
                            <View style={{ height: scaleSzie(16) }} />
                            {
                                promotionNotes ? <Text style={{ fontSize: 16, fontWeight: "bold" }} >
                                    {`Discount note: `}
                                    <Text style={{ fontWeight: "500" }} >
                                        {`${promotionNotes}`}
                                    </Text>
                                </Text> : null
                            }

                            <View style={{ height: scaleSzie(16) }} />

                        </ScrollView>
                    </View>

                </View>
            </View>
        );
    }

    renderInvoice() {
        const { language, listInvoicesByMerchant, refreshListInvoice, isLoadMoreInvoiceList, invoiceDetail
        } = this.props;

        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                {/* ---------- Left ------ */}
                <View style={{ flex: 1.4 }}>
                    <View style={{
                        paddingLeft: scaleSzie(12),
                        borderBottomColor: '#C5C5C5', borderBottomWidth: 1, paddingBottom: scaleSzie(6)
                    }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >

                            {localize('Invoice List', language)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        {/* ----- Item Invoice ----- */}
                        <VirtualizedList
                            data={listInvoicesByMerchant}
                            renderItem={({ item, index }) => <ItemInvoice
                                invoice={item}
                                onPress={this.setInvoiceDetail(item)}
                                isSelectedInvoice={item?.checkoutId === invoiceDetail?.checkoutId}
                            />}
                            keyExtractor={(item, index) => `${item.checkoutId}`}
                            onRefresh={this.onRefreshInvoiceList}
                            refreshing={refreshListInvoice}
                            ListEmptyComponent={() => <View style={{ width: '100%', alignItems: 'center', paddingTop: scaleSzie(20) }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                    {localize('List Empty', language)}
                                </Text>
                            </View>}
                            onEndReached={this.loadMoreInvoiceList}
                            onEndReachedThreshold={0.1}
                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            removeClippedSubviews={true}
                            initialNumToRender={10}
                            maxToRenderPerBatch={5}
                            ListFooterComponent={() => <View style={{ height: scaleSzie(30), alignItems: "center", justifyContent: "center" }} >
                                {
                                    isLoadMoreInvoiceList ? <ActivityIndicator
                                        size="large"
                                        color="#0764B0"
                                    /> : null
                                }
                            </View>}

                            getItemCount={this.getItemCount}
                            getItem={this.getItem}
                        />
                    </View>
                </View>
                {/* ---------- Right ------ */}
                <View style={{ flex: 1, }}>
                    <View style={{
                        paddingLeft: scaleSzie(12),
                        borderBottomColor: '#C5C5C5', borderBottomWidth: 1, paddingBottom: scaleSzie(6)
                    }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >

                            {localize('Invoice Detail', language)}
                        </Text>
                    </View>
                    {/* -------- ScrollableTabView ---- */}
                    <View style={{ flex: 1, }} >
                        <ScrollableTabView
                            ref={this.scrollTabInvoiceRef}
                            style={{}}
                            initialPage={0}
                            locked={true}
                            renderTabBar={() => <View />}
                            onChangeTab={(index) => {
                                this.setState({ tabCurrent: index.i })
                            }}
                        >
                            {this.renderDetailInvoice()}
                            {this.renderHistoryInvoice()}
                        </ScrollableTabView>
                    </View>

                    {
                        invoiceDetail?.checkoutId ? <Button onPress={this.shareCustomerInvoice} style={{
                            position: 'absolute', top: scaleSzie(-12), right: scaleSzie(50),
                            width: scaleSzie(35), height: scaleSzie(35), backgroundColor: "#0764B0", justifyContent: "center",
                            alignItems: "center", borderRadius: scaleSzie(4)
                        }} >
                            <Image source={IMAGE.share_icon}
                                style={{ width: scaleSzie(18), height: scaleSzie(18) }}
                            />
                        </Button> : null
                    }

                    {
                        invoiceDetail?.checkoutId ? <Button onPress={this.printCustomerInvoice} style={{
                            position: 'absolute', top: scaleSzie(-12), right: scaleSzie(8),
                            width: scaleSzie(35), height: scaleSzie(35), backgroundColor: "#0764B0", justifyContent: "center",
                            alignItems: "center", borderRadius: scaleSzie(4)
                        }} >
                            <Image source={IMAGE.print_btn}
                                style={{ width: scaleSzie(20), height: scaleSzie(20) }}
                            />
                        </Button> : null
                    }
                </View>
            </View>
        );
    }

    render() {
        const { language, navigation, visibleConfirmPrintInvoice, invoiceTabPermission, profileLoginInvoice } = this.props;
        const { visibleCalendar, isFocus, visibleConfirmInvoiceStatus, transactionId, visiblePrintInvoice } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
                clearIntervalById={this.clearIntervalById}
            >
                <View style={styles.container} >
                    <StatusBarHeader />
                    {this.renderHeader()}
                    <View style={{ height: scaleSzie(18) }} />
                    {this.renderSearch()}
                    <View style={{ height: scaleSzie(16) }} />
                    {this.renderFilter()}
                    <View style={{ height: scaleSzie(18) }} />
                    {this.renderInvoice()}

                    <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
                <PopupCalendar
                    ref={this.modalCalendarRef}
                    visible={visibleCalendar}
                    onRequestClose={() => this.setState({ visibleCalendar: false })}
                    changeTitleTimeRange={this.changeTitleTimeRange}
                />
                <PopupCheckStaffPermission
                    ref={this.checkInvoicePermissionRef}
                    visiblePopupCheckStaffPermission={invoiceTabPermission}
                    title={localize('Input PIN Number', language)}
                    tabName="Invoice"
                    onRequestClose={this.closePopupCheckInvoiceTabPermission}
                />
                <PopupConfirmInvoiceStatus
                    ref={this.confirmInvoiceStatusRef}
                    visible={visibleConfirmInvoiceStatus}
                    title={localize('Confirmation', language)}
                    confirmChangeInvoiceStatus={this.confirmChangeInvoiceStatus}
                    onRequestClose={() => this.setState({ visibleConfirmInvoiceStatus: false })}
                    profileLoginInvoice={profileLoginInvoice}
                />
                <PopupProcessingCredit
                    ref={this.popupProcessingCreditRef}
                    visible={this.state.visibleProcessingCredit}
                    onRequestClose={this.cancelTransaction}
                    language={language}
                    transactionId={transactionId}
                />
                <PopupConfirmPrintInvoice
                    visible={visibleConfirmPrintInvoice}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to print receipt', language)}?`}
                    onRequestClose={this.closePopupConfirmPrintInvoice}
                    confimYes={this.printInvoice}
                    language={language}
                />
                <PopupInvoicePrint
                    ref={this.invoicePrintRef}
                    visiblePrintInvoice={visiblePrintInvoice}
                    onRequestClose={this.cancelInvoicePrint}
                />
            </ParentContainer>
        );
    }
}

const ItemPrintBasket = ({ item, index }) => {
    const price = item.data && item.data.price ? item.data.price : 0;
    const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
    const total = formatMoney(price * quanlitySet);
    const note = item.note ? item.note : "";

    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(3) }} >
            <View style={{ flex: 0.8, justifyContent: "center" }} >
                <Text style={[styles.txt_info,]} >
                    {`${index + 1}. ${item.data && item.data.name ? item.data.name : ""}`}
                </Text>
                {/* ------------ Note -------- */}
                {
                    note ?
                        <Text style={[styles.txt_info, { fontSize: 13, marginLeft: 8 }]} >
                            {`(Note: ${note})`}
                        </Text> : null
                }
            </View>
            <View style={{ justifyContent: "center", width: scaleSzie(70) }} >
                <Text style={[styles.txt_info,]} >
                    {`$ ${price}`}
                </Text>
            </View>
            <View style={{
                width: scaleSzie(30), justifyContent: "center",
                paddingLeft: scaleSzie(6)
            }} >
                <Text style={[styles.txt_info,]} >
                    {quanlitySet}
                </Text>
            </View>
            <View style={{
                flex: 0.5, justifyContent: "center", alignItems: "flex-end",
            }} >
                <Text style={[styles.txt_info,]} >
                    {`$ ${total ? total : ""}`}
                </Text>
            </View>
        </View>
    );
}

const ItemTotal = ({ title, value, style }) => {
    return (
        <View style={{ flexDirection: "row", marginBottom: scaleSzie(4) }} >
            <Text style={[styles.txt_total, { alignSelf: "flex-start", fontWeight: "600" }, style]} >
                {title}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.txt_total, { alignSelf: "flex-end", fontWeight: "400" }, style]} >
                {`$ ${value}`}
            </Text>
        </View>
    );
}