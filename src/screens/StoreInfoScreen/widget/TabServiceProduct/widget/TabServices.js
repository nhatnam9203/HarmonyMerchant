import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm } from '@components';
import { scaleSzie } from '@utils';
import HeaderTableServices from './HeaderTableServices';
import RowTableServices from './RowTableServices';
import PopupAddService from './PopupAddService';
import RowEmptyTableServices from './RowEmptyTableServices';
import connectRedux from '@redux/ConnectRedux';



class TabServices extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visibleArchive: false,
            visibleRestore: false,
            visibleAdd: false,
            visibleEdit: false,
            serviceInfoHandle: {}
        }

        this.inputRefsService = [];
    }

    componentDidMount(){
        this.props.actions.service.getServicesByMerchant();
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

    async editService(service) {
        await this.setState({
            serviceInfoHandle: service
        });
        this.setState({
            visibleEdit: true
        })
    }

    renderTable() {
        const {servicesByMerchant } = this.props;
         return (
            <View style={{ flex: 1 }} >
                <HeaderTableServices />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={servicesByMerchant}
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
                        ListEmptyComponent={<RowEmptyTableServices />}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { visibleArchive, visibleRestore, visibleAdd, visibleEdit } = this.state;
        return (
            <View style={styles.container} >
                {this.renderTable()}
                <FooterTab
                    addNew={() => this.setState({ visibleAdd: true })}
                    backTab={() => this.props.backTab()}
                    nextTab={() => this.props.nextTab()}
                />
                <PopupConfirm
                    visible={visibleArchive}
                    title="Confirmation"
                    message="Do you want to Archive this Service ?"
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveServiceYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Service ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
                <PopupAddService
                    visible={visibleAdd}
                    title="Add Service"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddService={() => this.setState({ visibleAdd: false })}
                />
                <PopupAddService
                    visible={visibleEdit}
                    title="Edit Category"
                    titleButton="Save"
                    isSave={true}
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    doneAddService={() => this.setState({ visibleEdit: false })}
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

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    servicesByMerchant: state.service.servicesByMerchant
});

export default connectRedux(mapStateToProps, TabServices);

