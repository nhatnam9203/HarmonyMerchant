import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import { scaleSzie } from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const { width } = Dimensions.get('window');

const PromotionHome = () => {

    const [promotion, setPromotion] = React.useState();

    return (
        <View style={{ flex: 1 }} >
            {/* ------------------- Campaigns ------------------- */}
            <View style={{ flexDirection: "row", paddingHorizontal: scaleSzie(14), justifyContent: "space-between", alignItems: "center" }} >
                <Text style={{ color: "#404040", fontSize: scaleSzie(16), fontWeight: "600" }} >
                    {`Campaigns`}
                </Text>
                <View style={{
                    height: scaleSzie(30), width: scaleSzie(130), backgroundColor: "#0764B0",
                    borderRadius: scaleSzie(4), justifyContent: "center", alignItems: "center"
                }} >
                    <Text style={{ color: "#fff", fontSize: scaleSzie(13), fontWeight: "600" }} >
                        {`New Campaign`}
                    </Text>
                </View>
            </View>

            <CampaignTableHeader />
            <CampaignRow />

            {/* ------------------- Rules ------------------- */}
            <Text style={{ color: "#404040", fontSize: scaleSzie(16), fontWeight: "600", marginLeft: scaleSzie(14), marginTop: scaleSzie(28) }} >
                {`Rules`}
            </Text>

            <RuleTableHeader />
            <RuleRow />

        </View>
    );
}

const CampaignTableHeader = () => {
    return (
        <View style={{ flexDirection: "row", paddingHorizontal: scaleSzie(14), marginTop: scaleSzie(30), marginBottom: scaleSzie(12) }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Name`}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSzie(90), }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Status`}
                </Text>
            </View>
            {/* ------------------- Start date ------------------- */}
            <View style={[{ width: scaleSzie(100) }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Start date`}
                </Text>
            </View>
            {/* ------------------- End date ------------------- */}
            <View style={[{ width: scaleSzie(100), }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`End date`}
                </Text>
            </View>
            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSzie(150), alignItems: "center", }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Actions`}
                </Text>
            </View>
        </View>
    );
}

const RuleTableHeader = () => {
    return (
        <View style={{ flexDirection: "row", paddingHorizontal: scaleSzie(14), marginVertical: scaleSzie(12) }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Name`}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSzie(90), }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Status`}
                </Text>
            </View>
            <View style={[{ width: scaleSzie(100) }, styles.center_txt]} />
            <View style={[{ width: scaleSzie(100), }, styles.center_txt]} />

            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSzie(150), alignItems: "center", }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Actions`}
                </Text>
            </View>
        </View>
    );
}

const RuleRow = () => {

    return (
        <View style={{
            minHeight: scaleSzie(45), backgroundColor: "#fff",
            flexDirection: "row", paddingHorizontal: scaleSzie(14), borderTopWidth: 1, borderTopColor: "#F1F1F1"
        }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_name_row} >
                    {`Happy valentine`}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSzie(90), }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {`Active`}
                </Text>
            </View>
            <View style={[{ width: scaleSzie(100) }, styles.center_txt]} />

            <View style={[{ width: scaleSzie(100), }, styles.center_txt]} />
            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSzie(150), flexDirection: "row" }, styles.center_txt]} >
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <View style={styles.btn_row} >
                        <Text style={[styles.txt_row, { color: "#fff", fontfontSize: scaleSzie(12), fontWeight: "600" }]} >
                            {`Edit`}
                        </Text>
                    </View>
                </View>
                <View style={{ width: scaleSzie(10) }} />
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <View style={[styles.btn_row, { backgroundColor: "#FF3B30" }]} >
                        <Text style={[styles.txt_row, { color: "#fff", fontfontSize: scaleSzie(12), fontWeight: "600" }]} >
                            {`Disable`}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const CampaignRow = () => {

    return (
        <View style={{
            minHeight: scaleSzie(45), backgroundColor: "#fff",
            flexDirection: "row", paddingHorizontal: scaleSzie(14), borderTopWidth: 1, borderTopColor: "#F1F1F1"
        }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_name_row} >
                    {`Happy valentine`}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSzie(90), }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {`Active`}
                </Text>
            </View>
            {/* ------------------- Start date ------------------- */}
            <View style={[{ width: scaleSzie(100) }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {`01/01/19`}
                </Text>
            </View>
            {/* ------------------- End date ------------------- */}
            <View style={[{ width: scaleSzie(100), }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {`01/01/20`}
                </Text>
            </View>
            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSzie(150), flexDirection: "row" }, styles.center_txt]} >
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <View style={styles.btn_row} >
                        <Text style={[styles.txt_row, { color: "#fff", fontfontSize: scaleSzie(12), fontWeight: "600" }]} >
                            {`Edit`}
                        </Text>
                    </View>
                </View>
                <View style={{ width: scaleSzie(10) }} />
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <View style={[styles.btn_row, { backgroundColor: "#FF3B30" }]} >
                        <Text style={[styles.txt_row, { color: "#fff", fontfontSize: scaleSzie(12), fontWeight: "600" }]} >
                            {`Disable`}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    center_txt: {
        justifyContent: "center"
    },
    txt_header: {
        color: "#404040",
        fontSize: scaleSzie(12),
        fontWeight: "600"
    },
    txt_name_row: {
        color: "#0764B0",
        fontSize: scaleSzie(12),
        fontWeight: "600"
    },
    txt_row: {
        color: "#404040",
        fontSize: scaleSzie(11),
        fontWeight: "400"
    },
    btn_row: {
        height: scaleSzie(25),
        width: "100%",
        backgroundColor: "#0764B0",
        borderRadius: 2,
        justifyContent: "center",
        alignItems: "center"
    }

});



export default PromotionHome;

