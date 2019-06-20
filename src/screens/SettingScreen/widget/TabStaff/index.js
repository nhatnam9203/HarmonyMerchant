import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabStaff extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: true,
            keySearch: '',
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
    isAddStaff: state.staff.isAddStaff
})



export default connectRedux(mapStateToProps, TabStaff);