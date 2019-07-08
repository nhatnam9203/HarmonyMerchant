import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";


class TabCheckout extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isShowColProduct: false,
            isShowColAmount: false,
            categorySelected: {
                categoryId: -1,
                categoryType: ''
            },
        }
    }

    getDataColProduct() {
        const { categorySelected } = this.state;
        const { productsByMerchantId, servicesByMerchant } = this.props;
        const data = categorySelected.categoryType === 'Service' ? servicesByMerchant : productsByMerchantId;
        const temptData = data.filter(item => {
            return item.categoryId === categorySelected.categoryId
        });
        return temptData;
    }

    onPressSelectCategory = (category) => {
        this.setState({
            categorySelected: category,
            isShowColProduct: true
        })
    }

    showColAmount = () => {
        this.setState({
            isShowColAmount: true
        })
    }

    pressPay = () => {

    }

    showModalDiscount = () => {

    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    categoriesByMerchant: state.category.categoriesByMerchant,
    productsByMerchantId: state.product.productsByMerchantId,
    servicesByMerchant: state.service.servicesByMerchant
})



export default connectRedux(mapStateToProps, TabCheckout);