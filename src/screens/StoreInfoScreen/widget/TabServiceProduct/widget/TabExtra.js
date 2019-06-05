import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';
import HeaderTableExtra from './HeaderTableExtra';
import RowTableServices from './RowTableServices';
import IMAGE from '../../../../../resources';
import PopupEditAddService from './PopupEditAddService';

const FakeData = [{
    id: 'HP000002',
    name: 'Pena Valdez',
    role: 'Staff',
    status: 'Active'
},
{
    id: 'HP000003',
    name: 'Jessica Miles',
    role: 'Staff',
    status: 'Active'
},
{
    id: 'HP000004',
    name: 'Pena Valdez',
    role: 'Staff',
    status: 'Active'
}, {
    id: 'HP000005',
    name: 'Jessica Miles',
    role: 'Staff',
    status: 'Active'
}]


class TabExtra extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visibleArchive: false,
            visibleRestore: false,
            visibleAdd:false,
            visibleEdit:false,
            serviceInfoHandle: {}
        }

        this.inputRefsService = [];
    }

    setRefService = (ref) => {
        if (ref != null) {
            this.inputRefsService.push(ref);
        }
    };

    async  togglePopupArchive(bool, service = {}) {
        if (bool === true) {
            await this.setState({
                serviceInfoHandle: service
            })
        }
        this.setState(prevState => ({
            visibleArchive: bool
        }))
    }

    async  togglePopupRestore(bool, service = {}) {
        if (bool === true) {
            await this.setState({
                serviceInfoHandle: service
            })
        }
        this.setState(prevState => ({
            visibleRestore: bool
        }))
    }

    archirveServiceYess() {
        const { serviceInfoHandle } = this.state;
        for (let i = 0; i < this.inputRefsService.length; i++) {
            if (this.inputRefsService[i].props.staff.id === serviceInfoHandle.id) {
                this.inputRefsService[i].handleArchirveStaff();
                break;
            }
        }
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { serviceInfoHandle } = this.state;
        for (let i = 0; i < this.inputRefsService.length; i++) {
            if (this.inputRefsService[i].props.staff.id === serviceInfoHandle.id) {
                this.inputRefsService[i].handleRestoreStaff();
                break;
            }
        }
        this.setState({
            visibleRestore: false
        })
    }

   async editService(service){
      await  this.setState({
            serviceInfoHandle:service
        });
        this.setState({
            visibleEdit:true
        })
    }

    renderTable() {
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableExtra />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={FakeData}
                        renderItem={({ item, index }) => <RowTableServices
                            ref={this.setRefService}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            staff={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
                            restoreService={() => this.togglePopupRestore(true, item)}
                            editService={() => this.editService(item)}
                        />}
                        keyExtractor={(item, index) => item.id}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { visibleArchive, visibleRestore ,visibleAdd,visibleEdit} = this.state;
        return (
            <View style={styles.container} >
                {this.renderTable()}
                <FooterTab 
                addNew={() => this.setState({visibleAdd:true})}
                />
                <PopupConfirm
                    visible={visibleArchive}
                    title="Confirmation"
                    message="Do you want to Archive this Category ?"
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveServiceYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Category ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
                <PopupEditAddService
                    visible={visibleAdd}
                    title="Add Category"
                    titleButton="Add"
                    onRequestClose={() => this.setState({visibleAdd:false})}
                    confimYes={() => this.setState({visibleAdd:false})}
                />
                <PopupEditAddService
                    visible={visibleEdit}
                    title="Edit Category"
                    titleButton="Save"
                    onRequestClose={() => this.setState({visibleEdit:false})}
                    confimYes={() => this.setState({visibleEdit:false})}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: scaleSzie(12)
    },
})

export default TabExtra;

