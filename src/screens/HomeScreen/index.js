import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class HomeScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    openDrawer =() =>{

    }

    signOut =() =>{
        
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, HomeScreen);