import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion, formatNumberFromCurrency } from '@utils';

class TabTAX extends Layout {


    constructor(props) {
        super(props);
        const { profile } = this.props;
        this.state = {
            serviceTAX: profile.taxService ? profile.taxService : '',
            productTAX: profile.taxProduct ? profile.taxProduct : '',
        }
    }

    setStateFromParent = async (productTAX, serviceTAX) => {
        await this.setState({
            productTAX,
            serviceTAX
        })
    }

    setupTAX = () => {
        const { profile } = this.props;
        const { serviceTAX, productTAX } = this.state;
        this.props.actions.app.setupMerchantTAX({
            taxService: formatNumberFromCurrency(serviceTAX),
            taxProduct: formatNumberFromCurrency(productTAX),
            businessHourStart: profile.businessHourStart,
            businessHourEnd: profile.businessHourEnd,
            webLink: profile.webLink,
            latitude: profile.latitude,
            longitude: profile.longitude,
        });
    }

    onChangeServiceTax = serviceTAX => {
        this.setState({
            serviceTAX
        });
        this.props.actions.app.changeFlagSubmitTAX();
    }

    onChangeProductTax = productTAX => {
        this.setState({
            productTAX
        });
        this.props.actions.app.changeFlagSubmitTAX();
    }




}
const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    isSubmitTax: state.app.isSubmitTax
})


export default connectRedux(mapStateToProps, TabTAX);