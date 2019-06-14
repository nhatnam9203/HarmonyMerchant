import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabAppointment extends Layout {

    constructor(props) {
        super(props);
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabAppointment);