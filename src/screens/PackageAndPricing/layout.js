import React from 'react';
import {
    View,
    Image,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

import styles from './style';
import ICON from '@resources';
import { Text } from '@components';
import { scaleSzie } from '@utils';

export default class Layout extends React.Component {

    renderHeaderTable() {
        return (
            <View style={{ height: scaleSzie(45), flexDirection: "row" }} >
                <ItemHeader
                    title={"Package"}
                    style={{
                        backgroundColor: "#E5E5E5",
                        justifyContent: "center",
                    }}
                    textStyle={{
                        color: "#404040",
                        marginLeft: scaleSzie(12)
                    }}
                />
                <ItemHeader
                    title={"Basic"}
                    style={{
                        backgroundColor: "#BFDAFF",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    textStyle={{
                        color: "#fff",
                    }}
                    icon={ICON.basic_icon}
                />
                <ItemHeader
                    title={"Medium"}
                    style={{
                        backgroundColor: "#3E70B3",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    textStyle={{
                        color: "#fff",
                    }}
                    icon={ICON.medium_icon}
                />
                <ItemHeader
                    title={"Pro"}
                    style={{
                        backgroundColor: "#003680",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    textStyle={{
                        color: "#fff",
                    }}
                    icon={ICON.professional_icon}
                />
            </View>
        );
    }

    renderBodyTable() {
        return (
            <View style={{ height: scaleSzie(240), flexDirection: "row", }} >
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1, }} >
                    <ItemTextPackage
                        title="Staff"
                    />
                    <ItemTextPackage
                        title="POS"
                    />
                    <ItemTextPackage
                        title="Sign in app"
                    />
                    <ItemTextPackage
                        title="App for staff"
                    />
                    <ItemTextPackage
                        title="Marketing"
                    />
                    <ItemTextPackage
                        title="Report"
                    />
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                        title={5}
                    />
                    {
                        [1, 2, 3, 4, 5].map((value) => <ItemValuePackage key={value} />)
                    }
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                        title={10}
                    />
                    {
                        [1, 2, 3, 4, 5].map((value) => <ItemValuePackage key={value} />)
                    }
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                        title={15}
                    />
                    {
                        [1, 2, 3, 4, 5].map((value) => <ItemValuePackage key={value} />)
                    }
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
            </View>
        );
    }

    renderFooterTable() {
        return (
            <View style={{ flex: 1, flexDirection: "row", }} >
                <View style={{ width: 1, backgroundColor: "#707070" }} />
                <View style={{ flex: 1, backgroundColor:"#0764B0"}} >

                </View>
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <View style={{ flex: 1, backgroundColor:"#0764B0"}} >

                </View>
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <View style={{ flex: 1, backgroundColor:"#0764B0"}} >

                </View>
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <View style={{ flex: 1, backgroundColor:"#0764B0"}} >

                </View>
                <View style={{ width: 1, backgroundColor: "#707070" }} />

            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <Text style={{
                    color: "#404040", fontSize: scaleSzie(30), fontWeight: "600",
                    alignSelf: "center", marginTop: scaleSzie(25)
                }} >
                    {`Package & Pricing`}
                </Text>
                <Text style={{
                    color: "#6A6A6A", fontSize: scaleSzie(20), alignSelf: "center", marginTop: scaleSzie(6)
                }} >
                    {`Try HarmonyPay Merchants free for 3 months, no credit card required`}
                </Text>

                {/* ------------------ Table ---------------- */}
                <View style={{ flex: 1, padding: scaleSzie(18) }} >
                    <View style={{ flex: 1 }} >
                        {this.renderHeaderTable()}
                        {this.renderBodyTable()}
                        {this.renderFooterTable()}
                        <View style={{height:scaleSzie(10)}} />
                    </View>
                </View>
            </View>
        );
    }
}


const ItemHeader = ({ title, style, textStyle, icon }) => {
    return (
        <View style={[{ flex: 1 }, style]} >
            {
                icon ? <Image source={icon} style={{
                    width: scaleSzie(20), height: scaleSzie(20),
                    marginRight: scaleSzie(8)
                }} /> : null
            }
            <Text style={[{ fontSize: scaleSzie(18), fontWeight: "500", }, textStyle]} >
                {title}
            </Text>
        </View>
    );
}

const ItemTextPackage = ({ title }) => {
    return (
        <View style={{ flex: 1, justifyContent: "center" }} >
            <Text style={[{ color: "#404040", fontSize: scaleSzie(16), marginLeft: scaleSzie(12) },]} >
                {title}
            </Text>
        </View>
    );
}


const ItemValuePackage = ({ title }) => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            {
                title ? <Text style={[{ color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "500" },]} >
                    {title}
                </Text> : <Image
                        source={ICON.check_package_pricing}
                    />
            }
        </View>
    );
}

