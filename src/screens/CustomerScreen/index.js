import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CustomerScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            isSelectAll: false,
            visibleEditAddCustomer:false
        }
        this.scrollTabRef = React.createRef();
        this.listProductRef = [];
    }

    componentDidMount() {
        this.props.actions.customer.getListCustomersByMerchant();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                })
            }
        );
    }

    showModalAddCustomer = () =>{
       this.setState({
        visibleEditAddCustomer: true
       })
    }

    setProductRef = ref => {
        if (ref != null) {
            this.listProductRef.push(ref);
        }
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.actions.app.handleLockScreen(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    showLockScreen = () => {
        this.props.actions.app.handleLockScreen(true);
    }

    selectAll = () => {
        this.setState(prevState => ({ isSelectAll: !prevState.isSelectAll }),
            () => {
                const { isSelectAll } = this.state;
                for (let i = 0; i < this.listProductRef.length; i++) {
                    this.listProductRef[i].setCheckBoxFromParent(isSelectAll);
                }
            })
    }

    unSelectAll =() =>{
        this.setState({isSelectAll:false})
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    productsByMerchantId: state.product.productsByMerchantId
})



export default connectRedux(mapStateToProps, CustomerScreen);