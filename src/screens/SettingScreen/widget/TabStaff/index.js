import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabStaff extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: true,
            keySearch: '',
            visibleArchive: false,
            visibleRestore: false,
            filter: {
                role: '',
                status: ''
            },
            staffHandle: {}
        }
    }

    componentDidMount() {
        const { profile } = this.props;
        this.props.actions.staff.getStaffByMerchantId(profile.merchantId);
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

    archirveStaffYess = async () => {
        await this.setState({
            visibleArchive: false,
        });
        this.props.actions.staff.archiveStaff(this.state.staffHandle.staffId)
    }

    archirveRestoreYess = async () => {
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.staff.restoreStaff(this.state.staffHandle.staffId)
    }

    searchStaff = () => {
        const { keySearch } = this.state;
        this.props.actions.staff.searchStaffByName(keySearch);
    }

    addStaff = () => {
        this.props.actions.staff.switchAddStaff(true);
    }

    archiveStaff(staff) {
        this.setState({
            visibleArchive: true,
            staffHandle: staff
        })
    }

    editStaff(staff) {

    }

    restoreStaff(staff) {
        this.setState({
            visibleRestore: true,
            staffHandle: staff
        })
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    isAddStaff: state.staff.isAddStaff,
    isShowSearch: state.staff.isShowSearch,
    listSearchStaff: state.staff.listSearchStaff
})



export default connectRedux(mapStateToProps, TabStaff);