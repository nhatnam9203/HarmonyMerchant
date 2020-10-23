import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CongratulationScreen extends Layout {

    constructor(props) {
        super(props);
    }

    gotoDrawerStack= () =>{
        this.props.navigation.navigate('Drawer');
        this.props.actions.dataLocal.resetNeddSettingStore();
    }
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, CongratulationScreen);