import React from 'react';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment
} from '@utils'

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
            visibleDiscount: false,
            paymentSelected: '',
            tabCurrent: 0,
            total: 0,
            isInitBasket: false,
            appointmentId: -1,
            infoUser: {
                firstName: '',
                lastName: '',
                phoneNumber: ''
            }
        };
        this.amountRef = React.createRef();
        this.scrollTabRef = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { appointmentDetail } = nextProps;
        if (!_.isEmpty(nextProps.appointmentDetail) && !prevState.isInitBasket) {
            const { services, products, extras } = appointmentDetail;
            const arrayProducts = getArrayProductsFromAppointment(products);
            const arryaServices = getArrayServicesFromAppointment(services);
            const arrayExtras = getArrayExtrasFromAppointment(extras);
            const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
            return {
                total: appointmentDetail.total,
                basket: temptBasket,
                isInitBasket: true,
                appointmentId: appointmentDetail.appointmentId,
                infoUser: {
                    firstName: appointmentDetail.firstName,
                    lastName: appointmentDetail.lastName,
                    phoneNumber: appointmentDetail.phoneNumber,
                }
            }
        }
        return null
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

    addAmount = async () => {
        const { categoryTypeSelected, basket, productSeleted, extraSelected, appointmentId } = this.state;
        if (categoryTypeSelected === 'Product') {
            if (appointmentId !== -1) {
                // ------- Buy With Appointment -----
                await this.setState({
                    isInitBasket:false
                })
                this.props.actions.appointment.addItemIntoAppointment(
                    {
                        services: [],
                        extras: [],
                        products: [{
                            productId: productSeleted.productId,
                            quantity: this.amountRef.current.state.quanlity
                        }]
                    }, appointmentId)
            } else {
                // ------ Buy Ofline -----------
                const temptBasket = basket.filter((item) => item.id !== `${productSeleted.productId}_pro`);
                temptBasket.unshift({
                    type: 'Product',
                    id: `${productSeleted.productId}_pro`,
                    data: {
                        name: productSeleted.name,
                        productId: productSeleted.productId,
                        price: productSeleted.price
                    },
                    quanlitySet: this.amountRef.current.state.quanlity
                });
                this.setState({
                    basket: temptBasket
                })
            }



        } else {
            const temptBasket = basket.filter((item) => item.id !== `${productSeleted.serviceId}_ser`);
            temptBasket.unshift({
                type: 'Service',
                id: `${productSeleted.serviceId}_ser`,
                data: {
                    name: productSeleted.name,
                    serviceId: productSeleted.serviceId,
                    price: productSeleted.price
                },
                serviceName: productSeleted.name
            });
            const temptBasketExtra = temptBasket.filter((item) => item.id !== `${extraSelected.extraId}_extra`);
            if (extraSelected.extraId !== -1) {
                temptBasketExtra.unshift({
                    type: 'Extra',
                    id: `${extraSelected.extraId}_extra`,
                    data: {
                        name: extraSelected.name,
                        extraId: extraSelected.extraId,
                        price: extraSelected.price
                    },
                    serviceName: productSeleted.name
                });
            }

            this.setState({
                basket: temptBasketExtra
            })
        }
    }

    removeItemBasket =(item) =>{
        console.log('removeItemBasket : ',item );
    }

    selectedPayment = (payment) => {
        this.setState({
            paymentSelected: payment
        })
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
        // this.scrollTabRef.current.goToPage(1);
        const { basket } = this.state;
        console.log('basket : ' + JSON.stringify(basket));
    }

    backAddBasket = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    closeModalDiscount = () => {
        this.setState({
            visibleDiscount: false
        })
    }

    showModalDiscount = () => {
        this.setState({
            visibleDiscount: true
        })
    }

    payBasket = () => {

    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    categoriesByMerchant: state.category.categoriesByMerchant,
    productsByMerchantId: state.product.productsByMerchantId,
    servicesByMerchant: state.service.servicesByMerchant,
    appointmentDetail: state.appointment.appointmentDetail
})



export default connectRedux(mapStateToProps, TabCheckout);