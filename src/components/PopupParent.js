import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';

import ModalCustom from './ModalCustom';
import { ScaleSzie } from '../utils';
import IMAGE from '../resources';
import Button from './Button';

class PopupParent extends React.Component {

    onPress = () => {
        this.props.onRequestClose();
    }

    render() {
        const { title, visible, style, width, hideCloseButton, styleTitle } = this.props;
        const temptWidth = width ? width : 400;
        
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
                style={style}
            >
                <View style={{ width: ScaleSzie(temptWidth) }} >
                    <View style={{
                        height: ScaleSzie(55), backgroundColor: '#0764B0',
                        borderTopRightRadius: ScaleSzie(15), borderTopLeftRadius: ScaleSzie(15), flexDirection: 'row'
                    }} >
                        {/* <View style={{ width: ScaleSzie(70) }} /> */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={[{ color: '#fff', fontSize: ScaleSzie(22), fontWeight: 'bold' }, styleTitle]} >
                                {title}
                            </Text>
                        </View>
                        <View style={{
                            height: ScaleSzie(55), width: ScaleSzie(70), justifyContent: 'center', alignItems: 'flex-end',
                            // paddingRight: ScaleSzie(12),
                            position: "absolute", right: ScaleSzie(12), top: 0
                        }} >
                            {
                                hideCloseButton ? <View /> : <Button onPress={this.onPress} style={{
                                    width: ScaleSzie(30), height: ScaleSzie(30), backgroundColor: '#fff',
                                    borderRadius: ScaleSzie(15), justifyContent: 'center', alignItems: 'center'
                                }} >
                                    <Image source={IMAGE.closePopup} style={{ width: ScaleSzie(14), height: ScaleSzie(14) }} />
                                </Button>
                            }

                        </View>
                    </View>
                    {this.props.children}
                </View>

            </ModalCustom>

        );
    }
}


export default PopupParent;

