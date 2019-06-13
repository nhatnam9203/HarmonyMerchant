import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';
import NavigationServices from "../../../../navigators/NavigatorServices";


class TabAppointment extends Layout {

    constructor(props) {
        super(props);
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabAppointment);