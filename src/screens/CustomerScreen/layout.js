import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList
} from 'react-native';

import { Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, PopupCheckStaffPermission } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    HeaderTableCustomer, RowTableCustomer, RowEmptyTableCustomer,
    PopupAddEditCustomer, PopupCustomerDetail
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
                    {localize('Customer', language)}
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
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: scaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={`${localize('Phone Number', language)}/ ${localize('Customer Name', language)}`}
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
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
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
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language } = this.props;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'flex-end' }} >
                        <Text style={{ color: '#0764B0', fontSize: scaleSzie(18), fontWeight: 'bold' }} >
                            {localize('Customer List', language)}
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#0764B0"
                            title={localize('Add New', language)}
                            textColor="#fff"
                            onPress={this.showModalAddCustomer}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderTable() {
        const { listCustomersByMerchant, listCustomersSearch, isShowSearchCustomer,
            refreshListCustomer, language
        } = this.props;
        const temptData = isShowSearchCustomer ? listCustomersSearch : listCustomersByMerchant;
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableCustomer
                    language={language}
                />
                <FlatList
                    data={temptData}
                    renderItem={({ item, index }) => <RowTableCustomer
                        key={index}
                        customer={item}
                        unSelectAll={this.unSelectAll}
                        showModalDetail={this.showModalDetail}
                    />}
                    keyExtractor={(item, index) => `${item.customerId}`}
                    ListEmptyComponent={<RowEmptyTableCustomer />}
                    refreshing={refreshListCustomer}
                    onRefresh={() => this.props.actions.customer.getListCustomersByMerchant(false)}
                />
            </View>
        );
    }

    render() {
        const { language, stateCity, navigation } = this.props;
        const { visibleAdd, visibleDetail, visibleEdit, isFocus } = this.state;
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
                    {this.renderTable()}

                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
                <PopupAddEditCustomer
                    ref={this.modalAddRef}
                    language={language}
                    visible={visibleAdd}
                    title={localize('New Customer', language)}
                    onRequestClose={this.closeModalAddCustomer}
                    addCustomer={this.addCustomer}
                    stateCity={stateCity}
                />
                <PopupAddEditCustomer
                    ref={this.modalEditRef}
                    language={language}
                    visible={visibleEdit}
                    title={localize('Edit Customer', language)}
                    onRequestClose={this.closeModalEditCustomer}
                    editCustomer={this.editCustomer}
                    stateCity={stateCity}
                    isSave={true}
                />
                <PopupCustomerDetail
                    ref={this.modalDetailRef}
                    language={language}
                    visible={visibleDetail}
                    title={localize('Customer Details', language)}
                    onRequestClose={this.closeModalDetail}
                    showModalEditCustomer={this.showModalEditCustomer}
                />
                <PopupCheckStaffPermission
                    ref={this.checkPermissionRef}
                    title={localize('Input PIN Number', language)}
                    navigation={navigation}
                    tabName="Customer"
                />
            </ParentContainer>
        );
    }
}
