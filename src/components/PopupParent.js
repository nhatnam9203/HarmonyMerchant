import React from 'react';
import {
    View,
    Image,
    Text,
} from 'react-native';

import ModalCustom from './ModalCustom';
import { scaleSize } from '../utils';
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
                <View style={{ width: scaleSize(temptWidth) }} >
                    <View style={{
                        height: scaleSize(55), backgroundColor: '#0764B0',
                        borderTopRightRadius: scaleSize(15), borderTopLeftRadius: scaleSize(15), flexDirection: 'row'
                    }} >
                        {/* <View style={{ width: scaleSize(70) }} /> */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={[{ color: '#fff', fontSize: scaleSize(22), fontWeight: 'bold' }, styleTitle]} >
                                {title}
                            </Text>
                        </View>
                        <View style={{
                            height: scaleSize(55), width: scaleSize(70), justifyContent: 'center', alignItems: 'flex-end',
                            // paddingRight: scaleSize(12),
                            position: "absolute", right: scaleSize(12), top: 0
                        }} >
                            {
                                hideCloseButton ? <View /> : <Button onPress={this.onPress} style={{
                                    width: scaleSize(30), height: scaleSize(30), backgroundColor: '#fff',
                                    borderRadius: scaleSize(15), justifyContent: 'center', alignItems: 'center'
                                }} >
                                    <Image source={IMAGE.closePopup} style={{ width: scaleSize(14), height: scaleSize(14) }} />
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

