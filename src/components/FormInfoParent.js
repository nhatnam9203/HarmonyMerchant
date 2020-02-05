import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie } from '../utils';
import HeaderLogoTop from './HeaderLogoTop';
import ButtonCustom from './ButtonCustom';
import StatusBarHeader from './StatusBar';


export default class FormInfoParent extends React.PureComponent {

    renderFooter() {
        return (
            <View style={{ height: scaleSzie(50), flexDirection: 'row', }} >
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title="BACK"
                        textColor="#C5C5C5"
                        onPress={() => this.props.back()}
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
                        onPress={() => this.props.next()}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <StatusBarHeader />
                <HeaderLogoTop />
                <View style={{ flex: 1 }} >
                    {this.props.children}
                </View>
                {this.renderFooter()}
            </View>
        );
    }


}