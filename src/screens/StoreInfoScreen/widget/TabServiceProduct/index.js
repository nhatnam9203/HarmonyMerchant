import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';

class TabServiceProduct extends Layout {

    constructor(props){
        super(props);
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabServiceProduct);