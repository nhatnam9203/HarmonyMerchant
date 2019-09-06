import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CongratulationScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    gotoDrawerStack= () =>{
        this.props.actions.app.handleLockScreen(true);
        this.props.navigation.navigate('Drawer');
        this.props.actions.dataLocal.resetNeddSettingStore();
    }



}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, CongratulationScreen);