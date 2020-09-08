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


    async updateSearchFilterInfo(key, value, keyParent = '') {
        const { searchFilter } = this.state;
        if (keyParent !== '') {
            const temptParent = searchFilter[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
            await this.setState({
                searchFilter: temptUpdate
            });
        } else {
            const temptUpdate = { ...searchFilter, [key]: value };
            await this.setState({
                searchFilter: temptUpdate
            });
        }
    }

    clearSearchText = () => {
        this.updateSearchFilterInfo('keySearch', "");
    }

    searchExtra = () => {
        const { searchFilter } = this.state;
        const { keySearch,status } = searchFilter;
        
        this.props.actions.extra.searchExtra(keySearch, status)

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


    showModalAddExtra = () => {
        this.addExtraRef.current.setStateDefaultFromParent();
        this.setState({ visibleAdd: true })
    }

    submitAddExtra = async (extra) => {
        await this.setState({ visibleAdd: false })
        this.props.actions.extra.addExtraByMerchant(extra);

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

    submitEditExtra = async (extra) => {
        await this.setState({
            visibleEdit: false
        })
        this.props.actions.extra.editExtra(extra, extra.extraId);

    }

    restoreExtra(extra) {
        this.setState({
            visibleRestore: true,
            extraHandle: extra
        })
    }

    updateExtrasPosition = (data, isShowSearchExtra) => {
        if (!isShowSearchExtra) {
            const extrasUpdate = data.map((extra, index) => {
                return {
                    ...extra,
                    position: index
                }
            });
            const body = data.map((extra, index) => {
                return {
                    extraId: extra.extraId,
                    position: index
                }
            });
            this.props.actions.extra.updatePositionExtrasLocal(extrasUpdate);
            this.props.actions.extra.updatePositionExtras(body);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isShowSearchExtra, isGetListSearchExtra } = this.props;
        if (isShowSearchExtra && isGetListSearchExtra) {
            this.searchExtra();
        }

    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    categoriesByMerchant: state.category.categoriesByMerchant,
    extrasByMerchant: state.extra.extrasByMerchant,
    refreshListExtras: state.extra.refreshListExtras,
    listExtrasSearch: state.extra.listExtrasSearch,
    isShowSearchExtra: state.extra.isShowSearchExtra,
    isGetListSearchExtra: state.extra.isGetListSearchExtra
})



export default connectRedux(mapStateToProps, TabExtra);