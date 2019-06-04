import React from 'react';

import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';


class TabStaffManagement extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: false,
            visibleArchive: false,
            archirveStaff: {}
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

    async   togglePopupArchive(bool, staff = {}) {
        if (bool === true) {
            await this.setState({
                archirveStaff: staff
            })
        }
        this.setState(prevState => ({
            visibleArchive: bool
        }))
    }

    editStaff() {
        this.setState({
            isAddStaff: true
        })
    }

    archirveStaffYess() {
        const { archirveStaff } = this.state;
        console.log('archirveStaff : ',archirveStaff);
        this.inputRefsStaff.forEach(ref => {
            if(ref.props.staff.id === archirveStaff.id){
                ref.handleArchirveStaff();
            }
        })
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabStaffManagement);