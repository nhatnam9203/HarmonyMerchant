import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';

import { Text, StatusBarHeader, ScrollableTabView, Button, ParentContainer, ButtonCustom, PopupCheckStaffPermission, ClearTextInputIcon } from '@components';
import { ScaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    HeaderTableCustomer, RowTableCustomer, RowEmptyTableCustomer,
   CustomerDetailTab,EditOrCreateCustomerTab
} from './widget';
import configs from "@configs";
import ICON from "@resources"

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: ScaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: ScaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: ScaleSzie(16), color: '#0764B0',fontWeight:"600" }} >
                    {localize('Customer', language)}
                </Text>
            </View>
        );
    }

    renderSearch() {
        const { language } = this.props;
        const { keySearch } = this.state;
        return (
            <View style={{ height: ScaleSzie(40), paddingHorizontal: ScaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: ScaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: ScaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: ScaleSzie(18) }}
                                    placeholder={localize('Search', language)}
                                    value={keySearch}
                                    onChangeText={this.onChangeKeySearch}
                                    onSubmitEditing={() => this.searchCustomer(1, true, false)}
                                />
                            </View>
                            {
                                keySearch.length > 0 ? <Button onPress={this.clearSearchText} style={{
                                    width: ScaleSzie(35), alignItems: 'center', justifyContent: 'center',

                                }} >
                                    <ClearTextInputIcon />
                                </Button> : null
                            }
                        </View>
                    </View>

                    {/* ----------- Search Button ------------ */}
                    <View style={{ width: ScaleSzie(130), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'95%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={() => this.searchCustomer(1, true, false)}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 6 }}
                            styleText={{ fontSize: ScaleSzie(15), fontWeight: '500' }}
                        />
                    </View>

                    {/* ----------- Add New Button ------------ */}
                    <View style={{ width: ScaleSzie(130), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'95%'}
                            height={40}
                            backgroundColor="#0764B0"
                            title={localize('Add New', language)}
                            textColor="#fff"
                            onPress={this.addNewCustomer}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: 6 }}
                            styleText={{ fontSize: ScaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderTable() {
        const { listCustomersByMerchant, refreshListCustomer, language, isLoadMoreCustomerList } = this.props;

        return (
            <View style={{ flex: 1 }} >
                <HeaderTableCustomer
                    language={language}
                />
                <FlatList
                    data={listCustomersByMerchant}
                    renderItem={({ item, index }) => <RowTableCustomer
                        key={index}
                        customer={item}
                        unSelectAll={this.unSelectAll}
                        showModalDetail={this.gotoCustomerDetailTab}
                    />}
                    keyExtractor={(item, index) => `${item.customerId}`}
                    ListEmptyComponent={<RowEmptyTableCustomer />}
                    refreshing={refreshListCustomer}
                    onRefresh={this.onRefreshCustomer}
                    onEndReached={this.loadMoreCustomerList}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    removeClippedSubviews={true}
                    initialNumToRender={20}
                    maxToRenderPerBatch={5}
                    ListFooterComponent={() => <View style={{ height: ScaleSzie(30), alignItems: "center", justifyContent: "center" }} >
                        {
                            isLoadMoreCustomerList ? <ActivityIndicator
                                size="large"
                                color="#0764B0"
                            /> : null
                        }
                    </View>}
                />
            </View>
        );
    }

    render() {
        const { language, stateCity, navigation, customerTabPermission } = this.props;
        const { visibleAdd, visibleDetail, visibleEdit, isFocus, currentTab } = this.state;
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
                    <ScrollableTabView
                        ref={this.scrollTabRef}
                        style={{}}
                        initialPage={0}
                        locked={true}
                        renderTabBar={() => <View />}
                        onChangeTab={this.onChangeTab}
                    >
                        {/* --------- List Customer Tab -------- */}
                        <View style={{ flex: 1 }} >
                            <View style={{ height: ScaleSzie(25) }} />
                            {this.renderSearch()}
                            <View style={{ height: ScaleSzie(25) }} />
                            {this.renderTable()}
                        </View>

                        {/* --------- Customer Detail Tab -------- */}
                        <CustomerDetailTab
                            ref={this.customerDetailTabRef}
                            showAppointmentDetail={this.showAppointmentDetail}
                            editCustomer={this.editCustomer}
                            deleteCustomer={this.deleteCustomer}
                        />

                        {/* --------- Edit or Create Customer -------- */}
                        <EditOrCreateCustomerTab
                            ref={this.edtitCustomerRef}
                            submitEditCustomer={this.submitEditCustomer}
                            cancelEditCustomerInfo={this.cancelEditCustomerInfo}
                            cancelAddCustomerInfo={this.cancelAddCustomerInfo}
                            addCustomer={this.addCustomer}
                        />


                    </ScrollableTabView>
                    <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                        <Image source={IMAGE.openDrawer} style={{ width: ScaleSzie(34), height: ScaleSzie(34) }} />
                    </Button>

                    {
                        currentTab === 1 ? <Button onPress={this.backCustomerListTab}
                            style={[configs.btn_right_position, {
                                width: ScaleSzie(34), height: ScaleSzie(34), backgroundColor: '#0764B0', justifyContent: 'center', alignItems: 'center'
                            }]} >
                            <Image source={ICON.arrowRight} style={{ width: ScaleSzie(22), height: ScaleSzie(17) }} />
                        </Button> : <View />
                    }
                </View>
                <PopupCheckStaffPermission
                    ref={this.checkPermissionRef}
                    visiblePopupCheckStaffPermission={customerTabPermission}
                    title={localize('Input PIN Number', language)}
                    tabName="Customer"
                    onRequestClose={this.closePopupCheckCustomerTabPermission}
                />

            </ParentContainer >
        );
    }
}
