import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class HomeScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        // this.props.actions.app.test()
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, HomeScreen);