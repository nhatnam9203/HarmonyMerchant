import React from 'react';
import {
    View,
    Image,
    TextInput,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import {
    Text, StatusBarHeader, Button, ParentContainer, ButtonCustom, Dropdown, PopupAddEditProduct,
    ModalCustom, PopupCheckStaffPermission, ClearTextInputIcon
} from '@components';
import { ScaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import {
    HeaderTableProducts, RowTableProducts, RowEmptyTableProducts, PopupDetailProduct,
    PopupRestock, PopupExport, PopupLoadingExport
} from './widget';
import configs from "@configs";

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={{
                height: ScaleSzie(35), borderBottomColor: '#0764B0', borderWidth: 3, paddingLeft: ScaleSzie(50),
                justifyContent: 'center'
            }} >
                <Text style={{ fontSize: ScaleSzie(16), color: '#0764B0', fontWeight: "600" }} >
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
            <View style={{ height: ScaleSzie(40), paddingHorizontal: ScaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ flex: 1, borderColor: '#C5C5C5', borderWidth: 1, borderRadius: ScaleSzie(4), flexDirection: 'row' }} >
                            <View style={{ flex: 1, paddingHorizontal: ScaleSzie(12) }} >
                                <TextInput
                                    style={{ flex: 1, fontSize: ScaleSzie(18) }}
                                    placeholder={`${localize('SKU Number', language)}/ ${localize('Product Name', language)}`}
                                    value={keySearch}
                                    onChangeText={(value) => this.updateSearchFilterInfo('keySearch', value)}
                                    onSubmitEditing={this.searchProduct}
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
                    <View style={{ width: ScaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={ScaleSzie(110)}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title={localize('Search', language)}
                            textColor="#6A6A6A"
                            onPress={this.searchProduct}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: ScaleSzie(15), fontWeight: 'normal' }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderFilter() {
        const { language, categoriesByMerchant, pathFileInventory } = this.props;
        const { searchFilter } = this.state;
        const { category } = searchFilter;
        const dataProductCategory = getArrayNameCategories(categoriesByMerchant, 'Product');
        dataProductCategory.unshift({ value: '' });
        return (
            <View style={{ height: ScaleSzie(40), paddingHorizontal: ScaleSzie(12) }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={[{ width: ScaleSzie(160) }]} >
                            <Dropdown
                                label={localize('Categories', language)}
                                data={dataProductCategory}
                                value={category}
                                onChangeText={(value) => this.updateSearchFilterInfo('category', value)}
                                containerStyle={{
                                    borderWidth: 1,
                                    flex: 1,
                                    borderRadius: ScaleSzie(4),
                                    borderColor: '#C5C5C5',
                                    backgroundColor: '#F1F1F1',
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }} >
                            {/* -------- Review File Download ------- */}
                            {
                                pathFileInventory === '' ? <View /> : <Button onPress={this.handleTheDownloadedFile} style={[{
                                    width: ScaleSzie(200), justifyContent: 'center', alignItems: 'center', marginRight: ScaleSzie(8)
                                }, styles.borderStyle, { backgroundColor: 'rgb(235,93,57)' }]} >
                                    <Text style={{ color: '#fff', fontSize: ScaleSzie(15) }} >
                                        {localize('Handle the downloaded file', language)}
                                    </Text>
                                </Button>
                            }

                            {/* --------- Restock ------ */}
                            <Button onPress={this.restock} style={[{
                                width: ScaleSzie(120), justifyContent: 'center', alignItems: 'center',
                            }, styles.borderStyle]} >
                                <Text style={{ color: '#6A6A6A', fontSize: ScaleSzie(15) }} >
                                    {localize('Restock', language)}
                                </Text>
                            </Button>
                        </View>

                    </View>
                    <View style={[{ width: ScaleSzie(120), alignItems: 'flex-end' }]} >
                        <Button onPress={this.exportFile} style={[{ height: ScaleSzie(40), width: ScaleSzie(110), flexDirection: 'row' }, styles.borderStyle]} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <Image source={IMAGE.export} style={{
                                    width: ScaleSzie(18), height: ScaleSzie(18),
                                    marginHorizontal: ScaleSzie(8)
                                }} />
                                <Text style={{ color: '#6A6A6A', fontSize: ScaleSzie(15) }} >

                                    {localize('Export', language)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: ScaleSzie(6) }} >
                                <Image source={IMAGE.dropdown} style={{ width: ScaleSzie(6), height: ScaleSzie(3) }} />
                            </View>
                        </Button>

                    </View>
                    <View style={{ width: ScaleSzie(120), alignItems: 'flex-end' }} >
                        <ButtonCustom
                            width={'90%'}
                            height={40}
                            backgroundColor="#0764B0"
                            title={localize('Add New', language)}
                            textColor="#fff"
                            onPress={this.showModaAddProduct}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: ScaleSzie(15), fontWeight: 'normal' }}
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
        const data = productsByMerchantId.map((item, index) => {
            return {
                ...item,
                key: `item-${index}`,
            }
        });
        return (
            <View style={{ flex: 1, paddingTop: ScaleSzie(20) }} >
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
                    onRefresh={this.onRefreshProductList}
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
                    paddingRight: ScaleSzie(132),
                    paddingTop: ScaleSzie(155)
                }}
            >
                <View style={styles.containerDropdownExport} >
                    <Button onPress={this.exportExcel.bind(this, "pdf")} style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: ScaleSzie(14) }} >
                            {`Export to PDF`}
                        </Text>
                    </Button>
                    <Button onPress={this.exportExcel.bind(this, "excel")} style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: ScaleSzie(14) }} >

                            {localize('Export to Excel', language)}
                        </Text>
                    </Button>
                </View>
            </ModalCustom>
        );
    }

    render() {
        const { language, categoriesByMerchant, navigation, inventoryTabPermission } = this.props;
        const { visiblePopupDetail, isFocus } = this.state;
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
                    <View style={{ height: ScaleSzie(18) }} />
                    {this.renderSearch()}
                    <View style={{ height: ScaleSzie(10) }} />
                    {this.renderFilter()}
                    {this.renderTable()}
                    <Button onPress={this.openDrawer} style={configs.btn_left_position} >
                        <Image source={IMAGE.openDrawer} style={{ width: ScaleSzie(34), height: ScaleSzie(34) }} />
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
                    typeFile={this.state.typeFile === "pdf" ? "PDF" : "Excel"}
                />
                {this.renderModalDropdownExport()}
                <PopupCheckStaffPermission
                    ref={this.checkPermissionRef}
                    visiblePopupCheckStaffPermission={inventoryTabPermission}
                    title={localize('Input PIN Number', language)}
                    tabName="Inventory"
                    onRequestClose={this.closePopupCheckProductTabPermission}
                />
            </ParentContainer>
        );
    }
}
