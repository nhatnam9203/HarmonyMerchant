import React from 'react';
import {
    View,
    Image,
    TextInput,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService, ClearTextInputIcon } from '@components';
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
                                    onChangeText={(value) => this.updateSearchFilterInfo('keySearch', value)}
                                    onSubmitEditing={this.searchService}
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
                    <View style={{ width: scaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchService}
                            style={{ borderWidth: 1, borderColor: '#6A6A6A' }}
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
        const dataServicesCategory = getArrayNameCategories(categoriesByMerchant, 'Service');
        dataServicesCategory.unshift({ value: '' });

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
                                    label={localize('Status', language)}
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
                            textColor="#6A6A6A"
                            onPress={this.showModalAddService}
                            style={{
                                borderWidth: 1, borderColor: '#6A6A6A',
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
            isShowSearchService, listServicesSearch, refreshListServices,
            language
        } = this.props;
        const { visibleArchive, visibleRestore, visibleAdd, visibleEdit } = this.state;
        const data = servicesByMerchant.map((item, index) => {
            return {
                ...item,
                key: `item-${index}`,
            }
        })
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1 }} >
                    <HeaderTableService
                        language={language}
                    />
                    <DraggableFlatList
                        data={data}
                        renderItem={({ item, index, move, moveEnd, isActive }) => <RowTableService
                            index={index}
                            service={item}
                            archiveService={() => this.archiveService(item)}
                            editService={() => this.showModalEditService(item)}
                            restoreService={() => this.restoreService(item)}
                            categoryName={getCategoryName(categoriesByMerchant, item.categoryId)}
                            move={move}
                            moveEnd={moveEnd}
                        />}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={<RowTableEmptyService />}
                        refreshing={refreshListServices}
                        onRefresh={() => this.searchService(false)}
                        scrollPercent={5}
                        onMoveEnd={({ data }) => this.updateServicePosition(data, isShowSearchService)}
                    />
                </View>
                <PopupAddEditService
                    ref={this.addServiceRef}
                    visible={visibleAdd}
                    title={localize('Add Service', language)}
                    titleButton={localize('Add', language)}
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddService={this.submitAddService}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupAddEditService
                    ref={this.editServiceRef}
                    visible={visibleEdit}
                    title={localize('Edit Service', language)}
                    titleButton={localize('Save', language)}
                    isSave={true}
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    editService={this.submitEditService}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupConfirm
                    visible={visibleArchive}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Archive this Service', language)}?`}
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archiveServiceYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Service', language)}?`}
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

