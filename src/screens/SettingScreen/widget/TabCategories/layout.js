import React from 'react';
import {
    View,
    TextInput,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { ScaleSzie, localize, getArrayNameCategories } from '@utils';
import {
    Text, Button, ButtonCustom, Dropdown, PopupConfirm,
    PopupEditAddCategories, ClearTextInputIcon
} from '@components';
import styles from './style';
import { HeaderTableCategories, RowTableCategories, RowTableEmptyCategories } from './widget';

class Layout extends React.Component {

    renderSearch() {
        const { language } = this.props;
        const { searchFilter } = this.state;
        const { keySearch } = searchFilter;
        return (
            <View style={{ height: ScaleSzie(40), paddingHorizontal: ScaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: ScaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: ScaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Search', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: ScaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: ScaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: ScaleSzie(18) }}
                                    placeholder={localize('Catgory Name', language)}
                                    value={keySearch}
                                    onChangeText={(value) => this.updateSearchFilterInfo('keySearch', value)}
                                    onSubmitEditing={this.searchCategories}
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
                    <View style={{ width: ScaleSzie(170), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchCategories}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: ScaleSzie(15), fontWeight: '500' }}
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
            <View style={{ height: ScaleSzie(40), paddingHorizontal: ScaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ width: ScaleSzie(70), justifyContent: 'center' }} >
                            <Text style={{ fontSize: ScaleSzie(18), color: '#6A6A6A' }} >
                                {localize('Filters', language)}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ width: ScaleSzie(160) }} >
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
                                        borderRadius: ScaleSzie(4)
                                    }}
                                />
                            </View>
                            <View style={{ width: ScaleSzie(12) }} />
                            <View style={{ width: ScaleSzie(120) }} >
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
                                        borderRadius: ScaleSzie(4)
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ width: ScaleSzie(170), alignItems: 'flex-end' }} >
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
                            styleText={{ fontSize: ScaleSzie(15), fontWeight: '500', color: '#fff' }}
                        />
                    </View>
                </View>
            </View>
        );
    }


    renderTableStaff() {
        const { categoriesByMerchant, refreshListCategories,
            isShowSearchCategories, language,listCategoriesSearch
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
                <View style={{ height: ScaleSzie(10) }} />
                {this.renderFilter()}
                <View style={{ height: ScaleSzie(10) }} />
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
                            toggleIsDisplayOnSignInApp={this.toggleIsDisplayOnSignInApp}
                        />}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={<RowTableEmptyCategories />}
                        refreshing={refreshListCategories}
                        onRefresh={() => this.searchCategories(false)}
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
                    message={`${localize('Do you want to Archive this Category', language)}?`}
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archiveCategoryYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Category', language)}?`}
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

