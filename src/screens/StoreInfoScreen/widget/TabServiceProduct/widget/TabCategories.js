import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm, PopupEditAddCategories } from '@components';
import { scaleSzie } from '@utils';
import HeaderTableCategories from './HeaderTableCategories';
import RowTableCategories from './RowTableCategories';
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
            categoryInfoHandle: {}
        }

        this.inputRefCategory = [];
        this.refAddCategory = React.createRef();
        this.refEditCategory = React.createRef();
    }

    componentDidMount() {
        this.props.actions.category.getCategoriesByMerchantId();
    }

    setRefCategory = (ref) => {
        if (ref != null) {
            this.inputRefCategory.push(ref);
        }
    };

    async  togglePopupArchive(bool, category = {}) {
        if (bool === true) {
            await this.setState({
                categoryInfoHandle: category
            })
        }
        this.setState(prevState => ({
            visibleArchive: bool
        }))
    }

    async  togglePopupRestore(bool, category = {}) {
        if (bool === true) {
            await this.setState({
                categoryInfoHandle: category
            })
        }
        this.setState(prevState => ({
            visibleRestore: bool
        }))
    }

    archirveServiceYess() {
        const { categoryInfoHandle } = this.state;
        this.props.actions.category.archiveCategory(categoryInfoHandle.categoryId);
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { categoryInfoHandle } = this.state;
        this.props.actions.category.restoreCategory(categoryInfoHandle.categoryId);
        this.setState({
            visibleRestore: false
        })
    }

    async editService(category) {
        this.refEditCategory.current.setCategoryFromParent(category);
        this.setState({
            visibleEdit: true
        })
    }

    addCategory = (category) => {
        this.props.actions.category.addCategory(category);
        this.setState({
            visibleAdd: false
        });
    }

    editCategory = async (category) => {
        // ---- edit category ----
        this.props.actions.category.editCategory({
            CategoryType: category.categoryType,
            name: category.name
        }, category.categoryId);
        this.setState({
            visibleEdit: false
        });
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
                        renderItem={({ item, index }) => <RowTableCategories
                            ref={this.setRefCategory}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            category={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
                            restoreService={() => this.togglePopupRestore(true, item)}
                            editService={() => this.editService(item)}

                        />}
                        keyExtractor={(item, index) => `${item.categoryId}`}
                        ListEmptyComponent={<RowEmptyTableCategories />}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { visibleArchive, visibleRestore, visibleAdd, visibleEdit,
        } = this.state;
        return (
            <View style={styles.container} >
                {this.renderTable()}
                <FooterTab
                    addNew={() => {
                        this.refAddCategory.current.setStateDefaultFromParent();
                        this.setState({ visibleAdd: true });
                    }}
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
                    ref={this.refAddCategory}
                    visible={visibleAdd}
                    title="Add Category"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    confimYes={this.addCategory}
                />
                <PopupEditAddCategories
                    ref={this.refEditCategory}
                    visible={visibleEdit}
                    title="Edit Category"
                    titleButton="Save"
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    confimYes={this.editCategory}
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


