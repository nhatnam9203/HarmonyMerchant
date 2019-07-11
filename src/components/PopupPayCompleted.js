import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import ModalCustom from './ModalCustom';
import ButtonCustom from './ButtonCustom';
import { scaleSzie } from '../utils';
import IMAGE from '../resources';
import Button from './Button';

class PopupPayCompleted extends React.Component {

    gotoAppoitmentScreen = () => {
        this.props.gotoAppoitmentScreen();
    }

    render() {
        const { visible, style } = this.props;
        return (
            <ModalCustom
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}
                style={style}
            >
                <View style={{
                    width: scaleSzie(450), height: scaleSzie(180), backgroundColor: "#fff",
                    borderRadius: scaleSzie(16)
                }} >
                    {/* ---------- header ------ */}
                    <View style={{
                        alignItems: 'center', paddingTop: scaleSzie(16), paddingBottom: scaleSzie(12),
                    }} >
                        <Text style={{ color: '#0764B0', fontSize: scaleSzie(28), fontWeight: 'bold' }}  >
                            Transaction completed !
                    </Text>
                    </View>
                    {/* ------------ content ----- */}
                    <View style={{
                        alignItems: 'center'
                    }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(20) }}  >
                            Do you want to print receipt ?
                    </Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row',paddingHorizontal:scaleSzie(70),
                alignItems:'center',justifyContent:'space-between'
                }} >
                        <ButtonCustom
                            width={scaleSzie(100)}
                            height={40}
                            backgroundColor="#0764B0"
                            // title={localize('Search', language)}
                            title="Yes"
                            textColor="#fff"
                            onPress={this.gotoAppoitmentScreen}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(18), fontWeight: 'normal' }}
                        />

                        <ButtonCustom
                            width={scaleSzie(100)}
                            height={40}
                            backgroundColor="#F1F1F1"
                            // title={localize('Search', language)}
                            title="No"
                            textColor="#6A6A6A"
                            onPress={this.gotoAppoitmentScreen}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(18), fontWeight: 'normal' }}
                        />
                    </View>

                </View>

            </ModalCustom>

        );
    }
}


export default PopupPayCompleted;

