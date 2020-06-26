import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import _ from 'ramda';

import {
    Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, Dropdown, PopupCalendar, PopupEnterPinInvoice,
    PopupConfirmInvoiceStatus, PopupProcessingCredit, PopupInvoicePrint, PopupConfirmPrintInvoice
} from '@components';
import { scaleSzie, localize, formatWithMoment, getStaffNameForInvoice, formatMoney } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    ItemInvoice,
    ItemInfo, ItemButton, ItemBasket, ItemHistory,
} from './widget';

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: scaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: scaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: scaleSzie(16), color: '#0764B0' }} >
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
                                    placeholder={`${localize('Invoice No / SKU Number/Phone Number / Customer Name', language)}`}
                                    value={keySearch}
                                    onChangeText={(keySearch) => this.updateSearchFilterInfo('keySearch', keySearch)}
                                    onSubmitEditing={this.searchInvoiceWithKeyword}
                                />
                            </View>
                            <Button onPress={this.searchInvoiceWithKeyword} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={IMAGE.search} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>

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
                            data={[{ value: '' }, { value: 'HP-Harmony Account' }, { value: 'HP-Credit Card' },
                            { value: 'Credit Card' }, { value: 'Cash' }, { value: 'Cheque/Bank Transfer' }
                            ]}
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
                            data={[{ value: '' }, { value: 'Pending' }, { value: 'Paid' }, { value: 'Void' },
                            { value: 'Refund' }
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
        const { language } = this.props;
        const { invoiceDetail } = this.state;
        const status = invoiceDetail.status ? invoiceDetail.status : '';
        if (status === 'paid') {
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
        } else if (status === 'pending') {
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
        const { language, profile, profileStaffLogin } = this.props;
        const { invoiceDetail } = this.state;
        const basket = invoiceDetail.basket ? this.convertBasket(invoiceDetail.basket) : [];
        // console.log("----- invoiceDetail : ", JSON.stringify(invoiceDetail));
        // console.log("----- basket : ", JSON.stringify(basket));

        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), paddingTop: scaleSzie(8) }} >
                <ScrollView
                    style={{ flex: 1 }}
                    automaticallyAdjustContentInsets={true}
                    keyboardShouldPersistTaps="always"
                >
                    <View
                        ref={this.viewShotRef}
                        style={{
                            paddingHorizontal: scaleSzie(20)
                        }}
                    >
                        {/* ------------- Store Name ----------- */}
                        <Text style={[styles.txt_normal, { fontSize: 24, fontWeight: "600", marginTop: scaleSzie(8) }]} >
                            {profile.businessName ? profile.businessName : ""}
                        </Text>
                        {/* ------------- Store Address ----------- */}
                        <Text numberOfLines={1} style={[styles.txt_normal, { paddingHorizontal: scaleSzie(10), marginTop: scaleSzie(4) }]} >
                            {profile.addressFull ? profile.addressFull : ''}
                        </Text>
                        {/* ------------- Phone Address ----------- */}
                        <Text style={[styles.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                            {`Tel : ${profile.phone ? profile.phone : ""}`}
                        </Text>
                        {/* ------------- Company Website ----------- */}
                        {
                            profile.webLink ? <Text style={[styles.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                                {profile.webLink ? profile.webLink : ""}
                            </Text> : <View />
                        }
                        {/* ------------- SALE/VOID/REFUND  ----------- */}
                        <Text style={[styles.txt_normal, {
                            fontSize: 20, fontWeight: "600",
                            marginTop: scaleSzie(6), marginBottom: scaleSzie(6)
                        }]} >
                            {`SALE`}
                        </Text>
                        {/* ------------- Dot Border  ----------- */}
                        <View style={{ height: scaleSzie(8), marginBottom: scaleSzie(8), }} >
                            <Text style={{ fontWeight: "300" }} >
                                {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                            </Text>
                        </View>

                        {/* ------------- Invoice Date ----------- */}
                        <View style={{ flexDirection: "row" }} >
                            <View style={{ width: scaleSzie(90) }} >
                                <Text style={styles.txt_info} >
                                    {`Invoice Date `}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} >
                                <Text style={styles.txt_info} >
                                    {`: ${invoiceDetail.createdDate ? formatWithMoment(invoiceDetail.createdDate, "MM/DD/YYYY hh:mm A") : ""}`}
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
                                    {`: ${invoiceDetail.checkoutId ? invoiceDetail.checkoutId : ""}`}
                                </Text>
                            </View>
                        </View>

                        {/* ------------- Dot Border  ----------- */}
                        <View style={{ height: scaleSzie(8), marginTop: scaleSzie(4) }} >
                            <Text style={{ fontWeight: "300" }} >
                                {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                            </Text>
                        </View>

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
                        <View style={{ height: scaleSzie(8), marginBottom: scaleSzie(4) }} >
                            <Text style={{ fontWeight: "300" }} >
                                {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                            </Text>
                        </View>

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
                            value={invoiceDetail.subTotal ? invoiceDetail.subTotal : "0.00"}
                        />
                        <ItemTotal
                            title={"Discount"}
                            value={invoiceDetail.discount ? invoiceDetail.discount : "0.00"}
                        />
                        <ItemTotal
                            title={"Tip"}
                            value={invoiceDetail.tipAmount ? invoiceDetail.tipAmount : "0.00"}
                        />
                        <ItemTotal
                            title={"Tax"}
                            value={invoiceDetail.tax ? invoiceDetail.tax : "0.00"}
                        />
                        <ItemTotal
                            title={"Total"}
                            value={invoiceDetail.total ? invoiceDetail.total : "0.00"}
                        />
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
                    <View style={{ height: scaleSzie(60) }} />
                </ScrollView>
            </View>
        );
    }

    renderDetailInvoice_1() {
        const { language } = this.props;
        const { invoiceDetail } = this.state;
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), paddingTop: scaleSzie(8) }} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {/* ------- */}
                    <ItemInfo
                        title={localize('Invoice No', language)}
                        value={invoiceDetail.checkoutId ? `# ${invoiceDetail.checkoutId}` : ''}
                    />
                    <ItemInfo
                        title={localize('Customer Name', language)}
                        value={invoiceDetail.user ? `${invoiceDetail.user.firstName} ${invoiceDetail.user.lastName}` : ''}
                    />
                    <ItemInfo
                        title={localize('Phone Number', language)}
                        value={invoiceDetail.user ? `${invoiceDetail.user.phone}` : ''}
                    />
                    <ItemInfo
                        title={localize('Date', language)}
                        value={invoiceDetail.createdDate ? `${formatWithMoment(invoiceDetail.createdDate, "MM/DD/YYYY")}` : ''}

                    />
                    <ItemInfo
                        title={localize('Time', language)}
                        value={invoiceDetail.createdDate ? `${formatWithMoment(invoiceDetail.createdDate, "hh:mm A")}` : ''}

                    />
                    <ItemInfo
                        title={localize('Status', language)}
                        value={invoiceDetail.status ? invoiceDetail.status : ''}
                    />
                    <ItemInfo
                        title={localize('Payment Method', language)}
                        value={invoiceDetail.paymentMethod ? invoiceDetail.paymentMethod : ''}
                    />
                    <ItemInfo
                        title={localize('Total Amount', language)}
                        value={invoiceDetail.total ? `$ ${invoiceDetail.total}` : ''}
                    />
                    <ItemInfo
                        title={localize('Created By', language)}
                        value={invoiceDetail.createdBy ? invoiceDetail.createdBy : ''}
                    />
                    <ItemInfo
                        title={localize('Modified By', language)}
                        value={invoiceDetail.modifiedBy ? invoiceDetail.modifiedBy : ''}
                    />
                    <View style={{ height: scaleSzie(2) }} />
                    {/* ------- button ------ */}
                    <ItemButton
                        title={'Payment Information'}
                        onPress={this.gotoTabPaymentInfomation}
                    />
                    <ItemButton
                        title={'Basket'}
                        onPress={this.gotoBasket}
                    />
                    <ItemButton
                        title={'History'}
                        onPress={this.gotoHistory}
                    />

                    {/* ------- button void  ------ */}
                    {this.renderButtonVoid()}
                    <View style={{ height: scaleSzie(70) }} />
                </ScrollView>


            </View>
        );
    }



    renderCardInfo() {
        const { language } = this.props;
        const { invoiceDetail } = this.state;
        const temptInvoiceDetail = invoiceDetail.checkoutPayments ? invoiceDetail.checkoutPayments : [];
        return (
            <View style={{ flex: 1 }} >
                {
                    temptInvoiceDetail.map((payment, index) => <View key={`payment_${index}`} >
                        <View style={{ height: scaleSzie(16) }} />

                        <ItemInfo
                            title={localize('Payment Method', language)}
                            value={payment.paymentMethod && payment.paymentMethod ? payment.paymentMethod : ''}
                        />
                        <ItemInfo
                            title={localize('Amount', language)}
                            value={payment.amount && payment.amount ? `$ ${payment.amount}` : '$0.00'}
                        />
                        <ItemInfo
                            title={localize('Status', language)}
                            value={payment.status && payment.status ? payment.status : ''}
                        />
                        <ItemInfo
                            title={localize('Date Time', language)}
                            value={payment.createdDate && payment.createdDate ? `${formatWithMoment(payment.createdDate, 'MM/DD/YYYY hh:mm A')}` : ''}
                        />
                        {
                            payment.paymentInformation ? <>
                                <ItemInfo
                                    title={localize('CC type', language)}
                                    value={payment.paymentInformation && payment.paymentInformation.type ? payment.paymentInformation.type : ''}
                                />
                                <ItemInfo
                                    title={localize('CC number', language)}
                                    value={payment.paymentInformation && payment.paymentInformation.number ? `xxxx xxxx xxxx ${payment.paymentInformation.number}` : ''}
                                />
                                <ItemInfo
                                    title={localize('CC exp', language)}
                                    value={payment.paymentInformation && payment.paymentInformation.exp ? payment.paymentInformation.exp : ''}
                                />
                            </> : <View />
                        }

                        {/* ------------ Line ----------- */}
                        <View style={{ height: 1, marginTop: scaleSzie(10), paddingHorizontal: scaleSzie(30) }} >
                            <View style={{ flex: 1, backgroundColor: "rgba(64,64,64,0.3)" }} />
                        </View>

                    </View>)
                }
            </View>
        );

    }

    renderPaymentInfomation() {
        const { language } = this.props;
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

                            {localize('Payment Information', language)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
                {/* ----------- Body --------- */}
                {this.renderCardInfo()}

            </View>
        );
    }

    renderBasket() {
        const { language } = this.props;
        const { invoiceDetail } = this.state;
        const basket = invoiceDetail.basket ? this.convertBasket(invoiceDetail.basket) : [];
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

                            {localize('Basket', language)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
                {/* ----------- Body --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            {
                                basket.map((item, index) => <ItemBasket
                                    key={index}
                                    item={item}
                                />)
                            }
                        </ScrollView>
                    </View>


                    {/* ----------- Payment Number --------- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                        <View style={{ flex: 1 }} />

                        <View style={{ flex: 1.3, paddingRight: scaleSzie(12) }} >
                            {/* ---------- Price ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Subtotal', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${!_.isEmpty(invoiceDetail) && invoiceDetail && invoiceDetail.subTotal ? `${invoiceDetail.subTotal}` : '0.00'}`}
                                </Text>
                            </View>
                            {/* ---------- Tip ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Tip', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${invoiceDetail.tipAmount ? `${invoiceDetail.tipAmount}` : '0.00'}`}
                                </Text>
                            </View>
                            {/* ---------- Tax ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Tax', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${invoiceDetail.tax ? `${invoiceDetail.tax}` : '0.00'}`}
                                </Text>
                            </View>
                            {/* ---------- Discount ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Discount', language)}:`}

                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${invoiceDetail.discount ? `${invoiceDetail.discount}` : '0.00'}`}
                                </Text>
                            </View>
                            {/* ---------- Total ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Total', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)', fontSize: scaleSzie(16) }]} >
                                    {`$ ${invoiceDetail.total ? `${invoiceDetail.total}` : '0.00'}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* -------- */}
                    <View style={{ height: scaleSzie(10) }} />
                </View>
            </View>
        );
    }

    renderHistoryInvoice() {
        const { language } = this.props;
        const { invoiceDetail } = this.state;
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
                    {
                        invoiceDetail.history.map((item, index) => <ItemHistory
                            key={index}
                            data={item}
                        />)
                    }
                </View>
            </View>
        );
    }

    renderInvoice() {
        const { language, listInvoicesByMerchant, refreshListInvoice,
            listInvoicesSearch, isShowSearchInvoice, isLoadMoreInvoiceList
        } = this.props;
        const {invoiceDetail} = this.state;
        // const tempData = isShowSearchInvoice ? listInvoicesSearch : listInvoicesByMerchant;

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
                        <FlatList
                            data={listInvoicesByMerchant}
                            renderItem={({ item, index }) => <ItemInvoice
                                ref={this.setListInvoiceRef}
                                invoice={item}
                                onPress={() => this.setInvoiceDetail(item)}
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
                            onEndReachedThreshold={0.5}
                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            removeClippedSubviews={true}
                            initialNumToRender={20}
                            maxToRenderPerBatch={5}
                            ListFooterComponent={() => <View style={{ height: scaleSzie(30), alignItems: "center", justifyContent: "center" }} >
                                {
                                    isLoadMoreInvoiceList ? <ActivityIndicator
                                        size="large"
                                        color="#0764B0"
                                    /> : null
                                }
                            </View>}
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
                            {this.renderPaymentInfomation()}
                            {this.renderBasket()}
                            {this.renderHistoryInvoice()}
                        </ScrollableTabView>
                    </View>

                    {
                        invoiceDetail.checkoutId ?  <Button onPress={this.shareCustomerInvoice} style={{
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
                        invoiceDetail.checkoutId ? <Button onPress={this.printCustomerInvoice} style={{
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
        const { language, navigation, visibleConfirmPrintInvoice } = this.props;
        const { visibleCalendar, isFocus, visibleConfirmInvoiceStatus, transactionId, visiblePrintInvoice } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
                activeScreen={isFocus}
                navigation={navigation}
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

                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
                <PopupCalendar
                    ref={this.modalCalendarRef}
                    visible={visibleCalendar}
                    onRequestClose={() => this.setState({ visibleCalendar: false })}
                    changeTitleTimeRange={this.changeTitleTimeRange}
                />
                <PopupEnterPinInvoice
                    ref={this.visibleEnterPinRef}
                    title={localize('Input PIN Number', language)}
                    onRequestClose={this.closePopupEnterPinInvoice}
                />
                <PopupConfirmInvoiceStatus
                    ref={this.confirmInvoiceStatusRef}
                    visible={visibleConfirmInvoiceStatus}
                    title={localize('Confirmation', language)}
                    confirmChangeInvoiceStatus={this.confirmChangeInvoiceStatus}
                    onRequestClose={() => this.setState({ visibleConfirmInvoiceStatus: false })}
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

    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(3) }} >
            <View style={{ flex: 0.8, justifyContent: "center" }} >
                <Text style={[styles.txt_info,]} >
                    {`${index + 1}. ${item.data && item.data.name ? item.data.name : ""}`}
                </Text>
            </View>
            <View style={{ justifyContent: "center", width: scaleSzie(70) }} >
                <Text style={[styles.txt_info,]} >
                    {`$ ${price}`}
                </Text>
            </View>
            <View style={{
                width: scaleSzie(30), justifyContent: "center", alignItems: "center",
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