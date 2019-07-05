import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import Button from './Button';
import { scaleSzie } from '../utils';
import IMAGE from '../resources';

export default class FooterTab extends React.PureComponent {

    renderButtonAdd() {
        return (
            <View style={{
                height: scaleSzie(45),
                paddingHorizontal: scaleSzie(15), paddingVertical: scaleSzie(4)
            }} >
                <Button onPress={() => this.props.addNew()} style={{
                    flex: 1, backgroundColor: '#4CD964',
                    borderWidth: 1, borderColor: '#707070', borderRadius: scaleSzie(4),
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
                }} >
                    <Image source={IMAGE.addStaff} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                    <Text style={{
                        color: '#fff', fontSize: scaleSzie(18), fontWeight: 'bold',
                        marginLeft: scaleSzie(8)
                    }} >
                        ADD NEW
                </Text>
                </Button>
            </View>
        );
    }

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
                        onPress={() =>this.props.backTab()}
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
                        onPress={()=>this.props.nextTab()}
                    />
                </View>
            </View>
        );
    }



    render() {
        return (
            <View>
                {this.renderButtonAdd()}
                {this.renderFooter()}
            </View>
        );
    }


}