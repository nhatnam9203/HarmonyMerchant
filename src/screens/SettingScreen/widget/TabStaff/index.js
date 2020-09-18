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

    setStateFromParent = async () => {
        await this.setState({
            searchFilter: {
                keySearch: '',
                role: '',
                status: ''
            }
        });
    }

    async updateSearchFilterInfo(key, value, keyParent = '') {
        const { searchFilter } = this.state;
        if (keyParent !== '') {
            const temptParent = searchFilter[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
            await this.setState({
                searchFilter: temptUpdate
            });
        } else {
            const temptUpdate = { ...searchFilter, [key]: value };
            await this.setState({
                searchFilter: temptUpdate
            });
        }
        if (key !== "keySearch") {
            setTimeout(() => {
                this.searchStaff();
            }, 100);
        }else{
            if(value === ""){
                this.searchStaff();
            }
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
        const { searchFilter } = this.state;
        await this.setState({
            visibleArchive: false,
        });
        this.props.actions.staff.archiveStaff(this.state.staffHandle.staffId, searchFilter);
    }

    archirveRestoreYess = async () => {
        const { searchFilter } = this.state;
        await this.setState({
            visibleRestore: false,
        });
        this.props.actions.staff.restoreStaff(this.state.staffHandle.staffId, searchFilter);
    }

    searchStaff = (isShowLoading = true) => {
        const { searchFilter } = this.state;
        const { keySearch, role, status } = searchFilter;
        this.props.actions.staff.getStaffByMerchantId(keySearch, role, status,searchFilter,isShowLoading);
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
        const { searchFilter } = this.state;
        this.props.actions.staff.addStaffByMerchant(staff,searchFilter);
    }

    submitEditStaff = (staff, id) => {
        const { searchFilter } = this.state;
        this.props.actions.staff.editStaff(staff, id,searchFilter);
    }

    findIsActiveOfStaff = (staffId) => {
        const { listStaffByMerchant } = this.props;
        const staffSelect = listStaffByMerchant.find((staff) => staff.staffId === staffId);
        if (staffSelect) {
            return staffSelect.isActive;
        }
        return false;
    }

    updateStaffsPosition = (data, isShowSearchStaff) => {
        if (!isShowSearchStaff) {
            const staffsUpdate = data.map((staff, index) => {
                // console.log("--- staff : ",staff);
                return {
                    ...staff,
                    // isActive: this.findIsActiveOfStaff(staff.staffId),
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

    clearSearchText = () => {
        const { searchFilter } = this.state;
        const { role, status } = searchFilter;

        this.updateSearchFilterInfo("keySearch", "");
        this.props.actions.staff.getStaffByMerchantId("", role, status,searchFilter);

    }

    toggleStaffActive = (staff, isActive) => {
        const { listStaffByMerchant } = this.props;
        const { searchFilter } = this.state;

        const tempStaffList = [...listStaffByMerchant];
        for (let i = 0; i < tempStaffList.length; i++) {
            if (tempStaffList[i].staffId === staff.staffId) {
                tempStaffList[i].isActive = isActive;
                break;
            }
        }
        this.props.actions.staff.updateStaffsPositionLocal(tempStaffList);
        this.props.actions.staff.editStaff({
            ...staff,
            workingTime: staff.workingTimes,
            salary: staff.salaries,
            tipFee: staff.tipFees,
            productSalary: staff.productSalaries,
            address: {
                street: staff.address ? staff.address : "",
                city: staff.city ? staff.city : "",
                state: staff.stateId ? staff.stateId : 0,
                zip: staff.zip ? staff.zip : "",
            },
            roles: {
                nameRole: staff.roleName ? staff.roleName : ""
            }
            ,
            isActive
        }, staff.staffId ? staff.staffId : 0,
        searchFilter
        )
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    isAddStaff: state.staff.isAddStaff,
    isShowSearchStaff: state.staff.isShowSearchStaff,
    listSearchStaff: state.staff.listSearchStaff,
    stateCity: state.dataLocal.stateCity,
    refreshListStaffs: state.staff.refreshListStaffs,
    isGetListSearchStaff: state.staff.isGetListSearchStaff,
    isShowSearchResult: state.staff.isShowSearchResult
})



export default connectRedux(mapStateToProps, TabStaff);