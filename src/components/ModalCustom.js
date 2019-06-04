import React from 'react';

import {
    View,
    Modal,
    PanResponder
} from 'react-native'

export default class ModalCustom extends React.PureComponent {

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                if (evt.nativeEvent.locationX === evt.nativeEvent.pageX) {
                    this.props.onRequestClose();
                }
            },
        });
    }

    render() {
        return (
            <Modal
                transparent={this.props.transparent}
                visible={this.props.visible}
                onRequestClose={() => this.props.onRequestClose()}
                animationType={this.props.animationType || 'none'}
            >
                <View  {...this._panResponder.panHandlers}
                    style={[{
                        flex: 1, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: "rgba(0,0,0,0.6)"
                    },
                    (this.props.style)
                    ]} >
                    {this.props.children}
                </View>
            </Modal>
        );
    }
}