import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CongratulationScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    gotoDrawerStack= () =>{
        this.props.navigation.navigate('Drawer');
    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, CongratulationScreen);