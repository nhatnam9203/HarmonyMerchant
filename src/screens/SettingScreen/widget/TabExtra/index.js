import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getArrayNameCategories, getCategoryIdByName } from '@utils';

class TabExtra extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            visibleArchive: false,
            visibleRestore: false,
            extraHandle: {},
            visibleAdd: false,
            visibleEdit: false,
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            }
        };
        this.addExtraRef = React.createRef();
        this.editExtraRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.extra.getExtraByMerchant();
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

    archiveExtraYess = async () => {
        await this.setState({
            visibleArchive: false,
        });
        this.props.actions.extra.archiveExtra(this.state.extraHandle.extraId);
    }

    restoreExtraYess = async () => {
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.extra.restoreExtra(this.state.extraHandle.extraId);
    }

    searchService = () => {
        const { searchFilter } = this.state;
        const { keySearch, category, status } = searchFilter;
        if (keySearch == '' && category == '' & status == '') {
            // this.props.actions.service.clearSearchService();
        } else {
            // const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
            // this.props.actions.service.searchService(keySearch, temptCategory, status);
        }
    }

    showModalAddExtra = () => {
        this.addExtraRef.current.setStateDefaultFromParent();
        this.setState({ visibleAdd: true })
    }

    submitAddExtra = (extra) => {
        this.props.actions.extra.addExtraByMerchant(extra);
        this.setState({ visibleAdd: false })
    }

    archiveExtra(extra) {
        this.setState({
            visibleArchive: true,
            extraHandle: extra
        })
    }

    async showModalEditExtra(extra) {
        this.editExtraRef.current.setExtraFromParent(extra);
        this.setState({
            visibleEdit: true
        })
    }

    submitEditExtra = (extra) => {
        this.props.actions.extra.editExtra(extra, extra.extraId);
        this.setState({
            visibleEdit: false
        })
    }

    restoreExtra(extra) {
        this.setState({
            visibleRestore: true,
            extraHandle: extra
        })
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    categoriesByMerchant: state.category.categoriesByMerchant,

    servicesByMerchant: state.service.servicesByMerchant,
    listServicesSearch: state.service.listServicesSearch,
    isShowSearchService: state.service.isShowSearchService,

    extrasByMerchant: state.extra.extrasByMerchant,
})



export default connectRedux(mapStateToProps, TabExtra);