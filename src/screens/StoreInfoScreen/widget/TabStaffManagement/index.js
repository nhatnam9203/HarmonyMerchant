import React from 'react';

import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';


class TabStaffManagement extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: false,
            visibleArchive: false,
            visibleRestore: false,
            infoStaffHandle: {}
        }
        this.inputRefsStaff = [];
    }

    setRefStaff = (ref) => {
        if (ref != null) {
            this.inputRefsStaff.push(ref);
        }

    };

    addNewStaff = () => {
        this.setState(prevState => ({
            isAddStaff: true
        }));
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

    editStaff() {
        this.setState({
            isAddStaff: true
        });
        this.inputRefsStaff = [];
    }

    archirveStaffYess() {
        const { infoStaffHandle } = this.state;
        for (let i = 0; i < this.inputRefsStaff.length; i++) {
            if (this.inputRefsStaff[i].props.staff.id === infoStaffHandle.id) {
                this.inputRefsStaff[i].handleArchirveStaff();
                break;
            }
        }
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { infoStaffHandle } = this.state;
        for (let i = 0; i < this.inputRefsStaff.length; i++) {
            if (this.inputRefsStaff[i].props.staff.id === infoStaffHandle.id) {
                this.inputRefsStaff[i].handleRestoreStaff();
                break;
            }
        }
        this.setState({
            visibleRestore: false
        })
    }

    componentWillUnmount() {
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabStaffManagement);