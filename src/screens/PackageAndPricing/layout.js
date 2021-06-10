import React, { useState } from 'react';
import {
    View,
    Image,
    Switch
} from 'react-native';

import styles from './style';
import ICON from '@resources';
import { Text, ButtonCustom } from '@components';
import { scaleSize, formatMoney, checkIsTablet } from '@utils';
import Svg from 'react-native-svg';

export default class Layout extends React.Component {

    renderHeaderTable() {
        const firstPackage = this.findPackage(1);
        const secondPackage = this.findPackage(2);
        const thirstPackage = this.findPackage(3);
        const temp_height_header = checkIsTablet() ? scaleSize(40) : scaleSize(45);

        return (
            <View style={{ height: temp_height_header, flexDirection: "row" }} >
                <ItemHeader
                    title={""}
                    style={{
                        backgroundColor: "#E5E5E5",
                        justifyContent: "center",
                    }}
                    textStyle={{
                        color: "#404040",
                        marginLeft: scaleSize(12)
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
        const tempHeight = checkIsTablet() ? scaleSize(240) : scaleSize(280);

        return (
            <View style={{ height: tempHeight, flexDirection: "row", }} >
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1, }} >
                    <ItemTextPackage
                        title="Number of Staff"
                    />
                    <ItemTextPackage
                        title="POS"
                    />
                    <ItemTextPackage
                        title="Interactive Scheduling"
                    />
                    <ItemTextPackage
                        title="Sign-In App"
                    />
                    <ItemTextPackage
                        title="Staff App"
                    />
                    <ItemTextPackage
                        title="Live Marketing"
                    />
                    <ItemTextPackage
                        title="Reporting"
                    />
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                        title={firstPackage && firstPackage.staffLimit ? firstPackage.staffLimit : ""}
                    />

                    {/* ------------ Support ---------- */}
                    <ItemValuePackage
                        isDisabled={firstPackage && firstPackage.pos ? firstPackage.pos : 0}
                    />
                    <ItemValuePackage
                        isDisabled={firstPackage && firstPackage.interactiveScheduling ? firstPackage.interactiveScheduling : 0}
                    />
                    <ItemValuePackage
                        isDisabled={firstPackage && firstPackage.signinApp ? firstPackage.signinApp : 0}
                    />
                    <ItemValuePackage
                        isDisabled={firstPackage && firstPackage.staffApp ? firstPackage.staffApp : 0}
                    />
                    <ItemValuePackage
                        isDisabled={firstPackage && firstPackage.marketing ? firstPackage.marketing : 0}
                    />
                    <ItemValuePackage
                        isDisabled={firstPackage && firstPackage.report ? firstPackage.report : 0}
                    />

                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                        title={secondPackage && secondPackage.staffLimit ? secondPackage.staffLimit : ""}
                    />

                    {/* ------------ Support ---------- */}
                    <ItemValuePackage
                        isDisabled={secondPackage && secondPackage.pos ? secondPackage.pos : 0}
                    />
                    <ItemValuePackage
                        isDisabled={secondPackage && secondPackage.interactiveScheduling ? secondPackage.interactiveScheduling : 0}
                    />
                    <ItemValuePackage
                        isDisabled={secondPackage && secondPackage.signinApp ? secondPackage.signinApp : 0}
                    />
                    <ItemValuePackage
                        isDisabled={secondPackage && secondPackage.staffApp ? secondPackage.staffApp : 0}
                    />
                    <ItemValuePackage
                        isDisabled={secondPackage && secondPackage.marketing ? secondPackage.marketing : 0}
                    />
                    <ItemValuePackage
                        isDisabled={secondPackage && secondPackage.report ? secondPackage.report : 0}
                    />
                </View>
                <View style={{ width: 1, backgroundColor: "#EEEEEE" }} />
                <View style={{ flex: 1 }} >
                    <ItemValuePackage
                        title={thirstPackage && thirstPackage.staffLimit ? thirstPackage.staffLimit : ""}
                    />

                    {/* ------------ Support ---------- */}
                    <ItemValuePackage
                        isDisabled={thirstPackage && thirstPackage.pos ? thirstPackage.pos : 0}
                    />
                    <ItemValuePackage
                        isDisabled={thirstPackage && thirstPackage.interactiveScheduling ? thirstPackage.interactiveScheduling : 0}
                    />
                    <ItemValuePackage
                        isDisabled={thirstPackage && thirstPackage.signinApp ? thirstPackage.signinApp : 0}
                    />
                    <ItemValuePackage
                        isDisabled={thirstPackage && thirstPackage.staffApp ? thirstPackage.staffApp : 0}
                    />
                    <ItemValuePackage
                        isDisabled={thirstPackage && thirstPackage.marketing ? thirstPackage.marketing : 0}
                    />
                    <ItemValuePackage
                        isDisabled={thirstPackage && thirstPackage.report ? thirstPackage.report : 0}
                    />
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
                    ref={this.billRef}
                />
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <ItemPricing
                    price={formatMoney(firstPackage && firstPackage.pricing ? firstPackage.pricing : 0)}
                    onPress={() => this.startFreeTrial(1)}
                />
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <ItemPricing
                    price={formatMoney(secondPackage && secondPackage.pricing ? secondPackage.pricing : 0)}
                    onPress={() => this.startFreeTrial(2)}
                />
                <View style={{ width: 1, backgroundColor: "#fff" }} />
                <ItemPricing
                    price={formatMoney(thirstPackage && thirstPackage.pricing ? thirstPackage.pricing : 0)}
                    onPress={() => this.startFreeTrial(3)}
                />
                <View style={{ width: 1, backgroundColor: "#707070" }} />

            </View>
        );
    }

    render() {
        const temp_title_style = checkIsTablet() ? { fontSize: scaleSize(22), marginTop: scaleSize(12) } : {};
        const temp_des_style = checkIsTablet() ? { fontSize: scaleSize(14), marginTop: scaleSize(2) } : {};
        const temp_table_padding = checkIsTablet() ? { padding: scaleSize(10), paddingBottom: 0 } : {};

        return (
            <View style={{ flex: 1 }} >
                <Text style={[{
                    color: "#404040", fontSize: scaleSize(30), fontWeight: "600",
                    alignSelf: "center", marginTop: scaleSize(25)
                }, temp_title_style]} >
                    {`Packages & Pricing`}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
                    <Text style={[{
                        color: "#6A6A6A", fontSize: scaleSize(17), alignSelf: "center", marginTop: scaleSize(6)
                    }, temp_des_style]} >
                        {`Try HarmonyPay apps free for 30 days! No payment information required `}
                    </Text>
                    <Image source={ICON.happy_face} />
                </View>


                {/* ------------------ Table ---------------- */}
                <View style={[{ flex: 1, padding: scaleSize(18) }, temp_table_padding]} >
                    <View style={{ flex: 1 }} >
                        {this.renderHeaderTable()}
                        {this.renderBodyTable()}
                        {this.renderFooterTable()}
                        <View style={{ height: scaleSize(10) }} />
                    </View>
                </View>
            </View>
        );
    }
}


const ItemHeader = ({ title, style, textStyle, icon }) => {
    const temp_title_style = checkIsTablet() ? { fontSize: scaleSize(16) } : {};

    return (
        <View style={[{ flex: 1 }, style]} >
            {
                icon ? <Image source={icon} style={{
                    width: scaleSize(20), height: scaleSize(20),
                    marginRight: scaleSize(8)
                }} /> : null
            }
            <Text style={[{ fontSize: scaleSize(18), fontWeight: "500", }, textStyle, temp_title_style]} >
                {title}
            </Text>
        </View>
    );
}

const ItemTextPackage = ({ title }) => {
    const temp_title_style = checkIsTablet() ? { fontSize: scaleSize(15) } : {};

    return (
        <View style={[{ flex: 1, justifyContent: "center" }]} >
            <Text style={[{ color: "#404040", fontSize: scaleSize(16), marginLeft: scaleSize(12) }, temp_title_style]} >
                {title}
            </Text>
        </View>
    );
}


const ItemValuePackage = ({ title, isDisabled }) => {
    const icon = isDisabled === 0 ? ICON.not_support : ICON.check_package_pricing;
    const temp_title_style = checkIsTablet() ? { fontSize: scaleSize(15) } : {};
    const temp_icon_style = checkIsTablet() ? { width: scaleSize(15), height: scaleSize(15) } : {};

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            {
                title ? <Text style={[{ color: "#0764B0", fontSize: scaleSize(16), fontWeight: "500" }, temp_title_style]} >
                    {title}
                </Text> : <Image
                        source={icon}
                        style={temp_icon_style}
                    />
            }
        </View>
    );
}

const ItemPricing = ({ price, onPress }) => {
    const temp_price_style = checkIsTablet() ? { fontSize: scaleSize(16) } : {};
    const temp_btn_height = checkIsTablet() ? 34 : 36;
    const tempt_height_btn = checkIsTablet() ? scaleSize(45) : scaleSize(52);
    const tempt_txt_btn = checkIsTablet() ? scaleSize(15) : scaleSize(16);

    return (
        <View style={{ flex: 1, backgroundColor: "#0764B0" }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <View style={{
                    flexDirection: "row", height: scaleSize(26),
                    justifyContent: "center"
                }} >
                    <Text style={[{ color: "#fff", fontSize: scaleSize(18), fontWeight: "600" }, temp_price_style]} >
                        {`$ ${price}`}
                    </Text>
                    <View style={{ justifyContent: "flex-end" }} >
                        <Text style={{ color: "#fff", fontSize: scaleSize(12), fontWeight: "600" }} >
                            {`/month`}
                        </Text>
                    </View>

                </View>

            </View>
            <View style={{
                height: tempt_height_btn, paddingHorizontal: scaleSize(13)
            }} >
                <ButtonCustom
                    width={'100%'}
                    height={temp_btn_height}
                    backgroundColor="#4CD964"
                    title={'Start free trial'}
                    textColor="#6A6A6A"
                    onPress={() => onPress()}
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        borderRadius: 6
                    }}
                    styleText={{ fontSize: tempt_txt_btn, fontWeight: '500', color: '#fff' }}
                />
            </View>
        </View>
    );
}


class ItemFirstPricing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toogle: true
        }
    }


    render() {
        const { toogle } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "#0764B0", justifyContent: "center" }} >
                <View style={{
                    paddingHorizontal: scaleSize(12), flexDirection: "row",
                    justifyContent: "space-between",
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
                        onValueChange={(toogle) => this.setState({ toogle })}
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
}
