import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';

import { Button, PopupParent, ModalCustom } from '@components';
import { scaleSzie, localize, checkIsTablet } from '@utils';
import ICON from "@resources";

const { width, height } = Dimensions.get("window");

class PopupChangeCustomerStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const {visible,onRequestClose} = this.props;
        return (
            <ModalCustom
                visible={visible}
                transparent={true}
                onRequestClose={() => onRequestClose()}
                style={{
                    backgroundColor: "transparent"
                }}
            >
                <View style={{ width, height }} >
                    <Button style={{
                        position: "absolute",
                        top: scaleSzie(35) + 20 + scaleSzie(28) + scaleSzie(20),
                        right: scaleSzie(10),
                        width: scaleSzie(85), height: scaleSzie(28), backgroundColor: "rgb(76,217,100)", borderRadius: scaleSzie(20),
                        justifyContent: "center", alignItems: "center", flexDirection: "row"
                    }} >
                        <Image source={ICON.vip_icon} style={{width:scaleSzie(18),height:scaleSzie(18)}} />
                        <Text style={{ color: "#fff", fontSize: scaleSzie(13), marginLeft: scaleSzie(6) }} >
                            {`VIP`}
                        </Text>
                    </Button>
                </View>
            </ModalCustom>
        );
    }

}




export default PopupChangeCustomerStatus;


