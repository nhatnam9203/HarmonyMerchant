import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm,PopupAddEditProduct} from '@components';
import { scaleSzie, getCategoryName ,getArrayNameCategories} from '@utils';
import HeaderTableProducts from './HeaderTableProducts';
import RowTableProducts from './RowTableProducts';
import RowEmptyTableProducts from './RowEmptyTableProducts';
import connectRedux from '@redux/ConnectRedux';


class TabProducts extends React.Component {

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
        this.addProductRef = React.createRef();
        this.editProductRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.product.getProductsByMerchant();
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
        this.props.actions.product.archiveProduct(serviceInfoHandle.productId);
        this.setState({
            visibleArchive: false
        })
    }

    restoreStaffYess() {
        const { serviceInfoHandle } = this.state;
        this.props.actions.product.restoreProduct(serviceInfoHandle.productId);
        this.setState({
            visibleRestore: false
        })
    }

    async editService(product) {
        this.editProductRef.current.setProductInfoFromParent(product);
        this.setState({
            visibleEdit: true
        })
    }

    showModalAddProduct = () => {
        const { categoriesByMerchant } = this.props;
        if (getArrayNameCategories(categoriesByMerchant,'Product').length > 0) {
            this.setState({ visibleAdd: true });
            this.addProductRef.current.setDefaultStateFromParent();
        } else {
            alert('Create category before add service please !')
        }
    }

    addProduct = product => {
        this.props.actions.product.addProductByMerchant(product);
        this.setState({ visibleAdd: false })
    }

    editProduct = product => {
        this.props.actions.product.editProduct(product, product.productId);
        this.setState({ visibleEdit: false })
    }

    renderTable() {
        const { productsByMerchantId, categoriesByMerchant,refreshListProducts } = this.props;
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableProducts />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={productsByMerchantId}
                        renderItem={({ item, index }) => <RowTableProducts
                            ref={this.setRefService}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            product={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
                            restoreService={() => this.togglePopupRestore(true, item)}
                            editService={() => this.editService(item)}
                            categoryName={getCategoryName(categoriesByMerchant, item.categoryId)}
                        />}
                        keyExtractor={(item, index) => `${item.productId}`}
                        ListEmptyComponent={<RowEmptyTableProducts />}
                        refreshing={refreshListProducts}
                    onRefresh={() => this.props.actions.product.getProductsByMerchant(false)}
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
                    addNew={this.showModalAddProduct}
                    backTab={() => this.props.backTab()}
                    nextTab={() => this.props.nextTab()}
                />
                <PopupConfirm
                    ref={this.addProductRef}
                    visible={visibleArchive}
                    title="Confirmation"
                    message="Do you want to Archive this Product ?"
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveServiceYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Product ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
                <PopupAddEditProduct
                    ref={this.addProductRef}
                    visible={visibleAdd}
                    title="Add Product"
                    titleButton="Add"
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    confimYes={this.addProduct}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupAddEditProduct
                    ref={this.editProductRef}
                    visible={visibleEdit}
                    title="Edit Product"
                    titleButton="Save"
                    isSave={true}
                    onRequestClose={() => this.setState({ visibleEdit: false })}
                    editProduct={this.editProduct}
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
    productsByMerchantId: state.product.productsByMerchantId,
    categoriesByMerchant: state.category.categoriesByMerchant,
    refreshListProducts: state.product.refreshListProducts
});

export default connectRedux(mapStateToProps, TabProducts);


