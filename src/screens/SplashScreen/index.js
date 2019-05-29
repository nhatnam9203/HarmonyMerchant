import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class SplashScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        // setTimeout(() =>{
        //     this.props.actions.app.test();
        // },1000)
        
        // this.props.navigation.navigate('Main');
        // NavigationServices.navigate("Main");
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, SplashScreen);