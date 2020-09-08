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

    setStateFromParent =async () =>{
        await this.setState({
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            }
        })
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

        if (key !== "keySearch") {
            setTimeout(() => {
                this.searchExtra();
            }, 100);
        } else {
            if (value === "") {
                this.searchExtra();
            }
        }
    }

    clearSearchText = () => {
        this.updateSearchFilterInfo('keySearch', "");
        const { searchFilter } = this.state;
        const { status } = searchFilter;
        this.props.actions.extra.getExtraByMerchant("", status, true);
    }

    searchExtra = (isShowLoading = true) => {
        const { searchFilter } = this.state;
        const { keySearch, status } = searchFilter;
        this.props.actions.extra.getExtraByMerchant(keySearch, status, isShowLoading);
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
        const { searchFilter } = this.state;
        await this.setState({
            visibleArchive: false,
        });
        this.props.actions.extra.archiveExtra(this.state.extraHandle.extraId, searchFilter);
    }

    restoreExtraYess = async () => {
        const { searchFilter } = this.state;
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.extra.restoreExtra(this.state.extraHandle.extraId, searchFilter);
    }


    showModalAddExtra = () => {
        this.addExtraRef.current.setStateDefaultFromParent();
        this.setState({ visibleAdd: true })
    }

    submitAddExtra = async (extra) => {
        const { searchFilter } = this.state;
        await this.setState({ visibleAdd: false })
        this.props.actions.extra.addExtraByMerchant(extra,searchFilter);
    }

    submitEditExtra = async (extra) => {
        const { searchFilter } = this.state;
        await this.setState({
            visibleEdit: false
        })
        this.props.actions.extra.editExtra(extra, extra.extraId,searchFilter);
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