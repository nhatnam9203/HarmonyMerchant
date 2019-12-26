import React from "react";
import { Modal, ActivityIndicator, View, Alert } from "react-native";
import NetInfo from '@react-native-community/netinfo';

import connectRedux from "../redux/ConnectRedux";

class NetworkListener extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true
        }
    }

    componentDidMount() {
        // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
        this.testNetwork(this.testNetwork);

    }

    testNetwork(callback) {
        this.unsubscribe = NetInfo.addEventListener(state => {
            if (!state.isConnected && state.isConnected !== this.state.isConnected) {
                this.setState({
                    isConnected: state.isConnected
                }, () => {
                // console.log('fail');
                    this.unsubscribe();
                    callback
                })
            }
        });
    }

    handleConnectivityChange = isConnected => {
    // console.log('isConnected : ', isConnected);
    };

    render() {
        return <View >
            {this.props.children}
        </View>
    }

    componentWillUnmount() {
    // console.log('componentWillUnmount');
        this.unsubscribe();
        // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }
}

const mapStateToProps = state => {
    return {
        loading: state.app.loading
    };
};

export default connectRedux(mapStateToProps, NetworkListener);
