import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabAppointment extends Layout {

    constructor(props) {
        super(props);
       
    }

    onLoadStartWebview =() =>{
        this.props.actions.app.loadingApp();
    }

    onLoadEndWebview =()=>{
        this.props.actions.app.stopLoadingApp();
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    token: state.dataLocal.token
    
})



export default connectRedux(mapStateToProps, TabAppointment);