import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import {
    Text, Button, ButtonCustom, Dropdown, PopupConfirm,
    PopupEditAddCategories
} from '@components';
import styles from './style';
import IMAGE from '@resources';
import { HeaderTableCategories, RowTableCategories, RowTableEmptyCategories } from './widget';

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
                                    placeholder={localize('Catgory Name', language)}
                                    value={keySearch}
                                    onChangeText={(value) => {
                                        if (value === '') {
                                            this.props.actions.category.clearSearchCategories();
                                        }
                                        this.updateSearchFilterInfo('keySearch', value)
                                    }}
                                    onSubmitEditing={this.searchCategories}
                                />
                            </View>
                            <Button onPress={this.searchCategories} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
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
                            onPress={this.searchCategories}
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
        const dataServicesCategory = getArrayNameCategories(categoriesByMerchant);
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
                            <View style={{ width: scaleSzie(160) }} >
                                <Dropdown
                                    label={localize('Category Type', language)}
                                    data={[{ value: '' }, { value: 'Product' }, { value: 'Service' }]}
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
                            onPress={this.showModalAddCategory}
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
        const { categoriesByMerchant, refreshListCategories,
            isShowSearchCategories, listCategoriesSearch,
            language
        } = this.props;
        const { visibleArchive, visibleRestore, visibleAdd, visibleEdit } = this.state;
        const temptData = isShowSearchCategories ? listCategoriesSearch : categoriesByMerchant;
        const data = temptData.map((item, index) => {
            return {
                ...item,
                key: `item-${index}`,
            }
        });
        return (
            <View style={styles.container} >
                {this.renderSearch()}
                <View style={{ height: scaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: scaleSzie(10) }} />
                <View style={{ flex: 1 }} >
                    <HeaderTableCategories
                        language={language}
                    />
                    <DraggableFlatList
                        data={data}
                        renderItem={({ item, index, move, moveEnd, isActive }) => <RowTableCategories
                            index={index}
                            category={item}
                            archiveCategory={() => this.archiveCategory(item)}
                            editCategory={() => this.showModalEditcategory(item)}
                            restoreCategory={() => this.restoreCategory(item)}
                            move={move}
                            moveEnd={moveEnd}
                        />}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={<RowTableEmptyCategories />}
                        refreshing={refreshListCategories}
                        onRefresh={() => this.props.actions.category.getCategoriesByMerchantId(false)}
                        scrollPercent={5}
                        onMoveEnd={({ data }) => this.updatePositionCategories(data, isShowSearchCategories)}
                    />
                </View>
                <PopupEditAddCategories
                    ref={this.addCategoryRef}
                    visible={visibleAdd}
                    title={localize('Add Category', language)}
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    confimYes={this.submitAddCategory}
                />
                <PopupEditAddCategories
                    ref={this.editCategoryRef}
                    visible={visibleEdit}
                    title={localize('Edit Category', language)}
                    titleButton="Save"
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    confimYes={this.submitEditCategory}
                />
                <PopupConfirm
                    visible={visibleArchive}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Archive this Category', language)} ?`}
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archiveCategoryYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Category', language)} ?`}
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

