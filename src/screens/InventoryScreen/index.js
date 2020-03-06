import React from 'react';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getCategoryIdByName, getArrayNameCategories } from '@utils';

class InventoryScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            isSelectAll: false,
            visiblePopupDetail: false,
            visibleEdit: false,
            visibleAdd: false,
            visibleRestock: false,
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            },
            arrayProductRestock: [],
            fileDownload: '',
            visibleDropdownExport: false,
            visiblePopupExport: false,
            visiblePopupLoadingExport: false
        }
        this.scrollTabRef = React.createRef();
        this.productDetailRef = React.createRef();
        this.listProductRef = [];
        this.editProductRef = React.createRef();
        this.addProductRef = React.createRef();
        this.restockRef = React.createRef();
        this.modalExportRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.product.getProductsByMerchant();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                })
            }
        );
    }

    scanUKU = () => {

    }

    handleTheDownloadedFile = () => {
        const { pathFileInventory } = this.props;
        if (Platform.OS === 'ios') {
            RNFetchBlob.ios.previewDocument(pathFileInventory)
        } else {
            const android = RNFetchBlob.android;
            android.actionViewIntent(pathFileInventory, 'application/vnd.android.package-archive')
        }
    }

    requestExportFileToServer = async () => {
        const { profile } = this.props;
        const fileName = this.modalExportRef.current.state.value ? this.modalExportRef.current.state.value : 'Inventory';
        const isExportAll = !this.modalExportRef.current.state.isExportAll;

        await this.setState({
            visiblePopupExport: false,
            visiblePopupLoadingExport: true
        })
        this.props.actions.product.exportInventory(profile.merchantId, fileName,isExportAll);
    }

    exportPDF = () => {
    }

    exportExcel = () => {
        this.setState({
            visibleDropdownExport: false,
            visiblePopupExport: true
        });
    }

    exportFile = () => {
        this.setState({
            visibleDropdownExport: true
        })
    }

    updateSearchFilterInfo(key, value, keyParent = '') {
        const { searchFilter } = this.state;
        if (keyParent !== '') {
            const temptParent = searchFilter[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
            this.setState({
                searchFilter: temptUpdate
            })
        } else {
            const temptUpdate = { ...searchFilter, [key]: value };
            this.setState({
                searchFilter: temptUpdate
            })
        }
    }

    setProductRef = ref => {
        if (ref != null) {
            this.listProductRef.push(ref);
        }
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.navigation.navigate('Home');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    showLockScreen = () => {
        this.props.actions.app.handleLockScreen(true);
    }

    selectAll = () => {
        this.setState(prevState => ({ isSelectAll: !prevState.isSelectAll }),
            () => {
                const { isSelectAll } = this.state;
                for (let i = 0; i < this.listProductRef.length; i++) {
                    this.listProductRef[i].setCheckBoxFromParent(isSelectAll);
                }
            })
    }

    unSelectAll = () => {
        this.setState({ isSelectAll: false })
    }

    closePopupProductDetail = () => {
        this.setState({
            visiblePopupDetail: false
        })
    }

    // ----- Handle  -----
    restock = () => {
        let arrayProductRestock = [];
        for (let i = 0; i < this.listProductRef.length; i++) {
            if (this.listProductRef[i].state.isCheck) {
                arrayProductRestock.push(this.listProductRef[i].props.product.productId);
            }
        }
        if (arrayProductRestock.length > 0) {
            this.restockRef.current.setStateFromParent(0);
            this.setState({
                arrayProductRestock,
                visibleRestock: true
            })
        } else {
            alert('Please select products restock !')
        }
    }

    submitRestock = (quantity) => {
        const { arrayProductRestock } = this.state;
        this.props.actions.product.restockProduct(arrayProductRestock, parseInt(quantity));
        this.setState({
            visibleRestock: false
        })
    }

    showDetailProduct = (product) => {
        this.productDetailRef.current.setProductInfoFromParent(product);
        this.setState({
            visiblePopupDetail: true
        })
    }


    searchProduct = () => {
        const { searchFilter } = this.state;
        const { keySearch, category, status } = searchFilter;
        if (keySearch == '' && category == '' & status == '') {
            this.props.actions.product.clearSearchProduct();
        } else {
            const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Product') : '';
            this.props.actions.product.searchProduct(keySearch, temptCategory, status);
        }
    }

    submitArchiveYess = (id) => {
        this.props.actions.product.archiveProduct(id);
    }

    submitRestoreYess = (id) => {
        this.props.actions.product.restoreProduct(id);
    }

    showModalEditProduct = async (id) => {
        await this.setState({
            visiblePopupDetail: false
        });
        const { productsByMerchantId, listProductsSearch, isShowSearchProduct } = this.props;
        const tempData = isShowSearchProduct ? listProductsSearch : productsByMerchantId;
        let temptProductEdit = '';
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i].productId === id) {
                temptProductEdit = { ...tempData[i] };
                break;
            }
        }
        this.editProductRef.current.setProductInfoFromParent(temptProductEdit);
        this.setState({
            visibleEdit: true
        })
    }

    editProduct = async (product) => {
        await this.setState({ visibleEdit: false })
        this.props.actions.product.editProduct(product, product.productId);

    }

    showModaAddProduct = () => {
        const { categoriesByMerchant } = this.props;
        if (getArrayNameCategories(categoriesByMerchant, 'Product').length > 0) {
            this.setState({ visibleAdd: true });
            this.addProductRef.current.setDefaultStateFromParent();
        } else {
            alert('Create category before add service please !')
        }
    }

    addProduct = async product => {
        await this.setState({ visibleAdd: false })
        this.props.actions.product.addProductByMerchant(product);

    }

    updateProductsPosition = (data, isShowSearchProduct) => {
        if (!isShowSearchProduct) {
            const productsUpdate = data.map((product, index) => {
                return {
                    ...product,
                    position: index
                }
            });
            const body = data.map((product, index) => {
                return {
                    productId: product.productId,
                    position: index
                }
            });
            this.props.actions.product.updateProductsPositionLocal(productsUpdate);
            this.props.actions.product.updateProductsPosition(body);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isDownloadInventory } = this.props;
        if (prevProps.isDownloadInventory !== isDownloadInventory && isDownloadInventory) {
            this.props.actions.product.resetDownloadFinleInventory();
            await this.setState({
                visiblePopupLoadingExport: false
            })
        }

    }

    // ----- End Handle ---
    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }
}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    productsByMerchantId: state.product.productsByMerchantId,
    categoriesByMerchant: state.category.categoriesByMerchant,
    listProductsSearch: state.product.listProductsSearch,
    isShowSearchProduct: state.product.isShowSearchProduct,
    refreshListProducts: state.product.refreshListProducts,
    isDownloadInventory: state.product.isDownloadInventory,
    pathFileInventory: state.product.pathFileInventory
})



export default connectRedux(mapStateToProps, InventoryScreen);