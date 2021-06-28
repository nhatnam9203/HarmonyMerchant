import React from "react";
import { Modal, ActivityIndicator, View } from "react-native";

import connectRedux from "../redux/ConnectRedux";
import { scaleSize } from '@utils';

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
                            backgroundColor: "rgba(0,0,0,0.05)"
                        }
                    ]}
                >
                    <View style={{
                        width: scaleSize(70), height: scaleSize(70), backgroundColor: "rgba(54,64,69,0.7)",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: scaleSize(10)
                    }} >
                        <ActivityIndicator color="#fff" size="large" />
                    </View>

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
