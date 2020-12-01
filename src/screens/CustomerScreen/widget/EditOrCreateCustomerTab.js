import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    ScrollView
} from 'react-native';

import { Button, Text } from '@components';
import { scaleSzie } from '@utils';
import Configs from "@configs";
import ICON from "@resources";

class EditOrCreateCustomerTab extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                {/* ------------- Header ------------ */}
                <View style={{
                    height: scaleSzie(45), flexDirection: "row",
                    alignItems: "center", justifyContent: "space-between", marginTop: scaleSzie(10)
                }} >
                    <Text style={{ color: "#0764B0", fontSize: scaleSzie(20), fontWeight: "600" }} >
                        {`New customer`}
                    </Text>
                    <View style={{
                        width: scaleSzie(85), height: scaleSzie(28), backgroundColor: "#0764B0", borderRadius: scaleSzie(20),
                        justifyContent: "center", alignItems: "center"
                    }} >
                        <Text style={{ color: "#fff", fontSize: scaleSzie(13) }} >
                            {`Normal`}
                        </Text>
                    </View>
                </View>

                {/* ------------- Line ------------ */}
                <View style={{ height: 1, backgroundColor: "#EEEEEE", marginBottom: scaleSzie(18) }} />

                <View style={{ flex: 1, flexDirection: "row" }} >
                    {/* ------------------ Left Content ------------------ */}
                    <View style={{ flex: 1}} >

                    </View>

                    {/* ----------------- Padding ------------ */}
                    <View style={{width:scaleSzie(30)}} />

                    {/* ------------------ Right Content ------------------ */}
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    SHADOW: {
        backgroundColor: "#fff",
        borderRadius: scaleSzie(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.6,
                shadowOffset: { width: 0, height: 1 },
            },

            android: {
                elevation: 2,
            },
        })
    },

})

export default EditOrCreateCustomerTab;

