import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from './actions';

const mapDispatchToProps = (dispatch) => {
    let acts = {};
    for (let key in actions) {
        acts[key] = bindActionCreators(actions[key], dispatch);
    }
    return {
        actions: acts,
        dispatch
    };
}

function connectRedux(mapStateToProps, Screen) {
    return connect(mapStateToProps, mapDispatchToProps)(Screen);
}
export default connectRedux;