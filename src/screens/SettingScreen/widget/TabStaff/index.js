import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabStaff extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isAddStaff: true,
            visibleArchive: false,
            visibleRestore: false,
            isEditStaff: false,
            filter: {
                role: '',
                status: ''
            },
            staffHandle: {},
            // ----
            searchFilter: {
                keySearch: '',
                role: '',
                status: ''
            }
        }
    }

    updateSearchFilterInfo(key, value, keyParent = '') {
        const { searchFilter } = this.state;
        if (keyParent !== '') {
            const temptParent = searchFilter[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
            this.setState({
                searchFilter: temptUpdate
            })
        } else {
            const temptUpdate = { ...searchFilter, [key]: value };
            this.setState({
                searchFilter: temptUpdate
            })
        }
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
        this.props.actions.staff.archiveStaff(this.state.staffHandle.staffId);
    }

    archirveRestoreYess = async () => {
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.staff.restoreStaff(this.state.staffHandle.staffId);
    }

    searchStaff = () => {
        const { searchFilter } = this.state;
        const { keySearch,role,status} = searchFilter;
        if(keySearch == '' && role == '' & status == ''){
            this.props.actions.staff.clearSearch();
        }else{
            this.props.actions.staff.searchStaffByName(keySearch,role,status);
        }
        
    }

    addStaff = async () => {
        await this.setState({
            isEditStaff: false
        })
        this.props.actions.staff.switchAddStaff(true);
    }

    archiveStaff(staff) {
        this.setState({
            visibleArchive: true,
            staffHandle: staff
        })
    }

    async editStaff(staff) {
        await this.setState({
            staffHandle: staff,
            isEditStaff: true
        });
        this.props.actions.staff.switchAddStaff(true);
    }

    restoreStaff(staff) {
        this.setState({
            visibleRestore: true,
            staffHandle: staff
        })
    }

    // ------ ADD EDIT STAFF -----
    submitAddStaff = (staff) => {
        this.props.actions.staff.addStaffByMerchant(staff)
    }

    submitEditStaff = (staff, id) => {
        this.props.actions.staff.editStaff(staff, id)
    }

    updateStaffsPosition =(data ,isShowSearch) =>{
        if(!isShowSearch){
            const staffsUpdate = data.map((staff, index) => {
                return {
                    ...staff,
                    position: index
                }
            });
            const body = data.map((staff, index) => {
                return {
                    staffId: staff.staffId,
                    position: index
                }
            });
            this.props.actions.staff.updateStaffsPositionLocal(staffsUpdate);
            this.props.actions.staff.updateStaffsPosition(body);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isShowSearch,isGetListSearchStaff } = this.props;
        if(isShowSearch && isGetListSearchStaff){
            this.searchStaff();
        }
        
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    isAddStaff: state.staff.isAddStaff,
    isShowSearch: state.staff.isShowSearch,
    listSearchStaff: state.staff.listSearchStaff,
    stateCity: state.dataLocal.stateCity,
    refreshListStaffs: state.staff.refreshListStaffs,
    isGetListSearchStaff: state.staff.isGetListSearchStaff
})



export default connectRedux(mapStateToProps, TabStaff);