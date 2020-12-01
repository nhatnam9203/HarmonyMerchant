import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    StyleSheet
} from 'react-native';

import { ButtonCustom, ModalCustom } from '@components';
import { scaleSzie, localize, checkIsTablet } from '@utils';
import ICON from "@resources";

const { width } = Dimensions.get("window");

class PopupAppointmentDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    setStateFromParent = async customer => {

    }

    render() {
        const { } = this.props;
        return (
            <ModalCustom
                transparent={true}
                visible={true}
                onRequestClose={() => { }}
            // style={style}
            >
                <View style={{
                    minHeight: scaleSzie(380),
                    width: width - scaleSzie(180),
                    backgroundColor: '#fff',
                    borderRadius: scaleSzie(8),
                    overflow: "hidden"
                }} >
                    <View style={{ flex: 1 }} >
                        {/* --------- Header ---------- */}
                        <View style={{
                            height: scaleSzie(50), backgroundColor: "#9DDFF2", flexDirection: "row", paddingHorizontal: scaleSzie(14),
                            justifyContent: "space-between", alignItems: "center"
                        }} >
                            <Text style={{ color: "#fff", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                                {`#1`}
                            </Text>

                            <Text style={{ color: "#fff", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                                {`Confirmed appointment`}
                            </Text>

                            <Image source={ICON.close_appointment_popup} style={{ height: scaleSzie(24), width: scaleSzie(24) }} />
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(14) }} >
                            {/* ------------ Calendar --------- */}
                            <View style={{
                                height: scaleSzie(30), width: scaleSzie(130), backgroundColor: "#E5E5E5", borderRadius: 4,
                                marginTop: scaleSzie(14), marginBottom: scaleSzie(10), flexDirection: "row", paddingHorizontal: scaleSzie(8),
                                alignItems: "center"
                            }} >
                                <Image source={ICON.appointment_calendar} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                                <Text style={{ color: "#404040", fontSize: scaleSzie(12), marginLeft: scaleSzie(10) }} >
                                    {`1/14/2019`}
                                </Text>
                                <View style={{ flex: 1, alignItems: "flex-end" }} >
                                    <Image source={ICON.dropdown_appointment} />
                                </View>
                            </View>

                            {/* --------------- Table -------------- */}
                            <View style={{borderColor:"#EEEEEE",borderWidth:1}} >
                                {/* --------- Table Header -------- */}
                                <View style={{ height: scaleSzie(25), backgroundColor: "#404040", flexDirection: "row" }} >
                                    <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_title} >
                                            {`Services`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#fff" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_title} >
                                            {`Staff`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#fff" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_title} >
                                            {`Start time`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#fff" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_title} >
                                            {`Duration (min)`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#fff" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_title} >
                                            {`Price ($)`}
                                        </Text>
                                    </View>
                                </View>

                                {/* --------- Table Item -------- */}
                                <View style={{
                                    height: scaleSzie(38), backgroundColor: "#fff", flexDirection: "row",
                                    borderTopColor: "#EEEEEE", borderTopWidth: 1
                                }} >
                                    <View style={{ flex: 1, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_item} >
                                            {`Services`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_item} >
                                            {`Staff`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_item} >
                                            {`Start time`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_item} >
                                            {`Duration (min)`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                                    <View style={{ flex: 0.8, justifyContent: "center", paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.txt_item} >
                                            {`Price ($)`}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>


                </View>
            </ModalCustom>
        );
    }

}

const styles = StyleSheet.create({
    txt_title: {
        color: "#fff",
        fontSize: scaleSzie(12)
    },
    txt_item: {
        color: "#404040",
        fontSize: scaleSzie(12)
    }
})




export default PopupAppointmentDetail;


