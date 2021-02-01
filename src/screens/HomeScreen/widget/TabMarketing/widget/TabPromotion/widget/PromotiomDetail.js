import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    FlatList
} from 'react-native';
import { useSelector } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';

import { scaleSzie, localize } from '@utils';
import ICON from '@resources';
import { Button, Text, InputForm } from '@components';
const { width } = Dimensions.get('window');

const PromotiomDetail = () => {

    const [promotion, setPromotion] = React.useState();
    const language = useSelector(state => state?.dataLocal?.language || "en");

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: scaleSzie(14) }} >
            {/* ------------------- New Campaigns ------------------- */}
            <Text style={{ color: "#404040", fontSize: scaleSzie(16), fontWeight: "600", marginBottom: scaleSzie(20) }} >
                {`New campaign`}
            </Text>

            <InputForm
                title={`${localize('Campaign Name', language)}:`}
                subTitle=""
                placeholder="Campaign name"
                value={""}
                onChangeText={(value) => {
                }}
                style={{ marginBottom: scaleSzie(10), }}
                styleTitle={{ fontSize: scaleSzie(14), fontWeight: "600", marginBottom: scaleSzie(5) }}
                styleInputText={{ fontSize: scaleSzie(13) }}
            />

            {/* ------------------- Date ------------------- */}
            <Text style={{
                color: "#404040", fontSize: scaleSzie(16), fontWeight: "600", marginBottom: scaleSzie(10),
                marginTop: scaleSzie(12)
            }} >
                {`Date:`}
            </Text>

            {/* ------------------- Start Date and End Date ------------------- */}
            <View style={{ flexDirection: "row" }} >
                {/* ------------------- Start Date ------------------- */}
                <View style={{ flex: 1 }} >
                    <Text style={[styles.txt_date, { marginBottom: scaleSzie(10) }]} >
                        {`Start Date`}
                    </Text>
                    <View style={{ flexDirection: "row", height: scaleSzie(30) }} >
                        <View style={[{ flexDirection: "row", width: scaleSzie(190) }, styles.border_comm]} >
                            {/* --------- Input Date ------ */}
                            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '99/99/9999'
                                    }}
                                    placeholder="MM/DD/YYYY"
                                    style={[{ flex: 1, fontSize: scaleSzie(12), color: "#6A6A6A", padding: 0 }]}
                                />
                            </View>
                            <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                                <View style={{ flex: 1, backgroundColor: "#CCCCCC" }} />
                            </View>
                            <View style={{ width: scaleSzie(35), justifyContent: "center", alignItems: "center" }} >
                                <Image source={ICON.marketing_calendar} />
                            </View>
                        </View>
                        <View style={{ width: scaleSzie(25) }} />
                        <View style={{ flex: 1, backgroundColor: "red" }} >

                        </View>
                        <View style={{ width: scaleSzie(28), }} />
                    </View>
                </View>

                {/* ------------------- End Date ------------------- */}
                <View style={{ flex: 1 }} >
                    <Text style={[styles.txt_date, { marginLeft: scaleSzie(18), marginBottom: scaleSzie(10) }]} >
                        {`End Date`}
                    </Text>
                    <View style={{ flexDirection: "row", height: scaleSzie(30) }} >
                        <View style={{ width: scaleSzie(18) }} />
                        <View style={[{ flexDirection: "row", width: scaleSzie(190) }, styles.border_comm]} >
                            <View style={{ flex: 1 }} >

                            </View>
                            <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                                <View style={{ flex: 1, backgroundColor: "#CCCCCC" }} />
                            </View>
                            <View style={{ width: scaleSzie(35), justifyContent: "center", alignItems: "center" }} >
                                <Image source={ICON.marketing_calendar} />
                            </View>
                        </View>
                        <View style={{ width: scaleSzie(25) }} />
                        <View style={{ flex: 1, backgroundColor: "red" }} >

                        </View>
                        <View style={{ width: scaleSzie(10) }} />
                    </View>
                </View>
            </View>



        </View>
    );
}




const styles = StyleSheet.create({
    txt_date: {
        color: "#6A6A6A",
        fontSize: scaleSzie(12),
        fontWeight: "400"
    },
    border_comm: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
    }

});



export default PromotiomDetail;

