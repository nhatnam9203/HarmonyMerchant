import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabStaff extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: true,
            keySearch: '',
            visibleArchive: false,
            filter: {
                role: '',
                status: ''
            }
        }
    }

    componentDidMount() {
        const { profile } = this.props;
        this.props.actions.staff.getStaffByMerchantId(profile.merchantId);
    }

    togglePopupArchive =(visible) =>{
        this.setState({
            visibleArchive:visible
        })
    }

    archirveStaffYess =() =>{
        
    }

    searchStaff = () => {
        const { keySearch } = this.state;
        this.props.actions.staff.searchStaffByName(keySearch);
    }

    addStaff = () => {
        // this.setState({
        //     isAddStaff: true
        // })
        this.props.actions.staff.switchAddStaff(true);
    }

    archiveStaff(staff) {
        this.setState({
            visibleArchive:true
        })
    }

    editStaff(staff) {

    }

    restoreStaff(staff) {

    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    isAddStaff: state.staff.isAddStaff,
    isShowSearch: state.staff.isShowSearch,
    listSearchStaff:state.staff.listSearchStaff
})



export default connectRedux(mapStateToProps, TabStaff);