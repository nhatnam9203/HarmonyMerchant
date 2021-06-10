import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigatorServices from '@navigators/NavigatorServices';


class SlideDrawer extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    changeLanguage =(item)=>{
        NavigatorServices.navigate(item)
    }
}

const mapStateToProps = state => ({
    profile: state.authMerchant.merchant,
    language: state.dataLocal.language
})

export default connectRedux(mapStateToProps, SlideDrawer);