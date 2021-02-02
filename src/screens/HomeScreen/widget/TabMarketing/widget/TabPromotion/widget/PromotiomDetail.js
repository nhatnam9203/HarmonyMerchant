import React, { useState } from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    FlatList,
    ScrollView,
    Switch
} from 'react-native';
import { useSelector } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { scaleSzie, localize, WorkingTime, formatWithMoment, MARKETING_CONDITIONS } from '@utils';
import ICON from '@resources';
import { Button, Text, InputForm, Dropdown } from '@components';
const { width } = Dimensions.get('window');

const PromotiomDetail = () => {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("12:00 AM");
    const [endTime, setEndTime] = useState("12:00 AM");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isChangeDate, setIsChangeDate] = useState("start");
    const [condition, setCondition] = useState("No condition");

    const language = useSelector(state => state?.dataLocal?.language || "en");

    const showDatePicker = (isChangeDate) => () => {
        setIsChangeDate(isChangeDate);
        setDatePickerVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const tempDate = formatWithMoment(date, "MM/DD/YYYY");
        isChangeDate === "start" ? setStartDate(tempDate) : setEndDate(tempDate);
        hideDatePicker(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: scaleSzie(14) }} >
            <ScrollView showsVerticalScrollIndicator={false}>
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
                <Text style={[styles.txt_tit, { marginBottom: scaleSzie(10), marginTop: scaleSzie(12) }]} >
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
                            <SelectPromotionDate
                                value={startDate}
                                onChangeText={setStartDate}
                                showDatePicker={showDatePicker("start")}
                            />
                            <View style={{ width: scaleSzie(25) }} />
                            {/* ---------  Start Time ------ */}
                            <Dropdown
                                label={"h:mm"}
                                data={WorkingTime}
                                value={startTime}
                                onChangeText={setStartTime}
                                containerStyle={{
                                    borderWidth: 1,
                                    borderColor: '#DDDDDD',
                                    flex: 1
                                }}
                            />
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
                            <SelectPromotionDate
                                value={endDate}
                                onChangeText={setEndDate}
                                showDatePicker={showDatePicker("end")}
                            />
                            <View style={{ width: scaleSzie(25) }} />
                            {/* ---------  End Time ------ */}
                            <Dropdown
                                label={"h:mm"}
                                data={WorkingTime}
                                value={endTime}
                                onChangeText={setEndTime}
                                containerStyle={{
                                    borderWidth: 1,
                                    borderColor: '#DDDDDD',
                                    flex: 1
                                }}
                            />
                            <View style={{ width: scaleSzie(10) }} />
                        </View>
                    </View>
                </View>


                {/* ---------  Specific Condition ------ */}
                <ConditionSpecific
                    title={"Condition"}
                    condition={condition}
                    setCondition={setCondition}
                />
                <Tags tags={["Deluxe Spa Manicure", "Deluxe Spa Pedicure", "Deluxe ", "Pedicure"]} />

                {/* ---------  Actions Condition ------ */}

                <ConditionSpecific
                    title={"Action"}
                    condition={condition}
                    setCondition={setCondition}
                />
                <Tags tags={["Deluxe Spa Manicure", "Deluxe Spa Pedicure", "Deluxe ", "Pedicure"]} />

                {/* ---------  Promotion type ------ */}
                <Text style={[styles.txt_tit, { marginBottom: scaleSzie(15), marginTop: scaleSzie(20) }]} >
                    {`Promotion type:`}
                </Text>

                <View style={{ flexDirection: "row", height: scaleSzie(30) }} >
                    {/* ---------  Specific ------ */}
                    <View style={[{ width: scaleSzie(30) }, styles.centered_box, styles.border_select]} >
                        <Text style={[styles.txt_condition_select]} >
                            {`%`}
                        </Text>
                    </View>
                    {/* ---------  All ------ */}
                    <View style={[{ width: scaleSzie(30), marginLeft: scaleSzie(4), marginRight: scaleSzie(10) }, styles.centered_box, styles.border_select]} >
                        <Text style={[styles.txt_condition_select]} >
                            {`$`}
                        </Text>
                    </View>

                    <View style={[{ flexDirection: "row", width: scaleSzie(140) }, styles.border_comm]} >
                        {/* --------- Input Promotion type ------ */}
                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '99/99/9999'
                                }}
                                placeholder="MM/DD/YYYY"
                                value={""}
                                // onChangeText={onChangeText}
                                style={[{ flex: 1, fontSize: scaleSzie(12), color: "#404040", padding: 0 }]}
                            />
                        </View>
                        <View onPress={showDatePicker} style={[{ width: scaleSzie(25) }, styles.centered_box]} >
                            <Text style={styles.txt_date} >
                                {`%`}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ---------  Promotion type ------ */}
                <Text style={[styles.txt_tit, { marginBottom: scaleSzie(10), marginTop: scaleSzie(20) }]} >
                    {`Active`}
                </Text>

                <Switch
                    trackColor={{ false: "#767577", true: "#0764B0" }}
                    ios_backgroundColor="#E5E5E5"
                    // onValueChange={(value) => this.updateCategoryInfo('isShowSignInApp', value)}
                    value={true}
                />

                <View style={{ height: scaleSzie(300) }} />
            </ScrollView>

            {/* --------------- Footer ---------------- */}
            <View style={{
                width: scaleSzie(250), height: scaleSzie(35),
                position: "absolute",
                bottom: scaleSzie(20),
                left: (width - scaleSzie(280)) / 2,
                flexDirection: "row"
            }} >
                <View style={[{ flex: 1, backgroundColor: "#F1F1F1", borderRadius: 2 }, styles.centered_box]} >
                    <Text style={styles.txt_footer} >
                        {`CANCEL`}
                    </Text>
                </View>
                <View style={{ width: scaleSzie(25) }} />
                <View style={[{ flex: 1, backgroundColor: "#0764B0", borderRadius: 2 }, styles.centered_box]} >
                    <Text style={[styles.txt_footer, { color: "#fff" }]} >
                        {`ADD`}
                    </Text>
                </View>
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
}

// ---------------- Internal Components ------------------

const SelectPromotionDate = ({ value, onChangeText, showDatePicker }) => {
    return (
        <View style={[{ flexDirection: "row", width: scaleSzie(190) }, styles.border_comm]} >
            {/* --------- Input Start Date ------ */}
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                <TextInputMask
                    type={'custom'}
                    options={{
                        mask: '99/99/9999'
                    }}
                    placeholder="MM/DD/YYYY"
                    value={value}
                    onChangeText={onChangeText}
                    style={[{ flex: 1, fontSize: scaleSzie(12), color: "#404040", padding: 0 }]}
                />
            </View>
            <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                <View style={{ flex: 1, backgroundColor: "#CCCCCC" }} />
            </View>
            <Button onPress={showDatePicker} style={{ width: scaleSzie(35), justifyContent: "center", alignItems: "center" }} >
                <Image source={ICON.marketing_calendar} />
            </Button>
        </View>
    );
}

const ConditionSpecific = ({ title, condition, setCondition }) => {
    return (
        <View>
            <Text style={[styles.txt_tit, { marginBottom: scaleSzie(15), marginTop: scaleSzie(16) }]} >
                {`${title}:`}
            </Text>

            {/* ---------  Condition Dropdown ------ */}
            <View style={{ width: scaleSzie(330), height: scaleSzie(30), marginBottom: scaleSzie(10) }} >
                <Dropdown
                    label={"h:mm"}
                    data={MARKETING_CONDITIONS}
                    value={condition}
                    onChangeText={setCondition}
                    containerStyle={{
                        borderWidth: 1,
                        borderColor: '#DDDDDD',
                        flex: 1
                    }}
                />
            </View>

            <View style={{ flexDirection: "row", height: scaleSzie(30) }} >
                {/* ---------  Specific ------ */}
                <View style={[{ width: scaleSzie(85) }, styles.centered_box, styles.border_select]} >
                    <Text style={[styles.txt_condition_select]} >
                        {`Specific`}
                    </Text>
                </View>
                {/* ---------  All ------ */}
                <View style={[{ width: scaleSzie(45), marginLeft: scaleSzie(4), marginRight: scaleSzie(50) }, styles.centered_box, styles.border_select]} >
                    <Text style={[styles.txt_condition_select]} >
                        {`All`}
                    </Text>
                </View>
                {/* ---------  Service/Product Dropdown ------ */}
                <Dropdown
                    label={"h:mm"}
                    data={MARKETING_CONDITIONS}
                    value={condition}
                    onChangeText={setCondition}
                    containerStyle={[{
                        flex: 1
                    }, styles.border_comm]}
                />
                {/* ---------  Add Button ------ */}
                <View style={[{ width: scaleSzie(85), backgroundColor: "#0764B0", marginLeft: scaleSzie(15), borderRadius: 4 }, styles.centered_box]} >
                    <Text style={[styles.txt_condition_select, { color: "#fff" }]} >
                        {`Add`}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const Tags = ({ tags }) => {
    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(10) }} >
            <View style={[{ width: scaleSzie(85) }]} />
            <View style={[{ width: scaleSzie(45), marginLeft: scaleSzie(4), marginRight: scaleSzie(50) },]} />
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }} >
                {
                    tags.map((tag, index) => <Tag name={tag} />)
                }
            </View>
            <View style={[{ width: scaleSzie(85), marginLeft: scaleSzie(15), }]} />
        </View>
    );
}

const Tag = ({ name }) => {
    return (
        <Button style={{ flexDirection: "row", marginRight: scaleSzie(18), alignItems: "center", marginBottom: scaleSzie(4) }} onPress={() => alert("ddd")}>
            <Text style={[styles.txt_condition_select, { fontWeight: "600" }]} >{name}</Text>
            <Image source={ICON.remove_tag} style={{ marginLeft: scaleSzie(5) }} />
        </Button>
    );
}


const styles = StyleSheet.create({
    centered_box: {
        justifyContent: "center",
        alignItems: "center"
    },
    border_select: {
        borderColor: "#0764B0",
        borderWidth: 2,
    },
    txt_condition_select: {
        color: "#0764B0",
        fontSize: scaleSzie(14),
        fontWeight: "600"
    },
    txt_date: {
        color: "#6A6A6A",
        fontSize: scaleSzie(12),
        fontWeight: "400"
    },
    border_comm: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    txt_tit: {
        color: "#404040",
        fontSize: scaleSzie(14),
        fontWeight: "600"
    },
    txt_footer: {
        fontSize: scaleSzie(14),
        color: "#404040",
        fontWeight: "400"
    }

});



export default PromotiomDetail;

