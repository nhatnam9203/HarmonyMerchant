import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";


class TabCheckout extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isShowColProduct: false
        }
    }

    onPressSelectCategory = () => {
        this.setState({
            isShowColProduct: true
        })
    }

    pressPay = () => {

    }

    showModalDiscount = () => {

    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabCheckout);