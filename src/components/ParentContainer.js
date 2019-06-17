import React, { Component } from 'react';
import {
    PanResponder, View, StyleSheet
} from 'react-native';

import connectRedux from '@redux/ConnectRedux';

const TIME_TO_WAIT_FOR_INACTIVITY_MS = 2000;
const INACTIVITY_CHECK_INTERVAL_MS = 500;

class ParentContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastInteraction: new Date(),
            panResponder: {}
        }
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponderCapture: () => false,
            onPanResponderTerminationRequest: () => true,
            onShouldBlockNativeResponder: () => false,
        });

        this.maybeStartWatchingForInactivity();
    }

    componentDidMount() {
        this.setIsActive();
    }

    maybeStartWatchingForInactivity = () => {
        if (this.inactivityTimer) {
            return;
        }

        this.inactivityTimer = setInterval(() => {
            if (
                new Date() - this.lastInteraction >= this.props.timeOutLockScreen
            ) {
                this.setIsInactive();
            }
        }, INACTIVITY_CHECK_INTERVAL_MS);
    };

    setIsActive = () => {
        this.lastInteraction = new Date();
        if (this.state.timeWentInactive) {
            this.setState({ timeWentInactive: null });
        }
        this.maybeStartWatchingForInactivity();
    };

    setIsInactive = () => {
        this.setState({ timeWentInactive: new Date() });
        clearInterval(this.inactivityTimer);
        this.inactivityTimer = null;
        // alert('Inactive');
        // this.props.actions.app.handleLockScreen(true);
        this.props.handleLockScreen();
    };

    handleStartShouldSetPanResponder = () => {
        this.setIsActive();
        return false;
    };

    handleMoveShouldSetPanResponder = () => {
        this.setIsActive();
        return false;
    };

    render() {
        return (
            <View style={styles.container}
                collapsable={false}
                {...this.panResponder.panHandlers}
            >
                {this.props.children}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const mapStateToProps = state => ({
    timeOutLockScreen: state.app.timeOutLockScreen
})



export default connectRedux(mapStateToProps, ParentContainer);

