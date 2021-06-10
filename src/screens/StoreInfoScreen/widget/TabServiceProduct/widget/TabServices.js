import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm, PopupAddEditService } from '@components';
import { scaleSize, getCategoryName, getArrayNameCategories,localize } from '@utils';
import HeaderTableServices from './HeaderTableServices';
import RowTableServices from './RowTableServices';
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

    async archirveServiceYess() {
        await this.setState({
            visibleArchive: false
        })
        const { serviceInfoHandle } = this.state;
        this.props.actions.service.archiveService(serviceInfoHandle.serviceId);

    }

   async restoreStaffYess() {
    await  this.setState({
        visibleRestore: false
    })
        const { serviceInfoHandle } = this.state;
        this.props.actions.service.restoreService(serviceInfoHandle.serviceId);

    }

    addService =async service => {
        await   this.setState({ visibleAdd: false })
        this.props.actions.service.addServiceByMerchant(service);

    }

    async showModalEditService(service) {
        this.editServiceRef.current.setServiceFromParent(service);
        this.setState({
            visibleEdit: true
        })
    }

    editService =async service => {
        await this.setState({ visibleEdit: false })
        this.props.actions.service.editService(service, service.serviceId);

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
        if (getArrayNameCategories(categoriesByMerchant, 'Service').length > 0) {
            this.addServiceRef.current.setDefaultStateFromParent();
            this.setState({ visibleAdd: true });
        } else {
            alert('Create service category before add service please !')
        }
    }

    renderTable() {
        const { servicesByMerchant, categoriesByMerchant, refreshListServices } = this.props;
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
                        refreshing={refreshListServices}
                        onRefresh={() => this.props.actions.service.getServicesByMerchant("","","",false,false)}
                    />
                </View>
            </View>
        );
    }

    render() {
        const {language} = this.props;
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
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Archive this Service', language)}?`}
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveServiceYess()}
                />
                <PopupConfirm
                    ref={this.addServiceRef}
                    visible={visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Service', language)}?`}
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
                <PopupAddEditService
                    ref={this.addServiceRef}
                    visible={visibleAdd}
                    title={localize('Add Service', language)}
                    titleButton={localize('Add', language)}
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddService={this.addService}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupAddEditService
                    ref={this.editServiceRef}
                    visible={visibleEdit}
                    title={localize('Edit Service', language)}
                    titleButton={localize('Save', language)}
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
        paddingTop: scaleSize(12)
    },
})

const mapStateToProps = state => ({
    profile: state.authMerchant.merchant,
    servicesByMerchant: state.service.servicesByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant,
    refreshListServices: state.service.refreshListServices,
    language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, TabServices);

