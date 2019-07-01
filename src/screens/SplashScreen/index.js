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
        const { profile, token } = this.props;
        this.props.actions.app.getStateCity();
        setTimeout(() => {
            if (!token) {
                this.props.navigation.navigate('Auth');
            }else if(token && profile.staffs){
                this.props.navigation.navigate('Drawer');
            }else{
                this.props.navigation.navigate('SetupStore');
            }
        }, 1000)

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    token :state.dataLocal.token
})



export default connectRedux(mapStateToProps, SplashScreen);