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
    Text, Button, ButtonCustom, Dropdown, PopupConfirm, ClearTextInputIcon,
    PopupEditAddExtra
} from '@components';
import styles from './style';
import IMAGE from '@resources';
import { HeaderTableExtra, RowTableExtra, RowTableEmptyExtra } from './widget';

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
                                    placeholder={localize('Extra Name', language)}
                                    value={keySearch}
                                    onChangeText={(value) => this.updateSearchFilterInfo('keySearch', value)}
                                    onSubmitEditing={this.searchExtra}
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
                            onPress={this.searchExtra}
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
                        {/* <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Add New', language)}
                            textColor="#6A6A6A"
                            onPress={this.showModalAddExtra}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                backgroundColor: '#0764B0'
                            }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: '500', color: '#fff' }}
                        /> */}
                    </View>
                </View>
            </View>
        );
    }


    renderTableStaff() {
        const { categoriesByMerchant, language, extrasByMerchant, refreshListExtras,
            listExtrasSearch, isShowSearchExtra
        } = this.props;
        const { visibleArchive, visibleRestore, visibleAdd, visibleEdit } = this.state;
        const temptData = isShowSearchExtra ? listExtrasSearch : extrasByMerchant;
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
                    <HeaderTableExtra
                        language={language}
                    />
                    <DraggableFlatList
                        data={data}
                        renderItem={({ item, index, move, moveEnd, isActive }) => <RowTableExtra
                            index={index}
                            extra={item}
                            archiveExtra={() => this.archiveExtra(item)}
                            editService={() => this.showModalEditExtra(item)}
                            restoreExtra={() => this.restoreExtra(item)}
                            categoryName={getCategoryName(categoriesByMerchant, item.categoryId)}
                            move={move}
                            moveEnd={moveEnd}
                        />}
                        keyExtractor={(item, index) => `${item.extraId}`}
                        ListEmptyComponent={<RowTableEmptyExtra />}
                        refreshing={refreshListExtras}
                        onRefresh={() => this.searchExtra(false)}
                        scrollPercent={5}
                        onMoveEnd={({ data }) => this.updateExtrasPosition(data, isShowSearchExtra)}
                    />
                </View>
                <PopupEditAddExtra
                    ref={this.addExtraRef}
                    visible={visibleAdd}
                    title={localize('Add Extra', language)}
                    titleButton={localize('Add', language)}
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddExtra={this.submitAddExtra}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupEditAddExtra
                    ref={this.editExtraRef}
                    visible={visibleEdit}
                    title={localize('Edit Extra', language)}
                    titleButton={localize('Save', language)}
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                    isEdit={true}
                    editExtra={this.submitEditExtra}
                />
                <PopupConfirm
                    visible={visibleArchive}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Archive this Extra', language)}?`}
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archiveExtraYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Extra', language)}?`}
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreExtraYess()}
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

