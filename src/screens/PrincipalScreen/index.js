import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class PrincipalScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, PrincipalScreen);