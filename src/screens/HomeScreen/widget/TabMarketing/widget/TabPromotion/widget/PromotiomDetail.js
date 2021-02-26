import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    FlatList,
    ScrollView,
    Switch
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import _ from "ramda";
import Autocomplete from 'react-native-autocomplete-input';

import {
    scaleSzie, localize, WorkingTime, formatWithMoment, formatHourMinute, MARKETING_CONDITIONS, DISCOUNT_ACTION,
    getConditionIdByTitle, getShortNameForDiscountAction, getFormatTags, getConditionTitleIdById, getDiscountActionByShortName,
    getTagInfoById
} from '@utils';
import ICON from '@resources';
import { Button, Text, InputForm, Dropdown } from '@components';
import { product } from 'ramda';
const { width } = Dimensions.get('window');

const PromotiomDetail = ({ setStateFromParent, cancelCampaign, language, updatePromotionById,
    handleCreateNewCampaign
}) => {

    const [promotionId, setPromotionId] = useState("");
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("12:00 AM");
    const [endTime, setEndTime] = useState("12:00 AM");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isChangeDate, setIsChangeDate] = useState("start");
    const [condition, setCondition] = useState("No condition");
    const [actionCondition, setActionCondition] = useState("Discount for whole cart");
    const [conditionServiceProductTags, setConditionServiceProductTags] = useState([]);
    const [promotionType, setPromotionType] = useState("percent"); // fixed
    const [promotionValue, setPromotionValue] = useState("");
    const [dataServiceProduct, setDataServiceProduct] = useState([]);
    const [numberOfTimesApply, setNumberOfTimesApply] = useState("");
    const [actionTags, setActionTags] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isHandleEdit, setIsHandleEdit] = useState(false);

    const scrollRef = useRef(null);

    const productsByMerchantId = useSelector(state => state?.product?.productsByMerchantId || []);
    const servicesByMerchant = useSelector(state => state?.service?.servicesByMerchant || []);
    const promotionDetailById = useSelector(state => state?.marketing?.promotionDetailById || {});

    useEffect(() => {
        const tempService = servicesByMerchant.map((service) => ({ value: service?.name || "", type: "Service", originalId: service?.serviceId || 0, id: `${service?.serviceId}_Service` }));
        const tempProduct = productsByMerchantId.map((product) => ({ value: product?.name || "", type: "Product", originalId: product?.productId || 0, id: `${product?.productId}_Product` }));
        const tempData = tempService.concat(tempProduct);
        setDataServiceProduct(tempData);
    }, [productsByMerchantId, servicesByMerchant]);

    useEffect(() => {
        if (promotionDetailById?.id) {
            const serviceConditionTag = promotionDetailById?.conditionDetail?.service || [];
            const productonditionTag = promotionDetailById?.conditionDetail?.product || [];
            const tempServiceConditionTag = getTagInfoById("Service", serviceConditionTag, dataServiceProduct);
            const tempProductonditionTag = getTagInfoById("Product", productonditionTag, dataServiceProduct);
            const tempConditionServiceProductTags = [...tempServiceConditionTag, ...tempProductonditionTag];

            const serviceActionConditionTag = promotionDetailById?.applyToDetail?.service || [];
            const productActionConditionTag = promotionDetailById?.applyToDetail?.product || [];
            const tempServiceActionConditionTag = getTagInfoById("Service", serviceActionConditionTag, dataServiceProduct);
            const tempProductActionConditionTag = getTagInfoById("Product", productActionConditionTag, dataServiceProduct);
            const tempActionConditionTags = [...tempServiceActionConditionTag, ...tempProductActionConditionTag];

            let tempNumberOfTimesApply = promotionDetailById?.conditionId === 4 ? promotionDetailById?.conditionDetail : "";

            setConditionServiceProductTags(tempConditionServiceProductTags);
            setActionTags(tempActionConditionTags);
            setNumberOfTimesApply(tempNumberOfTimesApply);
        }


    }, [promotionDetailById])

    setStateFromParent((data = {}) => {
        setIsHandleEdit(data?.id ? true : false);
        setPromotionId(data?.id || "");
        setTitle(data?.name);
        setStartDate(formatWithMoment(data?.fromDate || new Date(), "MM/DD/YYYY"));
        setEndDate(formatWithMoment(data?.toDate || new Date(), "MM/DD/YYYY"));
        setStartTime(data?.fromDate ? formatWithMoment(data?.fromDate, "hh:mm A") : "00:00 AM");
        setEndTime(data?.toDate ? formatWithMoment(data?.toDate, "hh:mm A") : "00:00 AM");
        setPromotionType(data?.promotionType || "percent");
        setPromotionValue(data?.promotionValue || "");
        setIsDisabled(data?.isDisabled ? false : true);
        setCondition(getConditionTitleIdById(data?.conditionId || 1));
        setActionCondition(getDiscountActionByShortName(data?.applyTo || "all"));
        handleScroll(0, false)();
    });



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

    const addConditionServiceProductTags = (tag) => {
        const tempData = [...conditionServiceProductTags];
        let isExist = false;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i]?.id === tag?.id) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            tempData.push(tag);
            setConditionServiceProductTags(tempData);
        }
    }

    const addActionTags = (tag) => {
        const tempData = [...actionTags];
        let isExist = false;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i]?.id === tag?.id) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            tempData.push(tag);
            setActionTags(tempData);
        }
    }

    removeConditionServiceProductTags = (tag) => {
        const tempData = [];
        for (let i = 0; i < conditionServiceProductTags.length; i++) {
            if (conditionServiceProductTags[i]?.id !== tag?.id) {
                tempData.push({ ...conditionServiceProductTags[i] });
            }
        }
        setConditionServiceProductTags(tempData);
    }


    removeActionTags = (tag) => {
        const tempData = [];
        for (let i = 0; i < actionTags.length; i++) {
            if (actionTags[i]?.id !== tag?.id) {
                tempData.push({ ...actionTags[i] });
            }
        }
        setActionTags(tempData);
    }

    handleSetPromotionType = (type) => () => {
        setPromotionType(type);
    }

    handleCampaign = () => {
        const tempConditionTags = getFormatTags(conditionServiceProductTags);
        const tempActionTags = getFormatTags(actionTags);
        const campaign = {
            name: title,
            fromDate: `${formatWithMoment(new Date(startDate), "YYYY-MM-DD")}T${formatHourMinute(startTime)}:00`,
            toDate: `${formatWithMoment(new Date(endDate), "YYYY-MM-DD")}T${formatHourMinute(endTime)}:00`,
            conditionId: getConditionIdByTitle(condition),
            applyTo: getShortNameForDiscountAction(actionCondition),
            conditionDetail: getConditionIdByTitle(condition) === 4 ? numberOfTimesApply : {
                service: tempConditionTags?.services || [],
                product: tempConditionTags?.products || []
            },
            applyToDetail: {
                service: tempActionTags?.services || [],
                product: tempActionTags?.products || []
            },
            promotionType: promotionType,
            promotionValue: `${promotionValue || 0.00}`,
            isDisabled: isDisabled ? 0 : 1
        };

        // ------------ Check Valid ---------
        let isValid = true;
        const fromDate = (new Date(campaign?.fromDate)).getTime();
        const toDate = (new Date(campaign?.toDate)).getTime();

        if (!campaign?.name) {
            alert("Enter the campaign's name please!");
            isValid = false;
        } else if (parseInt(fromDate) >= parseInt(toDate)) {
            alert("The start date is not larger than the to date ");
            isValid = false;
        } else if (campaign.conditionId === 2 && conditionServiceProductTags.length < 1) {
            alert("Select services/product specific please!");
            isValid = false;
        } else if (campaign.conditionId === 4 && parseInt(numberOfTimesApply ? numberOfTimesApply : 0) < 1) {
            alert("Enter the number of times applied please!");
            isValid = false;
        } else if (campaign?.applyTo === "specific" && actionTags.length < 1) {
            alert("Select services/product for discount specific please!");
            isValid = false;
        } else if (promotionValue == 0) {
            alert("Enter promotion value please!");
            isValid = false;
        }

        console.log(promotionValue);
        if (isValid) {
            isHandleEdit ? updatePromotionById(promotionId, campaign) : handleCreateNewCampaign(campaign);

        }

    }

    handleScroll = (number, animated = true) => () => {
        scrollRef?.current?.scrollTo({ x: 0, y: scaleSzie(number), animated: animated });
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: scaleSzie(14) }} >
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='always'
            >
                 <Autocomplete 
                    defaultValue={["hi","ba"]}
                    data={["hi","ba","hi","ba","hi","ba","hi","ba","hi","ba","hi","ba"]}
                 />
                {/* ------------------- New Campaigns ------------------- */}
                <Text style={{ color: "#404040", fontSize: scaleSzie(16), fontWeight: "600", marginBottom: scaleSzie(20) }} >
                    {`New campaign`}
                </Text>

                <InputForm
                    title={`${localize('Campaign Name', language)}:`}
                    subTitle=""
                    placeholder="Campaign name"
                    value={title}
                    onChangeText={setTitle}
                    style={{ marginBottom: scaleSzie(10) }}
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
                    comparativeCondition={"Using specific services"}
                    dropdownData={MARKETING_CONDITIONS}
                    condition={condition}
                    setCondition={setCondition}
                    addTag={addConditionServiceProductTags}
                    dataServiceProduct={dataServiceProduct}
                />
                {
                    condition === "Using specific services" && <Tags tags={conditionServiceProductTags} removeTag={removeConditionServiceProductTags} />
                }

                {
                    condition === "Times using the service reached the quantity" &&
                    <InputForm
                        title={`${localize('Number of times applied', language)}:`}
                        subTitle=""
                        placeholder="Campaign name"
                        value={numberOfTimesApply}
                        isOnlyNumber={true}
                        onChangeText={setNumberOfTimesApply}
                        style={{ marginBottom: scaleSzie(10), marginTop: scaleSzie(5), width: scaleSzie(200) }}
                        styleTitle={{ fontSize: scaleSzie(12), fontWeight: "400", marginBottom: scaleSzie(2) }}
                        styleInputText={{ fontSize: scaleSzie(13) }}
                        onFocus={handleScroll(280)}
                    />
                }

                {/* ---------  Actions Condition ------ */}

                <ConditionSpecific
                    title={"Action"}
                    condition={actionCondition}
                    comparativeCondition={"Discount for specific services"}
                    dropdownData={DISCOUNT_ACTION}
                    setCondition={setActionCondition}
                    dataServiceProduct={dataServiceProduct}
                    addTag={addActionTags}
                />

                {
                    actionCondition === "Discount for specific services" && <Tags tags={actionTags} removeTag={removeActionTags} />
                }


                {/* ---------  Promotion type ------ */}
                <Text style={[styles.txt_tit, { marginBottom: scaleSzie(15), marginTop: scaleSzie(20) }]} >
                    {`Promotion type:`}
                </Text>

                <View style={{ flexDirection: "row", height: scaleSzie(30) }} >
                    {/* ---------  Specific ------ */}
                    <Button onPress={handleSetPromotionType("percent")} style={[{ width: scaleSzie(30) }, styles.centered_box,
                    promotionType === "percent" ? styles.border_select : styles.border_unselect
                    ]} >
                        <Text style={promotionType === "percent" ? styles.txt_condition_select : styles.txt_condition_unselect} >
                            {`%`}
                        </Text>
                    </Button>
                    {/* ---------  All ------ */}
                    <Button onPress={handleSetPromotionType("fixed")} style={[{ width: scaleSzie(30), marginLeft: scaleSzie(4), marginRight: scaleSzie(10) }, styles.centered_box,
                    promotionType === "fixed" ? styles.border_select : styles.border_unselect
                    ]} >
                        <Text style={promotionType === "fixed" ? styles.txt_condition_select : styles.txt_condition_unselect} >
                            {`$`}
                        </Text>
                    </Button>

                    <View style={[{ flexDirection: "row", width: scaleSzie(140) }, styles.border_comm]} >
                        {/* --------- Input Promotion type ------ */}
                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                            <TextInputMask
                                type={'money'}
                                options={{
                                    precision: 2,
                                    separator: '.',
                                    delimiter: ',',
                                    unit: '',
                                    suffixUnit: ''
                                }}
                                placeholder="0.00"
                                value={promotionValue}
                                onChangeText={setPromotionValue}
                                style={[{ flex: 1, fontSize: scaleSzie(12), color: "#404040", padding: 0 }]}
                                onFocus={handleScroll(500)}
                            />
                        </View>
                        <View onPress={showDatePicker} style={[{ width: scaleSzie(25) }, styles.centered_box]} >
                            <Text style={styles.txt_date} >
                                {promotionType === "percent" ? `%` : `$`}
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
                    value={isDisabled}
                    onValueChange={setIsDisabled}
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
                <Button onPress={cancelCampaign} style={[{ flex: 1, backgroundColor: "#F1F1F1", borderRadius: 2 }, styles.centered_box]} >
                    <Text style={styles.txt_footer} >
                        {`CANCEL`}
                    </Text>
                </Button>
                <View style={{ width: scaleSzie(25) }} />
                <Button onPress={handleCampaign} style={[{ flex: 1, backgroundColor: "#0764B0", borderRadius: 2 }, styles.centered_box]} >
                    <Text style={[styles.txt_footer, { color: "#fff" }]} >
                        {isHandleEdit ? "SAVE" : "ADD"}
                    </Text>
                </Button>
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={new Date(isChangeDate === "start" ? startDate : endDate)}
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
                    editable={false}
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

const ConditionSpecific = ({ title, condition, setCondition, addTag, dropdownData, comparativeCondition, dataServiceProduct }) => {

    const [tag, setTag] = useState("");
    const [tagIndex, setTagIndex] = useState(-1);

    onChangeServiceProduct = (value, index) => {
        setTag(value);
        setTagIndex(index);
    }

    handleAddTag = () => {
        if (tag && tagIndex !== -1) {
            addTag({ ...dataServiceProduct[tagIndex] });
            setTag("");
            setTagIndex(-1);
        }
    }

    return (
        <View>
            <Text style={[styles.txt_tit, { marginBottom: scaleSzie(15), marginTop: scaleSzie(16) }]} >
                {`${title}:`}
            </Text>

            {/* ---------  Condition Dropdown ------ */}
            <View style={{ width: scaleSzie(330), height: scaleSzie(30), marginBottom: scaleSzie(10) }} >
                <Dropdown
                    label={"h:mm"}
                    data={dropdownData}
                    value={condition}
                    onChangeText={setCondition}
                    containerStyle={{
                        borderWidth: 1,
                        borderColor: '#DDDDDD',
                        flex: 1
                    }}
                />
            </View>
            {
                condition === comparativeCondition && <View style={{ flexDirection: "row", height: scaleSzie(30) }} >
                    {/* ---------  Service/Product Dropdown ------ */}
                    <Dropdown
                        label={"Services/Products"}
                        data={dataServiceProduct}
                        value={tag}
                        onChangeText={onChangeServiceProduct}
                        containerStyle={[{
                            flex: 1
                        }, styles.border_comm]}
                    />
                    {/* ---------  Add Button ------ */}
                    <Button onPress={handleAddTag} style={[{ width: scaleSzie(85), backgroundColor: "#0764B0", marginLeft: scaleSzie(15), borderRadius: 4 }, styles.centered_box]} >
                        <Text style={[styles.txt_condition_select, { color: "#fff" }]} >
                            {`Add`}
                        </Text>
                    </Button>
                </View>
            }

        </View>
    );
}

const Tags = ({ tags, removeTag }) => {
    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(10) }} >
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }} >
                {
                    tags.map((tag, index) => <Tag
                        key={index}
                        name={tag?.value || ""}
                        removeTag={() => removeTag(tag)}
                    />)
                }
            </View>
            <View style={[{ width: scaleSzie(85), marginLeft: scaleSzie(15), }]} />
        </View>
    );
}

const Tag = ({ name, removeTag }) => {
    return (
        <Button onPress={removeTag} style={{ flexDirection: "row", marginRight: scaleSzie(18), alignItems: "center", marginBottom: scaleSzie(4) }} >
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
    border_unselect: {
        borderColor: "#A9A9A9",
        borderWidth: 2,
    },
    txt_condition_select: {
        color: "#0764B0",
        fontSize: scaleSzie(14),
        fontWeight: "600"
    },
    txt_condition_unselect: {
        color: "#A9A9A9",
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

