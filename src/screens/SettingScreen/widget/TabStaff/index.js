import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabStaff extends Layout {

    constructor(props) {
        super(props);
        this.state ={
            isAddStaff: true
        }
    }

    addStaff =() =>{
        this.setState({
            isAddStaff: true
        })
    }

    archiveStaff(staff){

    }

    editStaff(staff){

    }

    restoreStaff(staff){

    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabStaff);