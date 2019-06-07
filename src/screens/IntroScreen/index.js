import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class IntroScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    gotoApplication = () => {
        this.props.navigation.navigate('Auth');
    }

    skip = () => {

    }

    gotoDemo = () => {

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, IntroScreen);