import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getArrayNameCategories, getCategoryIdByName } from '@utils';

class TabCategories extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            visibleArchive: false,
            visibleRestore: false,
            isEditStaff: false,
            filter: {
                role: '',
                status: ''
            },
            categoryHandle: {},
            visibleAdd: false,
            visibleEdit: false,
            // ----
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            }
        };
        this.addCategoryRef = React.createRef();
        this.editCategoryRef = React.createRef();
    }

    componentDidMount() {
        // this.props.actions.category.getCategoriesByMerchantId();
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

    togglePopupArchive = (visible) => {
        this.setState({
            visibleArchive: visible
        })
    }

    togglePopupRestore = (visible) => {
        this.setState({
            visibleRestore: visible
        })
    }

    archiveCategoryYess = async () => {
        await this.setState({
            visibleArchive: false,
        });
        this.props.actions.category.archiveCategory(this.state.categoryHandle.categoryId);
    }

    restoreServiceYess = async () => {
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.category.restoreCategory(this.state.categoryHandle.categoryId);
    }

    searchService = () => {
        const { searchFilter } = this.state;
        const { keySearch, category, status } = searchFilter;
        if (keySearch == '' && category == '' & status == '') {
            this.props.actions.service.clearSearchService();
        } else {
            const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
            this.props.actions.service.searchService(keySearch, temptCategory, status);
        }
    }

    showModalAddCategory = () => {
        this.addCategoryRef.current.setStateDefaultFromParent();
        this.setState({ visibleAdd: true });
    }

    submitAddCategory = (category) => {
        this.props.actions.category.addCategory(category);
        this.setState({
            visibleAdd: false
        });
    }

    archiveCategory(category) {
        this.setState({
            visibleArchive: true,
            categoryHandle: category
        })
    }

    async showModalEditcategory(category) {
        this.editCategoryRef.current.setCategoryFromParent(category);
        this.setState({
            visibleEdit: true
        })
    }

    submitEditCategory = (category) => {
        this.props.actions.category.editCategory({
            CategoryType: category.categoryType,
            name: category.name
        }, category.categoryId);
        this.setState({
            visibleEdit: false
        });
    }

    restoreCategory(category) {
        this.setState({
            visibleRestore: true,
            categoryHandle: category
        })
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    servicesByMerchant: state.service.servicesByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant,
    listServicesSearch: state.service.listServicesSearch,
    isShowSearchService: state.service.isShowSearchService
})



export default connectRedux(mapStateToProps, TabCategories);