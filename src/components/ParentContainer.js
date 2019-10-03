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
        const { activeScreen } = this.props;
        if (this.inactivityTimer) {
            return;
        }

        this.inactivityTimer = setInterval(() => {
            // if (this.props.activeScreen && new Date() - this.lastInteraction >= this.getTimeOut(this.props.autoLockScreenAfter)) {
            //     this.setIsInactive();
            // }
            if (activeScreen && new Date() - this.lastInteraction >= 3000) {
                console.log('---- inactivityTimer -----');
                this.setIsInactive();
            }
        }, INACTIVITY_CHECK_INTERVAL_MS);

        if (!activeScreen) {
            clearInterval(this.inactivityTimer);
            this.inactivityTimer = null;
        }

    };

    getTimeOut(number) {
        let timeout = 0;
        switch (number) {
            case '05:00 min':
                timeout = 300000;
                break;
            case '10:00 min':
                timeout = 600000;
                break;
            case '15:00 min':
                timeout = 900000;
                break;
            case '30:00 min':
                timeout = 1800000;
                break;
            default:
                timeout = 1 * 1000 * 60;
        }
        // console.log('number : ', this.props.activeScreen);
        // console.log('getTimeOut : ', timeout);
        return timeout
    }

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
        this.props.handleLockScreen();

        // ----- Countinue Listen -----
        // this.setIsActive();
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
    autoLockScreenAfter: state.dataLocal.autoLockScreenAfter
})



export default connectRedux(mapStateToProps, ParentContainer);

