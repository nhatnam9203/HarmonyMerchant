import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabStaffManagement extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: false,
            visibleArchive: false,
            visibleRestore: false,
            infoStaffHandle: {},
            isEditStaff:false
        }
        this.inputRefsStaff = [];
        this.staffInfoRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.staff.getStaffByMerchantId();
    }

    setRefStaff = (ref) => {
        if (ref != null) {
            this.inputRefsStaff.push(ref);
        }
    };

    submitAddStaff =(staff)=>{
        this.props.actions.staff.addStaffByMerchant(staff)
    }

    submitEditStaff =(staff,id) =>{
        this.props.actions.staff.editStaff(staff,id)
    }

    addNewStaff = () => {
        this.props.actions.staff.switchAddStaff(true);
        this.inputRefsStaff = [];
    }

    async  togglePopupArchive(bool, staff = {}) {
        if (bool === true) {
            await this.setState({
                infoStaffHandle: staff
            })
        }
        this.setState(prevState => ({
            visibleArchive: bool
        }))
    }

    async  togglePopupRestore(bool, staff = {}) {
        if (bool === true) {
            await this.setState({
                infoStaffHandle: staff
            })
        }
        this.setState(prevState => ({
            visibleRestore: bool
        }))
    }

    async editStaff(staff) {
           await this.setState({
            infoStaffHandle: staff,
            isEditStaff:true
            });
        this.props.actions.staff.switchAddStaff(true);
    }

    archirveStaffYess() {
        const { infoStaffHandle } = this.state;
        this.props.actions.staff.archiveStaff(infoStaffHandle.staffId);
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { infoStaffHandle } = this.state;
        this.props.actions.staff.restoreStaff(infoStaffHandle.staffId);
        this.setState({
            visibleRestore: false
        })
    }

    componentWillUnmount() {
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    isAddStaff: state.staff.isAddStaff,
    language: state.dataLocal.language,
    stateCity: state.dataLocal.stateCity
})



export default connectRedux(mapStateToProps, TabStaffManagement);