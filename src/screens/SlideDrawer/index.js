import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SlideDrawer extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, SlideDrawer);