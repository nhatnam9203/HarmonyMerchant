import React from 'react';

import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';


class TabStaffManagement extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: false,
            visibleArchive: false
        }
    }

    addNewStaff = () => {
        this.setState(prevState => ({
            isAddStaff: true
        }))
    }

    togglePopupArchive(bool){
        this.setState(prevState => ({
            visibleArchive: bool
        }))
    }

    editStaff(){
      this.setState({
          isAddStaff:true
      })
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabStaffManagement);