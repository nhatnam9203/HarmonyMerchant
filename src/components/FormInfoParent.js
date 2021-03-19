import React from 'react';
import {
    View,
    Keyboard,
    Platform
} from 'react-native';

import { scaleSzie } from '../utils';
import HeaderLogoTop from './HeaderLogoTop';
import ButtonCustom from './ButtonCustom';
import StatusBarHeader from './StatusBar';


export default class FormInfoParent extends React.PureComponent {

    render() {
        return (
            <View style={{ flex: 1 }} >
                <StatusBarHeader />
                <HeaderLogoTop />
                <View style={{ flex: 1 }} >
                    {this.props.children}
                </View>
                <FooterTwoButton
                    back={() => this.props.back()}
                    next={() => this.props.next()}
                />
            </View>
        );
    }


}

class FooterTwoButton extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isShowFooter: true
        }
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
    }

    keyboardDidShow = async () => {
        await this.setState({
            isShowFooter: false
        })
    }

    keyboardDidHide = async () => {
        await this.setState({
            isShowFooter: true
        })
    }

    render() {
        const { back, next } = this.props;
        if (!this.state.isShowFooter) {
            return null;
        }
        return (
            <View style={{ height: scaleSzie(50), flexDirection: 'row', backgroundColor: "transparent" }} >
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title="BACK"
                        textColor="#C5C5C5"
                        onPress={() => back()}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title="NEXT"
                        textColor="#fff"
                        onPress={() => next()}
                    />
                </View>
            </View>
        );
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            this.keyboardDidShowListener?.remove();
            this.keyboardDidHideListener?.remove();
        }
    }

}

export {
    FooterTwoButton
};