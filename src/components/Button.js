import React from 'react';
import {
    TouchableOpacity
} from 'react-native';

export default class Button extends React.PureComponent {

    constructor(props) {
        super(props);
        this.click = true;
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        if (this.click) {
            this.props.onPress();
        }
        this.click = false;
        setTimeout(() => {
            this.click = true;
        }, 500);
    }

    render() {
        return (
            <TouchableOpacity {...this.props} onPress={this.onPress} >
                {this.props.children}
            </TouchableOpacity>
        );
    }

    componentWillUnmount() {
        this.click = null;
    }

}