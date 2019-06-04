import React from 'react';

import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';


class TabStaffManagement extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['No.', 'Staff Name', 'ID', 'Role','Status','Actions'],
            tableData: [
                ['1', '2', '3', '4', '3', '4'],
                ['a', 'b', 'c', 'd', '3', '4'],
                ['1', '2', '3', '456\n789', '3', '4'],
                ['a', 'b', 'c', 'd', '3', '4']
            ]
        }
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabStaffManagement);