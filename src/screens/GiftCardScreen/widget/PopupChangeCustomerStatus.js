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
import { ScaleSzie, localize, checkIsTablet } from '@utils';
import ICON from "@resources";

const { width, height } = Dimensions.get("window");

class PopupChangeCustomerStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { visible, onRequestClose, isVip,updateCustomerStatus  } = this.props;
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
                    {
                        isVip ? <Button
                            onPress={() => updateCustomerStatus(0)}
                            style={{
                                position: "absolute",
                                top: ScaleSzie(35) + 20 + ScaleSzie(28) + ScaleSzie(20),
                                right: ScaleSzie(10),
                                width: ScaleSzie(85), height: ScaleSzie(28), backgroundColor: "#0764B0", borderRadius: ScaleSzie(20),
                                justifyContent: "center", alignItems: "center", flexDirection: "row"
                            }} >
                            {/* <Image source={ICON.vip_icon} style={{ width: ScaleSzie(18), height: ScaleSzie(18) }} /> */}
                            <Text style={{ color: "#fff", fontSize: ScaleSzie(13), marginLeft: ScaleSzie(6) }} >
                                {`Normal`}
                            </Text>
                        </Button>
                            :
                            <Button
                                onPress={() => updateCustomerStatus(1)}
                                style={{
                                    position: "absolute",
                                    top: ScaleSzie(35) + 20 + ScaleSzie(28) + ScaleSzie(20),
                                    right: ScaleSzie(10),
                                    width: ScaleSzie(85), height: ScaleSzie(28), backgroundColor: "rgb(76,217,100)", borderRadius: ScaleSzie(20),
                                    justifyContent: "center", alignItems: "center", flexDirection: "row"
                                }} >
                                <Image source={ICON.vip_icon} style={{ width: ScaleSzie(18), height: ScaleSzie(18) }} />
                                <Text style={{ color: "#fff", fontSize: ScaleSzie(13), marginLeft: ScaleSzie(6) }} >
                                    {`VIP`}
                                </Text>
                            </Button>
                    }

                </View>
            </ModalCustom>
        );
    }

}




export default PopupChangeCustomerStatus;


