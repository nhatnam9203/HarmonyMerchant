import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm } from '@components';
import { scaleSzie } from '@utils';
import HeaderTableCategories from './HeaderTableCategories';
import RowTableCategories from './RowTableCategories';
import PopupEditAddCategories from './PopupEditAddCategories';
import RowEmptyTableCategories from './RowEmptyTableCategories';
import connectRedux from '@redux/ConnectRedux';


class TabCategories extends React.Component {

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

    componentDidMount() {
        const { profile } = this.props
        this.props.actions.category.getCategoriesByMerchantId(profile.id);
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

    addCategory = async (category) => {
        const { profile } = this.props
        const temptCategory = { ...category, merchantid: profile.id }
        console.log(temptCategory);
        await this.setState({
            visibleAdd: false
        });
        this.props.actions.category.addCategory(temptCategory, profile.id);
    }

    // --------- Render ------

    renderTable() {
        const { categoriesByMerchant } = this.props;
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableCategories />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={categoriesByMerchant}
                        // data={FakeData}
                        renderItem={({ item, index }) => <RowTableCategories
                            ref={this.setRefService}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            category={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
                            restoreService={() => this.togglePopupRestore(true, item)}
                            editService={() => this.editService(item)}

                        />}
                        keyExtractor={(item, index) => `${item.id}`}
                        ListEmptyComponent={<RowEmptyTableCategories />}
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
                <PopupEditAddCategories
                    visible={visibleAdd}
                    title="Add Category"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    confimYes={this.addCategory}
                />
                <PopupEditAddCategories
                    visible={visibleEdit}
                    title="Edit Category"
                    titleButton="Save"
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    confimYes={() => this.setState({ visibleEdit: false })}
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
    categoriesByMerchant: state.category.categoriesByMerchant
});

export default connectRedux(mapStateToProps, TabCategories);


