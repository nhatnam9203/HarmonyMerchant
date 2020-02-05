import React from "react";
import { View } from "react-native";
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
        this.testNetwork(this.testNetwork);

    }

    testNetwork(callback) {
        this.unsubscribe = NetInfo.addEventListener(state => {
            if (!state.isConnected && state.isConnected !== this.state.isConnected) {
                this.setState({
                    isConnected: state.isConnected
                }, () => {
                    this.unsubscribe();
                    callback
                })
            }
        });
    }

    handleConnectivityChange = isConnected => {
    };

    render() {
        return <View >
            {this.props.children}
        </View>
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

const mapStateToProps = state => {
    return {
        loading: state.app.loading
    };
};

export default connectRedux(mapStateToProps, NetworkListener);
