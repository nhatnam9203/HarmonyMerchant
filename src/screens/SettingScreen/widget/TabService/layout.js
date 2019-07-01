import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
} from 'react-native';

import { scaleSzie, localize, getCategoryName } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { HeaderTableService, RowTableService, RowTableEmptyService } from './widget';

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
                                    placeholder={localize('Service', language)}
                                    value={keySearch}
                                    onChangeText={(value) => {
                                        if (value === '') {
                                            this.props.actions.staff.clearSearch();
                                        }
                                        this.updateSearchFilterInfo('keySearch', value)
                                    }}
                                    onSubmitEditing={this.searchStaff}
                                />
                            </View>
                            <Button onPress={this.searchStaff} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
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
                            onPress={this.searchStaff}
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
        const { searchFilter } = this.state;
        const { role, status } = searchFilter;
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Filters', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ width: scaleSzie(120) }} >
                                <Dropdown
                                    label={localize('Role', language)}
                                    data={[{ value: '' }, { value: 'Admin' }, { value: 'Staff' }]}
                                    value={role}
                                    onChangeText={(value) => this.updateSearchFilterInfo('role', value)}
                                    containerStyle={{
                                        backgroundColor: 'rgb(246,246,246)',
                                        borderWidth: 1,
                                        borderColor: '#6A6A6A',
                                        flex: 1,
                                        borderRadius: scaleSzie(4)
                                    }}
                                />
                            </View>
                            <View style={{ width: scaleSzie(12) }} />
                            <View style={{ width: scaleSzie(120) }} >
                                <Dropdown
                                    label={localize('Statuses', language)}
                                    data={[{ value: '' }, { value: 'Active' }, { value: 'Disable' }]}
                                    value={status}
                                    onChangeText={(value) => this.updateSearchFilterInfo('status', value)}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#6A6A6A',
                                        flex: 1,
                                        borderRadius: scaleSzie(4)
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Add New', language)}
                            textColor="#6A6A6A"
                            onPress={this.addStaff}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                backgroundColor: '#0764B0'
                            }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500', color: '#fff' }}
                        />
                    </View>
                </View>
            </View>
        );
    }


    renderTableStaff() {
        const { servicesByMerchant, categoriesByMerchant } = this.props;
        const { visibleArchive, visibleRestore,visibleAdd,visibleEdit } = this.state;
        // const temptData = isShowSearch ? listSearchStaff : listStaffByMerchant
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1 }} >
                    <HeaderTableService />
                    <FlatList
                        data={servicesByMerchant}
                        renderItem={({ item, index }) => <RowTableService
                            index={index}
                            service={item}
                            archiveService={() => this.archiveService(item)}
                            editService={() => this.showModalEditService(item)}
                            restoreService={() => this.restoreService(item)}
                            categoryName={getCategoryName(categoriesByMerchant, item.categoryId)}
                        />}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={<RowTableEmptyService />}
                    />
                </View>
                <PopupAddEditService
                    ref={this.addServiceRef}
                    visible={visibleAdd}
                    title="Add Service"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddService={this.addService}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupAddEditService
                    ref={this.editServiceRef}
                    visible={visibleEdit}
                    title="Edit Service"
                    titleButton="Save"
                    isSave={true}
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    editService={this.submitEditService}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupConfirm
                    visible={visibleArchive}
                    title="Confirmation"
                    message="Do you want to Archive this Service ?"
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archiveServiceYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Service ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreServiceYess()}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                {this.renderTableStaff()}
            </View>
        );
    }

}

export default Layout;

