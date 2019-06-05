import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';
import HeaderTableCategories from './HeaderTableCategories';
import RowTableCategories from './RowTableCategories';
import IMAGE from '../../../../../resources';

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


class TabCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visibleArchive: false,
            visibleRestore: false,
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
    
    renderTable() {
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableCategories />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={FakeData}
                        renderItem={({ item, index }) => <RowTableCategories
                            ref={this.setRefService}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            staff={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
                            restoreStaff={() => this.togglePopupRestore(true, item)}
                            editStaff={() => this.editStaff()}
                        />}
                        keyExtractor={(item, index) => item.id}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { visibleArchive, visibleRestore } = this.state;
        return (
            <View style={styles.container} >
                {this.renderTable()}
                <FooterTab />
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

export default TabCategories;

