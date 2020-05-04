import React, { useState } from 'react';
import {
    View,
    Image,
    ImageBackground,
    ActivityIndicator,
    Switch
} from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

import styles from './style';
import ICON from '@resources';
import { Text, ButtonCustom } from '@components';
import { scaleSzie ,formatMoney} from '@utils';

export default class Layout extends React.Component {

    renderHeaderTable() {
        const firstPackage = this.findPackage(1);
        const secondPackage = this.findPackage(2);
        const thirstPackage = this.findPackage(3);

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
                    title={firstPackage && firstPackage.packageName ? firstPackage.packageName : ""}
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
                      title={secondPackage && secondPackage.packageName ? secondPackage.packageName : ""}
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
                     title={thirstPackage && thirstPackage.packageName ? thirstPackage.packageName : ""}
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
        const firstPackage = this.findPackage(1);
        const secondPackage = this.findPackage(2);
        const thirstPackage = this.findPackage(3);

        return (
            <View style={{ height: scaleSzie(250), flexDirection: "row", }} >
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
                       title={firstPackage && firstPackage.staffLimit ? firstPackage.staffLimit : ""}
                    />
                    {
                        [1, 2, 3, 4, 5].map((value) => <ItemValuePackage key={value} />)
                    }
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                       title={secondPackage && secondPackage.staffLimit ? secondPackage.staffLimit : ""}
                    />
                    {
                        [1, 2, 3, 4, 5].map((value) => <ItemValuePackage key={value} />)
                    }
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                       title={thirstPackage && thirstPackage.staffLimit ? thirstPackage.staffLimit : ""}
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
        const firstPackage = this.findPackage(1);
        const secondPackage = this.findPackage(2);
        const thirstPackage = this.findPackage(3);

        return (
            <View style={{ flex: 1, flexDirection: "row", }} >
                <View style={{ width: 1, backgroundColor: "#707070" }} />
                <ItemFirstPricing
                />
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <ItemPricing
                    price={formatMoney(firstPackage && firstPackage.staffLimit ? firstPackage.staffLimit : 0)}
                />
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <ItemPricing
                    price={formatMoney(secondPackage && secondPackage.staffLimit ? secondPackage.staffLimit : 0)}
                />
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <ItemPricing
                    price={formatMoney(thirstPackage && thirstPackage.staffLimit ? thirstPackage.staffLimit : 0)}
                />
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
                        <View style={{ height: scaleSzie(10) }} />
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

const ItemPricing = ({ price }) => {
    return (
        <View style={{ flex: 1, backgroundColor: "#0764B0" }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <View style={{
                    flexDirection: "row", height: scaleSzie(26),
                    justifyContent: "center"
                }} >
                    <Text style={{ color: "#fff", fontSize: scaleSzie(18), fontWeight: "600" }} >
                        {`$${price}`}
                    </Text>
                    <View style={{ justifyContent: "flex-end" }} >
                        <Text style={{ color: "#fff", fontSize: scaleSzie(12), fontWeight: "600" }} >
                            /month
                            </Text>
                    </View>

                </View>

            </View>
            <View style={{
                height: scaleSzie(52), paddingHorizontal: scaleSzie(13)
            }} >
                <ButtonCustom
                    width={'100%'}
                    height={36}
                    backgroundColor="#4CD964"
                    title={'Start free trial'}
                    textColor="#6A6A6A"
                    // onPress={this.searchStaff}
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        borderRadius: 6
                        // backgroundColor: '#4CD964'
                    }}
                    styleText={{ fontSize: scaleSzie(16), fontWeight: '500', color: '#fff' }}
                />
            </View>
        </View>
    );
}


const ItemFirstPricing = ({ }) => {

    const [toogle, setToogle] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: "#0764B0" }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <View style={{
                    flexDirection: "row", height: scaleSzie(26),
                    // justifyContent: "center",
                    marginLeft: scaleSzie(12)
                }} >
                    <Text style={{ color: "#fff", fontSize: scaleSzie(18), fontWeight: "600" }} >
                        {`Pricing`}
                    </Text>


                </View>

            </View>
            <View style={{
                height: scaleSzie(52), paddingHorizontal: scaleSzie(12), flexDirection: "row",
                justifyContent: "space-between"
            }} >
                <View>
                    <Text style={styles.txtPricing} >
                        Billed
                    </Text>
                    <Text style={styles.txtPricing} >
                        Monthly
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#4CD964" }}
                    // thumbColor={toogle ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#E5E5E5"
                    onValueChange={(value) => {
                        setToogle(value)
                    }}
                    value={toogle}
                />
                <View>
                    <Text style={styles.txtPricing} >
                        Billed
                    </Text>
                    <Text style={styles.txtPricing} >
                        Annually
                    </Text>
                </View>
            </View>
        </View>
    );
}
