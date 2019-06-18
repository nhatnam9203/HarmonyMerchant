import React from 'react';
import { Keyboard } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SettingScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            indexTab: 1,
        }
        this.scrollTabRef = React.createRef();
    }

    componentDidMount() {
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                })
            }
        );
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.actions.app.handleLockScreen(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    selectMenu(index) {
        this.setState({
            indexTab: index
        });
        this.scrollTabRef.current.goToPage(index);
        Keyboard.dismiss();
    }

    showLockScreen = () => {
        // this.props.actions.app.handleLockScreen(true);
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, SettingScreen);