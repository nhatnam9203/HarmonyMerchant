import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";


class TabCheckout extends Layout {

    constructor(props) {
        super(props);
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabCheckout);