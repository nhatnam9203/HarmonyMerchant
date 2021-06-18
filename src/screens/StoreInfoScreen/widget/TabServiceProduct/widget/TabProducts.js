import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab, PopupConfirm,PopupAddEditProduct} from '@components';
import { scaleSize, getCategoryName ,getArrayNameCategories,localize} from '@utils';
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

   async archirveServiceYess() {
    await  this.setState({
        visibleArchive: false
    })
        const { serviceInfoHandle } = this.state;
        this.props.actions.product.archiveProduct(serviceInfoHandle.productId);

    }

  async  restoreStaffYess() {
    await  this.setState({
        visibleRestore: false
    })
        const { serviceInfoHandle } = this.state;
        this.props.actions.product.restoreProduct(serviceInfoHandle.productId);

    }

    async editService(product) {
        await   this.setState({
            visibleEdit: true
        })
        this.editProductRef.current?.setProductInfoFromParent(product);

    }

    showModalAddProduct = () => {
        const { categoriesByMerchant } = this.props;
        if (getArrayNameCategories(categoriesByMerchant,'Product').length > 0) {
            this.setState({ visibleAdd: true });
            this.addProductRef.current?.setDefaultStateFromParent();
        } else {
            alert('Create category before add service please !')
        }
    }

    addProduct =async product => {
        await this.setState({ visibleAdd: false })
        this.props.actions.product.addProductByMerchant(product);

    }

    editProduct = async product => {
        await this.setState({ visibleEdit: false })
        this.props.actions.product.editProduct(product, product.productId);

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
                    onRefresh={() => this.props.actions.product.getProductsByMerchant("", "", false)}
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
                    addNew={this.showModalAddProduct}
                    backTab={() => this.props.backTab()}
                    nextTab={() => this.props.nextTab()}
                />
                <PopupConfirm
                    ref={this.addProductRef}
                    visible={visibleArchive}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Archive this Product', language)}?`}
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveServiceYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Product', language)}?`}
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
                <PopupAddEditProduct
                    ref={this.addProductRef}
                    visible={visibleAdd}
                    title={localize('Add Product', language)}
                    titleButton={localize('Add', language)}
                    onRequestClose={() => this.setState({ visibleAdd: false })}
                    confimYes={this.addProduct}
                    categoriesByMerchant={this.props.categoriesByMerchant}
                />
                <PopupAddEditProduct
                    ref={this.editProductRef}
                    visible={visibleEdit}
                    title={localize('Edit Product', language)}
                    titleButton={localize('Save', language)}
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
        paddingTop: scaleSize(12)
    },
})

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    productsByMerchantId: state.product.productsByMerchantId,
    categoriesByMerchant: state.category.categoriesByMerchant,
    refreshListProducts: state.product.refreshListProducts,
    language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, TabProducts);


