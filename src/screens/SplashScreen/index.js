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
        const { profile, token, profileStaffLogin } = this.props;
        this.props.actions.app.getStateCity();
        if (!token) {
            this.props.navigation.navigate('Auth');
        } else if (token && profile.needSetting) {
            this.props.navigation.navigate('SetupStore');
        } else {
            this.props.actions.app.handleLockScreen(true);
        }
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    profileStaffLogin: state.dataLocal.profileStaffLogin
})



export default connectRedux(mapStateToProps, SplashScreen);