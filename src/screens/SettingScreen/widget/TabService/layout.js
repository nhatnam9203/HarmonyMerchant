import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
} from 'react-native';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
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
                            <Text style={{ fontSize: scaleSzie(18), color: '#C5C5C5' }} >
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
                                            this.props.actions.service.clearSearchService();
                                        }
                                        this.updateSearchFilterInfo('keySearch', value)
                                    }}
                                    onSubmitEditing={this.searchService}
                                />
                            </View>
                            <Button onPress={this.searchService} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
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
                            textColor="#C5C5C5"
                            onPress={this.searchService}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language, categoriesByMerchant } = this.props;
        const { searchFilter } = this.state;
        const { category, status } = searchFilter;
        const dataServicesCategory =getArrayNameCategories(categoriesByMerchant, 'Service');
        dataServicesCategory.unshift({value:''});
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: scaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: scaleSzie(18), color: '#C5C5C5' }} >
                                {localize('Filters', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ width: scaleSzie(120) }} >
                                <Dropdown
                                    label={localize('Categories', language)}
                                    data={dataServicesCategory}
                                    value={category}
                                    onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
                                    containerStyle={{
                                        backgroundColor: 'rgb(246,246,246)',
                                        borderWidth: 1,
                                        borderColor: '#C5C5C5',
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
                                        borderColor: '#C5C5C5',
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
                            textColor="#C5C5C5"
                            onPress={this.showModalAddService}
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
        const { servicesByMerchant, categoriesByMerchant,
            isShowSearchService, listServicesSearch,refreshListServices
        } = this.props;
        const { visibleArchive, visibleRestore, visibleAdd, visibleEdit } = this.state;
        const temptData = isShowSearchService ? listServicesSearch : servicesByMerchant
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1 }} >
                    <HeaderTableService />
                    <FlatList
                        data={temptData}
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
                        refreshing={refreshListServices}
                        onRefresh={() => this.props.actions.service.getServicesByMerchant(false)}
                    />
                </View>
                <PopupAddEditService
                    ref={this.addServiceRef}
                    visible={visibleAdd}
                    title="Add Service"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddService={this.submitAddService}
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

