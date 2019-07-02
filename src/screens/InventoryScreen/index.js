import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getCategoryIdByName } from '@utils';

class InventoryScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            isSelectAll: false,
            visiblePopupDetail:false,
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            }
        }
        this.scrollTabRef = React.createRef();
        this.productDetailRef = React.createRef();
        this.listProductRef = [];
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
            this.props.actions.app.handleLockScreen(true);
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

    closePopupProductDetail =() =>{
        this.setState({
            visiblePopupDetail:false
        })
    }

    // ----- Handle  -----
    restock = () => {
        alert('dd')
    }

    showDetailProduct =  (product) => {
        this.productDetailRef.current.setProductInfoFromParent(product);
        this.setState({
            visiblePopupDetail:true
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

    submitArchiveYess = (id) =>{
        this.props.actions.product.archiveProduct(id);
    }

    submitRestoreYess =(id) =>{
        this.props.actions.product.restoreProduct(id);
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
})



export default connectRedux(mapStateToProps, InventoryScreen);