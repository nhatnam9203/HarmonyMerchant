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
import { scaleSize, localize, checkIsTablet } from '@utils';
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
                                top: scaleSize(35) + 20 + scaleSize(28) + scaleSize(20),
                                right: scaleSize(10),
                                width: scaleSize(85), height: scaleSize(28), backgroundColor: "#0764B0", borderRadius: scaleSize(20),
                                justifyContent: "center", alignItems: "center", flexDirection: "row"
                            }} >
                            {/* <Image source={ICON.vip_icon} style={{ width: scaleSize(18), height: scaleSize(18) }} /> */}
                            <Text style={{ color: "#fff", fontSize: scaleSize(13), marginLeft: scaleSize(6) }} >
                                {`Normal`}
                            </Text>
                        </Button>
                            :
                            <Button
                                onPress={() => updateCustomerStatus(1)}
                                style={{
                                    position: "absolute",
                                    top: scaleSize(35) + 20 + scaleSize(28) + scaleSize(20),
                                    right: scaleSize(10),
                                    width: scaleSize(85), height: scaleSize(28), backgroundColor: "rgb(76,217,100)", borderRadius: scaleSize(20),
                                    justifyContent: "center", alignItems: "center", flexDirection: "row"
                                }} >
                                <Image source={ICON.vip_icon} style={{ width: scaleSize(18), height: scaleSize(18) }} />
                                <Text style={{ color: "#fff", fontSize: scaleSize(13), marginLeft: scaleSize(6) }} >
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


