import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm } from '@components';
import { scaleSzie, getCategoryName } from '@utils';
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
        this.addServiceRef = React.createRef();
        this.editServiceRef = React.createRef();
    }

    componentDidMount() {
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
        this.props.actions.service.archiveService(serviceInfoHandle.serviceId);
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { serviceInfoHandle } = this.state;
        this.props.actions.service.restoreService(serviceInfoHandle.serviceId);
        this.setState({
            visibleRestore: false
        })
    }

    addService = service => {
        this.props.actions.service.addServiceByMerchant(service);
        this.setState({ visibleAdd: false })
    }

    async showModalEditService(service) {
        this.editServiceRef.current.setServiceFromParent(service);
        this.setState({
            visibleEdit: true
        })
    }

    editService = service => {
        this.props.actions.service.editService(service, service.serviceId);
        this.setState({ visibleEdit: false })
    }

    getExtraName(extras) {
        if (extras.length > 0) {
            let temptExtraName = '';
            extras.forEach(extra => {
                if (temptExtraName == '') {
                    temptExtraName = `${extra.name}`
                } else {
                    temptExtraName = `${temptExtraName},${extra.name}`
                }
            });
            return temptExtraName;
        }
        return ''
    }

    showModalAddService = () => {
        const { categoriesByMerchant } = this.props;
        if (categoriesByMerchant.length > 0) {
            this.addServiceRef.current.setDefaultStateFromParent();
            this.setState({ visibleAdd: true });
        } else {
            alert('Create category before add service please !')
        }

    }

    renderTable() {
        const { servicesByMerchant, categoriesByMerchant } = this.props;
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
                            service={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
                            restoreService={() => this.togglePopupRestore(true, item)}
                            editService={() => this.showModalEditService(item)}
                            categoryName={getCategoryName(categoriesByMerchant, item.categoryId)}
                            extraName={this.getExtraName(item.extras)}
                        />}
                        keyExtractor={(item, index) => `${item.serviceId}`}
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
                    addNew={this.showModalAddService}
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
                    ref={this.addServiceRef}
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Service ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
                <PopupAddService
                    ref={this.addServiceRef}
                    visible={visibleAdd}
                    title="Add Service"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddService={this.addService}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupAddService
                    ref={this.editServiceRef}
                    visible={visibleEdit}
                    title="Edit Service"
                    titleButton="Save"
                    isSave={true}
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    editService={this.editService}
                    categoriesByMerchant={this.props.categoriesByMerchant}
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
    servicesByMerchant: state.service.servicesByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant
});

export default connectRedux(mapStateToProps, TabServices);

