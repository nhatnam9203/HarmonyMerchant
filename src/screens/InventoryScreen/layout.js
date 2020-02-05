import React from 'react';
import {
    View,
    Image,
    TextInput,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import {
    Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, Dropdown, PopupAddEditProduct,
    ModalCustom
} from '@components';
import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    HeaderTableProducts, RowTableProducts, RowEmptyTableProducts, PopupDetailProduct,
    PopupRestock, PopupExport, PopupLoadingExport
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
                    {localize('Inventory', language)}
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
                                    style={{ flex: 1, fontSize: scaleSzie(18) }}
                                    placeholder={`${localize('SKU Number', language)}/ ${localize('Product Name', language)}`}
                                    value={keySearch}
                                    onChangeText={(value) => {
                                        if (value === '') {
                                            this.props.actions.product.clearSearchProduct();
                                        }
                                        this.updateSearchFilterInfo('keySearch', value)
                                    }}
                                    onSubmitEditing={this.searchProduct}
                                />
                            </View>
                            <Button onPress={this.searchProduct} style={{ width: scaleSzie(35), alignItems: 'center', justifyContent: 'center' }} >
                                <Image source={IMAGE.search} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>

                        </View>
                    </View>
                    <View style={{ width: scaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={scaleSzie(110)}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchProduct}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: 'normal' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language, categoriesByMerchant, pathFileInventory } = this.props;
        const { isSelectAll, searchFilter } = this.state;
        const { category, status } = searchFilter;
        const dataProductCategory = getArrayNameCategories(categoriesByMerchant, 'Product');
        dataProductCategory.unshift({ value: '' });
        return (
            <View style={{ height: scaleSzie(40), paddingHorizontal: scaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={[{ width: scaleSzie(160) }]} >
                            <Dropdown
                                label={localize('Categories', language)}
                                data={dataProductCategory}
                                value={category}
                                onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
                                containerStyle={{
                                    borderWidth: 1,
                                    flex: 1,
                                    borderRadius: scaleSzie(4),
                                    borderColor: '#C5C5C5',
                                    backgroundColor: '#F1F1F1',
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }} >
                            {/* -------- Review File Download ------- */}
                            {
                                pathFileInventory === '' ? <View /> : <Button onPress={this.handleTheDownloadedFile} style={[{
                                    width: scaleSzie(200), justifyContent: 'center', alignItems: 'center', marginRight: scaleSzie(8)
                                }, styles.borderStyle, { backgroundColor: 'rgb(235,93,57)' }]} >
                                    <Text style={{ color: '#fff', fontSize: scaleSzie(15) }} >
                                        {localize('Handle the downloaded file', language)}
                                    </Text>
                                </Button>
                            }

                            {/* --------- Restock ------ */}
                            <Button onPress={this.restock} style={[{
                                width: scaleSzie(120), justifyContent: 'center', alignItems: 'center',
                            }, styles.borderStyle]} >
                                <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(15) }} >
                                    {localize('Restock', language)}
                                </Text>
                            </Button>
                        </View>

                    </View>
                    <View style={[{ width: scaleSzie(120), alignItems: 'flex-end' }]} >
                        <Button onPress={this.exportFile} style={[{ height: scaleSzie(40), width: scaleSzie(110), flexDirection: 'row' }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Image source={IMAGE.export} style={{
                                    width: scaleSzie(18), height: scaleSzie(18),
                                    marginHorizontal: scaleSzie(8)
                                }} />
                                <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(15) }} >

                                    {localize('Export', language)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(6) }} >
                                <Image source={IMAGE.dropdown} style={{ width: scaleSzie(6), height: scaleSzie(3) }} />
                            </View>
                        </Button>

                    </View>
                    <View style={{ width: scaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#0764B0"
                            title={localize('Add New', language)}
                            textColor="#fff"
                            onPress={this.showModaAddProduct}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(15), fontWeight: 'normal' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderTable() {
        const { productsByMerchantId, categoriesByMerchant,
            listProductsSearch, isShowSearchProduct, refreshListProducts,
            language
        } = this.props;
        const temptData = isShowSearchProduct ? listProductsSearch : productsByMerchantId;
        const data = temptData.map((item, index) => {
            return {
                ...item,
                key: `item-${index}`,
            }
        });
        return (
            <View style={{ flex: 1, paddingTop: scaleSzie(20) }} >
                <HeaderTableProducts
                    language={language}
                />
                <DraggableFlatList
                    data={data}
                    renderItem={({ item, index, move, moveEnd, isActive }) => <RowTableProducts
                        ref={this.setProductRef}
                        key={index}
                        product={item}
                        unSelectAll={this.unSelectAll}
                        nameCategory={getCategoryName(categoriesByMerchant, item.categoryId)}
                        showDetailProduct={this.showDetailProduct}
                        move={move}
                        moveEnd={moveEnd}
                    />}
                    keyExtractor={(item, index) => `${item.productId}`}
                    ListEmptyComponent={<RowEmptyTableProducts />}
                    refreshing={refreshListProducts}
                    onRefresh={() => this.props.actions.product.getProductsByMerchant(false)}
                    scrollPercent={5}
                    onMoveEnd={({ data }) => this.updateProductsPosition(data, isShowSearchProduct)}
                />
            </View>
        );
    }

    renderModalDropdownExport() {
        const { language } = this.props;

        return (
            <ModalCustom
                transparent={true}
                visible={this.state.visibleDropdownExport}
                onRequestClose={() => this.setState({ visibleDropdownExport: false })}
                style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    paddingRight: scaleSzie(132),
                    paddingTop: scaleSzie(155)
                }}
            >
                <View style={styles.containerDropdownExport} >
                    {/* <Button onPress={this.exportPDF} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                            Export to pdf
                            </Text>
                    </Button> */}
                    <Button onPress={this.exportExcel} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >

                            {localize('Export to excel', language)}
                        </Text>
                    </Button>
                </View>
            </ModalCustom>
        );
    }

    render() {
        const { language, categoriesByMerchant, navigation } = this.props;
        const { visiblePopupDetail, isFocus } = this.state;
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
                    <View style={{ height: scaleSzie(10) }} />
                    {this.renderFilter()}
                    {this.renderTable()}
                    <Button onPress={this.openDrawer} style={{ position: 'absolute', top: 20, left: 0 }} >
                        <Image source={IMAGE.openDrawer} style={{ width: scaleSzie(34), height: scaleSzie(34) }} />
                    </Button>
                </View>
                <PopupDetailProduct
                    ref={this.productDetailRef}
                    title={localize('Product Details', language)}
                    visible={visiblePopupDetail}
                    onRequestClose={this.closePopupProductDetail}
                    language={language}
                    categoriesByMerchant={categoriesByMerchant}
                    submitArchiveYess={this.submitArchiveYess}
                    submitRestoreYess={this.submitRestoreYess}
                    showModalEditProduct={this.showModalEditProduct}
                />
                <PopupAddEditProduct
                    ref={this.editProductRef}
                    visible={this.state.visibleEdit}
                    title={localize('Edit Product', language)}
                    titleButton={localize('Save', language)}
                    isSave={true}
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    editProduct={this.editProduct}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupAddEditProduct
                    ref={this.addProductRef}
                    visible={this.state.visibleAdd}
                    title={localize('Add Product', language)}
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    confimYes={this.addProduct}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupRestock
                    ref={this.restockRef}
                    title={localize('Add Item to Stock', language)}
                    visible={this.state.visibleRestock}
                    onRequestClose={() => this.setState({ visibleRestock: false })}
                    language={language}
                    submitRestock={this.submitRestock}
                />
                <PopupExport
                    ref={this.modalExportRef}
                    title={localize('Export', language)}
                    visible={this.state.visiblePopupExport}
                    onRequestClose={() => this.setState({ visiblePopupExport: false })}
                    language={language}
                    exportFile={this.requestExportFileToServer}
                />
                <PopupLoadingExport
                    visible={this.state.visiblePopupLoadingExport}
                    onRequestClose={() => this.setState({ visiblePopupLoadingExport: false })}
                    language={language}
                />
                {this.renderModalDropdownExport()}
            </ParentContainer>
        );
    }
}
