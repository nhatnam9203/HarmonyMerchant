import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm } from '@components';
import { scaleSzie } from '@utils';
import HeaderTableExtra from './HeaderTableExtra';
import RowTableExtra from './RowTableExtra';
import PopupEditAddExtra from './PopupEditAddExtra';
import RowEmptyTableExtra from './RowEmptyTableExtra';
import connectRedux from '@redux/ConnectRedux';

class TabExtra extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visibleArchive: false,
            visibleRestore: false,
            visibleAdd: false,
            visibleEdit: false,
            extraInfoHandle: {}
        }

        this.inputRefsService = [];
    }

    componentDidMount() {
        this.props.actions.extra.getExtraByMerchant();
    }

    setRefService = (ref) => {
        if (ref != null) {
            this.inputRefsService.push(ref);
        }
    };

    async  togglePopupArchive(bool, extra = {}) {
        if (bool === true) {
            await this.setState({
                extraInfoHandle: extra
            })
        }
        this.setState(prevState => ({
            visibleArchive: bool
        }))
    }

    async  togglePopupRestore(bool, service = {}) {
        if (bool === true) {
            await this.setState({
                extraInfoHandle: service
            })
        }
        this.setState(prevState => ({
            visibleRestore: bool
        }))
    }

    archirveServiceYess() {
        const { extraInfoHandle } = this.state;
        // for (let i = 0; i < this.inputRefsService.length; i++) {
        //     if (this.inputRefsService[i].props.staff.id === extraInfoHandle.id) {
        //         this.inputRefsService[i].handleArchirveStaff();
        //         break;
        //     }
        // }
        this.props.actions.extra.archiveExtra(extraInfoHandle.extraId);
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { extraInfoHandle } = this.state;
        // for (let i = 0; i < this.inputRefsService.length; i++) {
        //     if (this.inputRefsService[i].props.staff.id === extraInfoHandle.id) {
        //         this.inputRefsService[i].handleRestoreStaff();
        //         break;
        //     }
        // }
        this.props.actions.extra.restoreExtra(extraInfoHandle.extraId);
        this.setState({
            visibleRestore: false
        })
    }

    async editService(service) {
        await this.setState({
            extraInfoHandle: service
        });
        this.setState({
            visibleEdit: true
        })
    }

    renderTable() {
        const { extrasByMerchant } = this.props;
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableExtra />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={extrasByMerchant}
                        renderItem={({ item, index }) => <RowTableExtra
                            ref={this.setRefService}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            extra={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
                            restoreService={() => this.togglePopupRestore(true, item)}
                            editService={() => this.editService(item)}
                        />}
                        keyExtractor={(item, index) => `${item.extraId}`}
                        ListEmptyComponent={<RowEmptyTableExtra />}

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
                    message="Do you want to Archive this Extra ?"
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveServiceYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Extra ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
                <PopupEditAddExtra
                    visible={visibleAdd}
                    title="Add Extra"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddExtra={() => this.setState({ visibleAdd: false })}
                />
                <PopupEditAddExtra
                    visible={visibleEdit}
                    title="Edit Extra"
                    titleButton="Save"
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    doneAddExtra={() => this.setState({ visibleEdit: false })}
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
    extrasByMerchant: state.extra.extrasByMerchant
});

export default connectRedux(mapStateToProps, TabExtra);


