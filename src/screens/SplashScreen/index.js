import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SplashScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const { profile } = this.props;
        this.props.actions.app.getStateCity();
        this.props.actions.app.getQuestion();
        setTimeout(() => {
            this.props.navigation.navigate('Auth');
        }, 1000)

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, SplashScreen);