import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import moment from 'moment';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, Dropdown } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    ItemInvoice, ItemInfo, ItemButton, ItemBasket, ItemHistory, PopupCalendar
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
        const { keySearch } = this.state;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(14) }}
                                    placeholder={`${localize('Invoice No / SKU number/Phone number / Customer Name', language)}`}
                                    value={keySearch}
                                    onChangeText={(keySearch) => {
                                        if (keySearch == '') {
                                            this.props.actions.customer.clearSearCustomer();
                                        }
                                        this.setState({ keySearch })
                                    }}
                                    onSubmitEditing={this.searchCustomer}
                                />
                            </View>
                            <Button onPress={this.searchCustomer} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
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
                            onPress={this.searchCustomer}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                    <View style={{ width: scaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Scan SKU', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchCustomer}
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
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                            {localize('Filters', language)}
                        </Text>
                    </View>
                    {/* ------------- */}
                    <View style={{ width: scaleSzie(180) }} >
                        <Dropdown
                            label={localize('Time Range', language)}
                            data={[{ value: '' }, { value: 'Product' }, { value: 'Service' }]}
                            // value={category}
                            // onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
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
                    <View style={{ width: scaleSzie(170), marginLeft: scaleSzie(16) }} >
                        <Dropdown
                            label={localize('Payment Method', language)}
                            data={[{ value: '' }, { value: 'HP-Harmony Account' }, { value: 'HP-Credit Card' },
                            { value: 'Credit Card' }, { value: 'Cash' }, { value: 'Cheque/Bank Transfer' }
                            ]}
                            // value={category}
                            // onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
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
                            label={localize('Statuses', language)}
                            data={[{ value: '' }, { value: 'Pending' }, { value: 'Paid' }, { value: 'Voided' },
                            { value: 'Refunded' }
                            ]}
                            // value={category}
                            // onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
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

    renderDetailInvoice() {
        const { language } = this.props;
        const { invoiceDetail } = this.state;
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10), paddingTop: scaleSzie(8) }} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    {/* ------- */}
                    <ItemInfo
                        title={localize('Invoice No', language)}
                        value={invoiceDetail.checkoutId ? `# ${invoiceDetail.checkoutId}` : ''}
                    />
                    <ItemInfo
                        title={localize('Customer name', language)}
                        value={invoiceDetail.user ? `${invoiceDetail.user.firstName} ${invoiceDetail.user.lastName}` : ''}
                    />
                    <ItemInfo
                        title={localize('Phone Number', language)}
                        value={invoiceDetail.user ? `${invoiceDetail.user.phone}` : ''}
                    />
                    <ItemInfo
                        title={localize('Date', language)}
                        value={invoiceDetail.createdDate ? `${moment(invoiceDetail.createdDate).format('DD/MM/YYYY')}` : ''}
                    />
                    <ItemInfo
                        title={localize('Time', language)}
                        value={invoiceDetail.createdDate ? `${moment(invoiceDetail.createdDate).format('h:mm a')}` : ''}
                    />
                    <ItemInfo
                        title={localize('Status', language)}
                        value={invoiceDetail.status ? invoiceDetail.status : ''}
                    />
                    <ItemInfo
                        title={localize('Payment method', language)}
                        value={invoiceDetail.paymentMethod ? invoiceDetail.paymentMethod : ''}
                    />
                    <ItemInfo
                        title={localize('Total amount', language)}
                        value={invoiceDetail.total ? `$ ${invoiceDetail.total}` : ''}
                    />
                    <ItemInfo
                        title={localize('Created by', language)}
                        value={''}
                    />
                    <ItemInfo
                        title={localize('Modified by', language)}
                        value={''}
                    />
                    {/* ------- button ------ */}
                    <ItemButton
                        title={'Payment information'}
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

                    <ButtonCustom
                        width={'100%'}
                        height={50}
                        backgroundColor="#F1F1F1"
                        title={localize('VOID', language)}
                        textColor="#6A6A6A"
                        onPress={this.searchCustomer}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                    />
                    <View style={{ height: scaleSzie(70) }} />
                </ScrollView>


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
                                Back
                        </Text>
                        </Button>

                    </View>
                    <View style={{}} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            Payment information
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
                {/* ----------- Body --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ height: scaleSzie(16) }} />
                    {/* <ItemInfo
                        title={localize('Payment method', language)}
                        value={'Credit Card'}
                    />
                    <ItemInfo
                        title={localize('CC type', language)}
                        value={'Visa/Master'}
                    />
                    <ItemInfo
                        title={localize('CC number', language)}
                        value={'xxxx xxxx xxxx 0001'}
                    />
                    <ItemInfo
                        title={localize('CC exp', language)}
                        value={'01/22'}
                    /> */}
                </View>
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
                                Back
                        </Text>
                        </Button>

                    </View>
                    <View style={{}} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            Basket
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
                {/* ----------- Body --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ height: scaleSzie(16) }} />
                    <View style={{ flex: 1}} >
                        <ScrollView showsVerticalScrollIndicator={false} >
                            {
                                basket.map((item,index) =><ItemBasket 
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
                                    {`$ ${invoiceDetail.total ? invoiceDetail.total : 0}`}
                                </Text>
                            </View>
                            {/* ---------- Tax ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Tax', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    $0
                            </Text>
                            </View>
                            {/* ---------- Discount ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Discount', language)}:`}

                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    $0
                            </Text>
                            </View>
                            {/* ---------- Total ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Total', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)', fontSize: scaleSzie(16) }]} >
                                    {`$ ${invoiceDetail.total ? invoiceDetail.total : 0}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* -------- */}
                    {/* ----------- Button Reefund --------- */}
                    <ButtonCustom
                        width={'100%'}
                        height={55}
                        backgroundColor="#F1F1F1"
                        title={localize('REFUND', language)}
                        textColor="#6A6A6A"
                        onPress={this.searchCustomer}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(16), fontWeight: 'bold' }}
                    />
                    <View style={{ height: scaleSzie(10) }} />
                </View>
            </View>
        );
    }

    renderHistoryInvoice() {
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
                                Back
                        </Text>
                        </Button>

                    </View>
                    <View style={{}} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
                            History
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
                {/* ----------- Body --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ height: scaleSzie(16) }} />
                    {/* <ItemHistory />
                    <ItemHistory /> */}
                </View>
            </View>
        );
    }

    renderInvoice() {
        const { language, listInvoicesByMerchant } = this.props;
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                {/* ---------- Left ------ */}
                <View style={{ flex: 1.4 }}>
                    <View style={{
                        paddingLeft: scaleSzie(12),
                        borderBottomColor: '#C5C5C5', borderBottomWidth: 1, paddingBottom: scaleSzie(6)
                    }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                            Invoice List
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
                            Invoice Detail
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
                </View>
            </View>
        );
    }

    render() {
        const { language, stateCity } = this.props;
        const { visibleCalendar } = this.state;
        return (
            <ParentContainer
                handleLockScreen={this.handleLockScreen}
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

                    <Button onPress={this.showLockScreen} style={{
                        position: 'absolute', top: 20, right: 0,
                        width: scaleSzie(34), height: scaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                    }} >
                        <Image source={IMAGE.arrowRight} style={{ width: scaleSzie(22), height: scaleSzie(17) }} />
                    </Button>
                </View>
                <PopupCalendar
                    visible={visibleCalendar}
                    onRequestClose={() => this.setState({ visibleCalendar: false })}
                />
            </ParentContainer>
        );
    }
}
