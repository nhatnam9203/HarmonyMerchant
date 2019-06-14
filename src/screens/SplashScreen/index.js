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
        setTimeout(() => {
            this.props.navigation.navigate('Auth');
            // if (_.isEmpty(profile)) {
            //     this.props.navigation.navigate('SignIn');
            // } else {
            //     this.props.navigation.navigate('Main');
            // }
        }, 1000)

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, SplashScreen);