import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getArrayNameCategories, getCategoryIdByName } from '@utils';

class TabBatchHistory extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            }
        };
        this.scrollTabRef = React.createRef();
    }

    gotoTabDetail = () => {
        this.scrollTabRef.current.goToPage(1);
    }

    backReport = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    searchBatchHistory = () => {

    }

    showCalendar =() =>{
        
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    servicesByMerchant: state.service.servicesByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant,
    listServicesSearch: state.service.listServicesSearch,
    isShowSearchService: state.service.isShowSearchService,
    refreshListServices: state.service.refreshListServices,
    isGetListSearchService: state.service.isGetListSearchService
})



export default connectRedux(mapStateToProps, TabBatchHistory);