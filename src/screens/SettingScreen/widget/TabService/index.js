import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabService extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: true,
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
                role: '',
                status: ''
            }
        };
        this.addServiceRef = React.createRef();
        this.editServiceRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.service.getServicesByMerchant();
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

    searchStaff = () => {
        const { searchFilter } = this.state;
        const { keySearch, role, status } = searchFilter;
        this.props.actions.staff.searchStaffByName(keySearch, role, status);
    }

    addStaff = async () => {
        await this.setState({
            isEditStaff: false
        })
        this.props.actions.staff.switchAddStaff(true);
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
    profile: state.dataLocal.profile,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    isAddStaff: state.staff.isAddStaff,
    isShowSearch: state.staff.isShowSearch,
    listSearchStaff: state.staff.listSearchStaff,
    stateCity: state.dataLocal.stateCity,

    servicesByMerchant: state.service.servicesByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant
})



export default connectRedux(mapStateToProps, TabService);