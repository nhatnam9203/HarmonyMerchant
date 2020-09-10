import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getArrayNameCategories, getCategoryIdByName } from '@utils';

class TabService extends Layout {

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
            serviceHanle: {},
            visibleAdd: false,
            visibleEdit: false,
            // ----
            searchFilter: {
                keySearch: '',
                category: '',
                status: ''
            }
        };
        this.addServiceRef = React.createRef();
        this.editServiceRef = React.createRef();
    }

    setStateFromParent = async () => {
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
                this.searchService();
            }, 100);
        } else {
            if (value === "") {
                this.searchService();
            }
        }
    }

    clearSearchText = () => {
        this.updateSearchFilterInfo('keySearch', "");
        const { searchFilter } = this.state;
        const { category, status } = searchFilter;
        const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
        this.props.actions.service.getServicesByMerchant("", temptCategory, status, { ...searchFilter, category: temptCategory });
    }

    searchService = (isShowLoading = true) => {
        const { searchFilter } = this.state;
        const { keySearch, category, status } = searchFilter;
        const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
        this.props.actions.service.getServicesByMerchant(keySearch, temptCategory, status,  { ...searchFilter, category: temptCategory }, isShowLoading);
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
        const { searchFilter } = this.state;
        const {  category } = searchFilter;
        const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
        await this.setState({
            visibleArchive: false,
        });
        this.props.actions.service.archiveService(this.state.serviceHanle.serviceId, { ...searchFilter, category: temptCategory });
    }

    restoreServiceYess = async () => {
        const { searchFilter } = this.state;
        const {  category } = searchFilter;
        const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.service.restoreService(this.state.serviceHanle.serviceId, { ...searchFilter, category: temptCategory });
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
        const { searchFilter } = this.state;
        const {  category } = searchFilter;
        const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
        this.props.actions.service.addServiceByMerchant(service, { ...searchFilter, category: temptCategory });
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

    submitEditService = async (service) => {
        const { searchFilter } = this.state;
        const {  category } = searchFilter;
        const temptCategory = category != '' ? getCategoryIdByName(this.props.categoriesByMerchant, category, 'Service') : '';
        await this.setState({ visibleEdit: false })
        this.props.actions.service.editService(service, service.serviceId, { ...searchFilter, category: temptCategory });

    }

    restoreService(service) {
        this.setState({
            visibleRestore: true,
            serviceHanle: service
        })
    }

    updateServicePosition = (data, isShowSearchService) => {
        if (!isShowSearchService) {
            const servicesUpdate = data.map((service, index) => {
                return {
                    ...service,
                    position: index
                }
            });
            const body = data.map((service, index) => {
                return {
                    serviceId: service.serviceId,
                    position: index
                }
            });
            this.props.actions.service.updateServicePositionLocal(servicesUpdate);
            this.props.actions.service.updateSerivePosition(body);
        }

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



export default connectRedux(mapStateToProps, TabService);