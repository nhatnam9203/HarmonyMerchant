import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';

import { ButtonCustom, PopupParent, Dropdown } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';


let data = [{
    value: 'Banana',
}, {
    value: 'Mango',
}, {
    value: 'Pear',
}
];

class PopupEditAddService extends React.Component {

    render() {
        const { title, visible, titleButton, onRequestClose, confimYes } = this.props;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
            >
                <View style={{
                    height: scaleSzie(190), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15)
                }} >
                    <View style={{
                        flex: 1, paddingHorizontal: scaleSzie(20),
                        paddingVertical: scaleSzie(12)
                    }} >
                        <View style={{ flex: 1 }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: 5 }} >
                                Category Type
                        </Text>
                            <View style={{ width: scaleSzie(200), height: scaleSzie(38), backgroundColor: 'red' }} >
                                <Dropdown
                                    label='State'
                                    data={data}
                                    value={'Service Categories'}
                                    // onChangeText={(value) => this.updateUserInfo('state', value, 'address')}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#6A6A6A',
                                        flex: 1
                                    }}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: 5, marginTop: scaleSzie(7) }} >
                                Category Name
                            </Text>
                            <View style={{
                                height: scaleSzie(38), borderWidth: 1, borderColor: '#6A6A6A',
                                paddingLeft: scaleSzie(10)
                            }} >
                                <TextInput
                                    placeholder="Gel Nails"
                                    style={{ flex: 1, fontSize: scaleSzie(16) }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{
                        height: scaleSzie(45), alignItems: 'center'
                    }} >

                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={titleButton}
                            textColor="#fff"
                            onPress={() => confimYes()}
                            style={{ borderRadius: scaleSzie(2) }}
                            styleText={{
                                fontSize: scaleSzie(14)
                            }}
                        />

                    </View>
                </View>
            </PopupParent>
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

export default PopupEditAddService;

