import React from 'react';

import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';


class TabStaffManagement extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: false,
            visibleArchive: false,
            visibleRestore:false,
            infoStaffHandle: {}
        }
        this.inputRefsStaff = [];
    }

    setRefStaff = (ref) => {
        this.inputRefsStaff.push(ref);
    };

    addNewStaff = () => {
        this.setState(prevState => ({
            isAddStaff: true
        }))
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

    editStaff() {
        this.setState({
            isAddStaff: true
        })
    }

    archirveStaffYess() {
        const { infoStaffHandle } = this.state;
        this.inputRefsStaff.forEach(ref => {
            if (ref.props.staff.id === infoStaffHandle.id) {
                ref.handleArchirveStaff();
            }
        });
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess(){
        const { infoStaffHandle } = this.state;
        this.inputRefsStaff.forEach(ref => {
            if (ref.props.staff.id === infoStaffHandle.id) {
                ref.handleRestoreStaff();
            }
        });
        this.setState({
            visibleRestore: false
        })
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabStaffManagement);