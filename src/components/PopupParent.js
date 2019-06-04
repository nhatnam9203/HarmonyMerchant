import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import ModalCustom from './ModalCustom';
import { scaleSzie } from '../utils';
import IMAGE from '../resources';
import Button from './Button';

class PopupParent extends React.Component {

    onPress = () => {
        this.props.onRequestClose();
    }

    render() {
        const { title, visible } = this.props;
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
            >
                <View style={{ width: scaleSzie(400) }} >
                    <View style={{
                        height: scaleSzie(55), backgroundColor: '#0764B0',
                        borderTopRightRadius: scaleSzie(15), borderTopLeftRadius: scaleSzie(15), flexDirection: 'row'
                    }} >
                        <View style={{ width: scaleSzie(70) }} />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ color: '#fff', fontSize: scaleSzie(24), fontWeight: 'bold' }} >
                                {title}
                            </Text>
                        </View>
                        <View style={{
                            width: scaleSzie(70), justifyContent: 'center', alignItems: 'flex-end',
                            paddingRight: scaleSzie(12)
                        }} >
                            <Button onPress={this.onPress} style={{
                                width: scaleSzie(40), height: scaleSzie(40), backgroundColor: '#fff',
                                borderRadius: scaleSzie(20), justifyContent: 'center', alignItems: 'center'
                            }} >
                                <Image source={IMAGE.closePopup} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                            </Button>
                        </View>
                    </View>
                    {/* ----- Body --- */}
                    <View>
                        {this.props.children}
                    </View>
                </View>

            </ModalCustom>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
})

export default PopupParent;

