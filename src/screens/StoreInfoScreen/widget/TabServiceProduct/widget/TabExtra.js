import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm,PopupEditAddExtra } from '@components';
import { scaleSzie } from '@utils';
import HeaderTableExtra from './HeaderTableExtra';
import RowTableExtra from './RowTableExtra';
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

        this.inputRefsExtra = [];
        this.addExtraRef = React.createRef();
        this.editExtraRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.extra.getExtraByMerchant();
    }

    setRefExtra = (ref) => {
        if (ref != null) {
            this.inputRefsExtra.push(ref);
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
        this.props.actions.extra.archiveExtra(extraInfoHandle.extraId);
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { extraInfoHandle } = this.state;
        this.props.actions.extra.restoreExtra(extraInfoHandle.extraId);
        this.setState({
            visibleRestore: false
        })
    }

    showModalAddExtra = () => {
        this.addExtraRef.current.setStateDefaultFromParent();
        this.setState({ visibleAdd: true })
    }

    addExtra = (extra) => {
        this.props.actions.extra.addExtraByMerchant(extra);
        this.setState({ visibleAdd: false })
    }

    editExtra = extra =>{
        this.props.actions.extra.editExtra(extra,extra.extraId);
        this.setState({
            visibleEdit: false
        })
    }

    async editService(extra) {
        this.editExtraRef.current.setExtraFromParent(extra);
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
                            ref={this.setRefExtra}
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
                    addNew={this.showModalAddExtra}
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
                    ref={this.addExtraRef}
                    visible={visibleAdd}
                    title="Add Extra"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    doneAddExtra={this.addExtra}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupEditAddExtra
                    ref={this.editExtraRef}
                    visible={visibleEdit}
                    title="Edit Extra"
                    titleButton="Save"
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    doneAddExtra={() => this.setState({ visibleEdit: false })}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                    isEdit={true}
                    editExtra={this.editExtra}
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
    extrasByMerchant: state.extra.extrasByMerchant,
    categoriesByMerchant: state.category.categoriesByMerchant
});

export default connectRedux(mapStateToProps, TabExtra);


