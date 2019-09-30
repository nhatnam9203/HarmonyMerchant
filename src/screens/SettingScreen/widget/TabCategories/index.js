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

    searchCategories = () => {
        const { searchFilter } = this.state;
        const { keySearch, category, status } = searchFilter;
        // console.log('searchFilter : ', searchFilter);
        if (keySearch == '' && category == '' & status == '') {
            this.props.actions.category.clearSearchCategories();
        } else {
            this.props.actions.category.searchCategories(keySearch, status, category);
        }
    }

    showModalAddCategory = () => {
        this.addCategoryRef.current.setStateDefaultFromParent();
        this.setState({ visibleAdd: true });
    }

    submitAddCategory = async (category) => {
        await this.setState({
            visibleAdd: false
        });
        this.props.actions.category.addCategory(category);

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

    submitEditCategory = async (category) => {
        await this.setState({
            visibleEdit: false
        });
        this.props.actions.category.editCategory({
            CategoryType: category.categoryType,
            name: category.name
        }, category.categoryId);

    }

    restoreCategory(category) {
        this.setState({
            visibleRestore: true,
            categoryHandle: category
        })
    }

    updatePositionCategories = data => {
        const categoriresUpdate = data.map((category, index) => {
            return {
                ...category,
                position: index
            }
        });
        const body = data.map((category, index) => {
            return {
                categoryId: category.categoryId,
                position: index
            }
        });
        // console.log('--- categoriresUpdate : ', JSON.stringify(categoriresUpdate));
        this.props.actions.category.updatePositionCategoriesLocal(categoriresUpdate);
        this.props.actions.category.updatePositionCategories(body);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isShowSearchCategories, isGetListSearchCategories } = this.props;
        if (isShowSearchCategories && isGetListSearchCategories) {
            this.searchCategories();
        }

    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    categoriesByMerchant: state.category.categoriesByMerchant,
    refreshListCategories: state.category.refreshListCategories,
    listCategoriesSearch: state.category.listCategoriesSearch,
    isShowSearchCategories: state.category.isShowSearchCategories,
    isGetListSearchCategories: state.category.isGetListSearchCategories
})



export default connectRedux(mapStateToProps, TabCategories);