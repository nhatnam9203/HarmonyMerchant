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
            serviceHanle: {},
            visibleAdd: false,
            visibleEdit: false,
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            }
        };
        this.addServiceRef = React.createRef();
        this.editServiceRef = React.createRef();
    }

    componentDidMount() {
        // this.props.actions.service.getServicesByMerchant();
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

    archiveServiceYess = async () => {
        await this.setState({
            visibleArchive: false,
        });
        this.props.actions.service.archiveService(this.state.serviceHanle.serviceId);
    }

    restoreServiceYess = async () => {
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.service.restoreService(this.state.serviceHanle.serviceId);
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

    showModalAddService = () => {
        const { categoriesByMerchant } = this.props;
        if (getArrayNameCategories(categoriesByMerchant, 'Service').length > 0) {
            this.addServiceRef.current.setDefaultStateFromParent();
            this.setState({ visibleAdd: true });
        } else {
            alert('Create service category before add service please !')
        }
    }

    submitAddService = (service) => {
        this.props.actions.service.addServiceByMerchant(service);
        this.setState({ visibleAdd: false })
    }

    archiveService(service) {
        this.setState({
            visibleArchive: true,
            serviceHanle: service
        })
    }

    async showModalEditService(service) {
        this.editServiceRef.current.setServiceFromParent(service);
        this.setState({
            visibleEdit: true
        })
    }

    submitEditService = (service) => {
        this.props.actions.service.editService(service, service.serviceId);
        this.setState({ visibleEdit: false })
    }

    restoreService(service) {
        this.setState({
            visibleRestore: true,
            serviceHanle: service
        })
    }

    // ------ ADD EDIT STAFF -----
    submitAddStaff = (staff) => {
        this.props.actions.staff.addStaffByMerchant(staff)
    }

    submitEditStaff = (staff, id) => {
        this.props.actions.staff.editStaff(staff, id)
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    servicesByMerchant: state.service.servicesByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant,
    listServicesSearch: state.service.listServicesSearch,
    isShowSearchService: state.service.isShowSearchService
})



export default connectRedux(mapStateToProps, TabExtra);