import React from "react";
import { Modal, ActivityIndicator, View } from "react-native";
import connectRedux from "../redux/ConnectRedux";

class Loading extends React.PureComponent {

    render() {
        return (
            <Modal
                animationType={this.props.animationType || "none"}
                transparent={true}
                visible={this.props.loading}
                onRequestClose={() => { }}
            >
                <View
                    style={[
                        {
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.6)"
                        }
                    ]}
                >
                    <ActivityIndicator color="#fff" size="large" />
                </View>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.app.loading
    };
};

export default connectRedux(mapStateToProps, Loading);
