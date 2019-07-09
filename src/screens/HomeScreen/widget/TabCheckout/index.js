import React from 'react';

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
            productSeleted: {
                name: ''
            },
            categoryTypeSelected: '',
            extraSelected: {
                extraId: -1,
                name: ''
            },
            basket: [],
            visibleDiscount: false
        };
        this.amountRef = React.createRef();
    }

    getDataColProduct() {
        const { categorySelected, categoryTypeSelected } = this.state;
        const { productsByMerchantId, servicesByMerchant } = this.props;
        const data = categoryTypeSelected === 'Service' ? servicesByMerchant : productsByMerchantId;
        const temptData = data.filter(item => {
            return item.categoryId === categorySelected.categoryId
        });
        return temptData;
    }

    onPressSelectCategory = (category) => {
        const { categorySelected } = this.state;
        if (categorySelected.categoryId !== category.categoryId) {
            this.setState({
                categorySelected: category,
                categoryTypeSelected: category.categoryType,
                isShowColProduct: true,
                isShowColAmount: false,
                productSeleted: {
                    name: ''
                },
                extraSelected: {
                    extraId: -1,
                    name: ''
                },
            })
        }

    }

    addAmount = () => {
        const { categoryTypeSelected, basket, productSeleted, extraSelected } = this.state;
        if (categoryTypeSelected === 'Product') {
            const temptBasket = basket.filter((item) => item.id !== `${productSeleted.productId}_pro`);
            temptBasket.unshift({
                type: 'Product',
                id: `${productSeleted.productId}_pro`,
                data: productSeleted,
                quanlitySet: this.amountRef.current.state.quanlity
            });
            this.setState({
                basket: temptBasket
            })
        } else {
            if (extraSelected.extraId === -1) {
                const temptBasket = basket.filter((item) => item.id !== `${productSeleted.serviceId}_ser`);
                temptBasket.unshift({
                    type: 'Service',
                    id: `${productSeleted.serviceId}_ser`,
                    data: productSeleted,
                    serviceName:productSeleted.name
                });
                this.setState({
                    basket: temptBasket
                })
            } else {
                const temptBasket = basket.filter((item) => item.id !== `${extraSelected.extraId}_extra`);
                temptBasket.unshift({
                    type: 'Extra',
                    id: `${extraSelected.extraId}_extra`,
                    data: extraSelected,
                    serviceName:productSeleted.name
                });
                this.setState({
                    basket: temptBasket
                })
            }

        }

    }

    showColAmount = (item) => {
        this.setState({
            productSeleted: item,
            isShowColAmount: true,
            extraSelected: {
                extraId: -1,
                name: ''
            },
        })
    }

    onPressSelectExtra = (extra) => {
        this.setState({
            extraSelected: extra
        })
    }

    pressPay = () => {
    }

    showModalDiscount = () => {
        this.setState({
            visibleDiscount:true
        })
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    categoriesByMerchant: state.category.categoriesByMerchant,
    productsByMerchantId: state.product.productsByMerchantId,
    servicesByMerchant: state.service.servicesByMerchant
})



export default connectRedux(mapStateToProps, TabCheckout);