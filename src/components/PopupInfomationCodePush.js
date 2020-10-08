import React from 'react';
import {
    View,
    Image,
    Text
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie } from '../utils';
import ModalCustom from './ModalCustom';
import ICON from "@resources";
import configs from "@configs";

class PopupInfomationCodePush extends React.Component {

    render() {
        const { title, visible, message, onRequestClose } = this.props;
        return (
            <ModalCustom
                title={title}
                visible={visible}
                onRequestClose={() => { }}
                style={{
                    justifyContent: 'flex-start',
                    paddingTop: scaleSzie(40)
                }}
            >
                <View style={{
                    height: scaleSzie(480),
                    width: scaleSzie(380)
                }} >
                    <View style={{ height: scaleSzie(80) }} />

                     {/* --------- White Box ------- */}
                    <View style={{
                        flex: 1, backgroundColor: '#fff',
                        borderRadius: scaleSzie(10)
                    }} >

                    </View>


                    {/* --------- Blue Box ------- */}
                    <View style={[{
                        width: scaleSzie(380), height: scaleSzie(150),
                        position: "absolute", top: 0, right: 0, left: 0, alignItems: "center"
                    },configs.SHADOW]} >
                        <View style={{
                            flex: 1, width: scaleSzie(200), backgroundColor: "#0764B0",
                            borderRadius: scaleSzie(10), alignItems: "center", paddingVertical: scaleSzie(17)
                        }} >
                            <Image
                                source={ICON.update_code_push}
                                style={{ height: scaleSzie(55), width: scaleSzie(55) }}
                            />
                            <Text style={{ color: "#fff", fontSize: scaleSzie(14), fontWeight: "bold", marginTop: scaleSzie(18) }} >
                                {`What's new ?`}
                            </Text>
                            <View style={{ flex: 1, justifyContent: "flex-end" }} >
                                <Text style={{ color: "#fff", fontSize: scaleSzie(12),fontWeight: "300"  }} >
                                    {`Version: 1.1.1`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ModalCustom>
        );
    }

}


export default PopupInfomationCodePush;

