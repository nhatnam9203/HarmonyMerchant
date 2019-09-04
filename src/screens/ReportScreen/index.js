import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class ReportScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

}

const mapStateToProps = state => ({
})



export default connectRedux(mapStateToProps, ReportScreen);