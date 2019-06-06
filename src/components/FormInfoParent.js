import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSzie } from '../utils';
import IMAGE from '../resources';
import HeaderLogoTop from './HeaderLogoTop';
import Text from './Text';
import ButtonCustom from './ButtonCustom';

const { width, height } = Dimensions.get('window');

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
                        textColor="#6A6A6A"
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
        const {title} = this.props;
        return (
            <View style={{ flex: 1 }} >
                <HeaderLogoTop />
                <View style={{
                    width, paddingHorizontal: scaleSzie(15),
                    marginTop: scaleSzie(8)
                }}  >
                    <Text style={{ color: '#0764B0', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                        Please fill the form below
                    </Text>
                    <View style={{
                        height: scaleSzie(38), backgroundColor: '#0764B0', justifyContent: 'center',
                        paddingLeft: scaleSzie(5), marginTop: scaleSzie(5)
                    }} >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: scaleSzie(18) }} >
                            {title}
                    </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }} >
                    {this.props.children}
                </View>
                {this.renderFooter()}
            </View>
        );
    }


}