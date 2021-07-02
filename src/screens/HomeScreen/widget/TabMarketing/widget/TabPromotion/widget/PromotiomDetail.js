import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  ScrollView,
  Switch,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { TextInputMask } from "react-native-masked-text";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import _ from "ramda";
import DropdownSearch from "./DropdownSearch";
import Slider from "./Slider";
import IMAGE from "@resources";
import moment from "moment";

import {
  scaleSize,
  localize,
  WorkingTime,
  formatWithMoment,
  formatHourMinute,
  MARKETING_CONDITIONS,
  DISCOUNT_ACTION,
  getConditionIdByTitle,
  getShortNameForDiscountAction,
  getFormatTags,
  getConditionTitleIdById,
  getDiscountActionByShortName,
  getTagInfoById,
  roundFloatNumber,
  formatMoney,
  getCurrentIndexWorkingTime,
  getWorkingTime,
} from "@utils";
import ICON from "@resources";
import {
  Button,
  Text,
  InputForm,
  Dropdown,
  CustomTimePicker,
} from "@components";
const { width } = Dimensions.get("window");

const HOURS_FORMAT = "hh:mm A";

const PromotiomDetail = forwardRef(
  (
    {
      cancelCampaign,
      language,
      updatePromotionById,
      handleCreateNewCampaign,
      getSMSInformation,
    },
    ref
  ) => {
    const [promotionId, setPromotionId] = useState("");
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isChangeDate, setIsChangeDate] = useState("start");
    const [condition, setCondition] = useState("No condition");
    const [actionCondition, setActionCondition] = useState(
      "Discount for whole cart"
    );
    const [conditionServiceProductTags, setConditionServiceProductTags] =
      useState([]);
    const [promotionType, setPromotionType] = useState("percent"); // fixed
    const [promotionValue, setPromotionValue] = useState("");
    const [dataServiceProduct, setDataServiceProduct] = useState([]);
    const [numberOfTimesApply, setNumberOfTimesApply] = useState("");
    const [actionTags, setActionTags] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isHandleEdit, setIsHandleEdit] = useState(false);
    const [dynamicConditionMarginBottom, setDynamicConditionMarginBottom] =
      useState(24);
    const [dynamicActionTagsMarginBottom, setDynamicActionTagsMarginBottom] =
      useState(24);
    const [value, setValue] = useState(0);
    const [customerSendSMSQuantity, setCustomerSendSMSQuantity] = useState(0);
    const [smsAmount, setSmsAmount] = useState("0.00");
    const [smsMaxAmount, setSmsMaxAmount] = useState("0.00");

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(
      WorkingTime.map((x) => Object.assign({}, x, { label: x.value }))
    );
    const scrollRef = useRef(null);

    const productsByMerchantId = useSelector(
      (state) => state?.product?.productsByMerchantId || []
    );
    const servicesByMerchant = useSelector(
      (state) => state?.service?.servicesByMerchant || []
    );
    const promotionDetailById = useSelector(
      (state) => state?.marketing?.promotionDetailById || {}
    );
    const smsInfoMarketing = useSelector(
      (state) => state?.marketing?.smsInfoMarketing || {}
    );

    useImperativeHandle(ref, () => ({
      setStateFromParent: (data = {}) => {
        // console.log('---- setStateFromParent: ', data?.customerSendSMSQuantity);

        setCustomerSendSMSQuantity(data?.customerSendSMSQuantity || 0);
        setIsHandleEdit(data?.id ? true : false);
        setPromotionId(data?.id || "");
        setTitle(data?.name);
        setStartDate(
          formatWithMoment(data?.fromDate || new Date(), "MM/DD/YYYY")
        );

        setEndDate(formatWithMoment(data?.toDate, "MM/DD/YYYY"));
        if (data?.toDate && data?.fromDate) {
          setStartTime(data?.fromDate);
          // setStartTime(formatWithMoment(data?.fromDate, "hh:mm A"));
          setEndTime(data?.toDate);
          // setEndTime(formatWithMoment(data?.toDate || new Date(), "hh:mm A"));
        } else {
          // const index = getCurrentIndexWorkingTime();
          //   console.log(index);
          // setStartTime(WorkingTime[index]?.value ?? "12:00 AM");
          // setEndTime(WorkingTime[index + 1]?.value ?? "12:00 AM");
          setStartTime(new Date());
          setEndTime(new Date());
        }
        setPromotionType(data?.promotionType || "percent");
        setPromotionValue(data?.promotionValue || "");
        setIsDisabled(data?.isDisabled ? false : true);
        setCondition(getConditionTitleIdById(data?.conditionId || 1));
        setActionCondition(
          getDiscountActionByShortName(data?.applyTo || "all")
        );
        handleScroll(0, false)();
        if (_.isEmpty(data)) {
          setValue(0);
        }
      },
    }));

    useEffect(() => {
      const tempService = servicesByMerchant.map((service) => ({
        value: service?.name || "",
        type: "Service",
        originalId: service?.serviceId || 0,
        id: `${service?.serviceId}_Service`,
      }));
      const tempProduct = productsByMerchantId.map((product) => ({
        value: product?.name || "",
        type: "Product",
        originalId: product?.productId || 0,
        id: `${product?.productId}_Product`,
      }));
      const tempData = tempService.concat(tempProduct);
      setDataServiceProduct(tempData);
    }, [productsByMerchantId, servicesByMerchant]);

    useEffect(() => {
      // console.log('----- useEffect 3 --------');
      if (promotionDetailById?.id) {
        const serviceConditionTag =
          promotionDetailById?.conditionDetail?.service || [];
        const productonditionTag =
          promotionDetailById?.conditionDetail?.product || [];
        const tempServiceConditionTag = getTagInfoById(
          "Service",
          serviceConditionTag,
          dataServiceProduct
        );
        const tempProductonditionTag = getTagInfoById(
          "Product",
          productonditionTag,
          dataServiceProduct
        );
        const tempConditionServiceProductTags = [
          ...tempServiceConditionTag,
          ...tempProductonditionTag,
        ];

        const serviceActionConditionTag =
          promotionDetailById?.applyToDetail?.service || [];
        const productActionConditionTag =
          promotionDetailById?.applyToDetail?.product || [];
        const tempServiceActionConditionTag = getTagInfoById(
          "Service",
          serviceActionConditionTag,
          dataServiceProduct
        );
        const tempProductActionConditionTag = getTagInfoById(
          "Product",
          productActionConditionTag,
          dataServiceProduct
        );
        const tempActionConditionTags = [
          ...tempServiceActionConditionTag,
          ...tempProductActionConditionTag,
        ];

        let tempNumberOfTimesApply =
          promotionDetailById?.conditionId === 4
            ? promotionDetailById?.conditionDetail
            : "";

        setConditionServiceProductTags(tempConditionServiceProductTags);
        setActionTags(tempActionConditionTags);
        setNumberOfTimesApply(tempNumberOfTimesApply);
      }
    }, [promotionDetailById]);

    useEffect(() => {
      // console.log('----- useEffect 1 --------');
      if (!_.isEmpty(smsInfoMarketing)) {
        calculatorsmsMoney(value);
      }
    }, [title, conditionServiceProductTags, actionTags]);

    useEffect(() => {
      if (!_.isEmpty(smsInfoMarketing)) {
        // console.log('----- useEffect 4 --------');

        const customerCount = smsInfoMarketing?.customerCount || 0;
        const customerSendSMSQuantity =
          promotionDetailById?.customerSendSMSQuantity || 0;
        const tempValue = customerSendSMSQuantity / customerCount;

        // console.log('--- customerCount: ', customerCount);
        // console.log('--- customerSendSMSQuantity: ', customerSendSMSQuantity);
        // console.log('--- tempValue: ', tempValue);

        setValue(tempValue);
        calculatorsmsMoney(tempValue);
      }
    }, [smsInfoMarketing]);

    calculatorsmsMoney = (tempValue) => {
      const customerCount = parseInt(smsInfoMarketing?.customerCount || 0);
      const smsCount = Math.ceil(tempValue * customerCount);

      const smsLength = smsInfoMarketing?.smsLength || 1;
      const segmentFee = smsInfoMarketing?.segmentFee || 1;
      const segmentLength = smsInfoMarketing?.segmentLength || 1;
      // const additionalFee = parseFloat(smsCount > 0 ? (smsInfoMarketing?.additionalFee || 0) : 0);
      const additionalFee = parseFloat(smsInfoMarketing?.additionalFee || 0);

      const allSMSWord =
        smsLength +
        (title?.length || 0) +
        (getConditionIdByTitle(condition) === 2
          ? `${conditionServiceProductTags.join(", ")}`.length + 35
          : 0) +
        (getShortNameForDiscountAction(actionCondition) === "specific"
          ? `${actionTags.join(", ")}`.length + 35
          : 0);
      const tempFee =
        Math.ceil(
          parseFloat(Math.ceil(allSMSWord / segmentLength) * segmentFee) * 100
        ) /
          100 +
        additionalFee;
      const smsMoney = parseFloat(smsCount * tempFee);

      const smsMaxMoney =
        customerCount == 0 ? 0 : parseFloat(customerCount * tempFee);
      // console.log('----- tempValue: ', tempValue);
      // console.log('----- smsMaxMoney: ', smsMaxMoney);

      setSmsAmount(formatMoney(smsMoney));
      setSmsMaxAmount(formatMoney(smsMaxMoney));
      setCustomerSendSMSQuantity(smsCount);
    };

    const showDatePicker = (isChangeDate) => () => {
      setIsChangeDate(isChangeDate);
      setDatePickerVisibility(true);
    };

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
      } else {
        alert("The item is exist");
      }

      setDynamicConditionMarginBottom(24);
    };

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
      } else {
        alert("The item is exist");
      }
      setDynamicActionTagsMarginBottom(24);
    };

    removeConditionServiceProductTags = (tag) => {
      const tempData = [];
      for (let i = 0; i < conditionServiceProductTags.length; i++) {
        if (conditionServiceProductTags[i]?.id !== tag?.id) {
          tempData.push({ ...conditionServiceProductTags[i] });
        }
      }
      setConditionServiceProductTags(tempData);
    };

    removeActionTags = (tag) => {
      const tempData = [];
      for (let i = 0; i < actionTags.length; i++) {
        if (actionTags[i]?.id !== tag?.id) {
          tempData.push({ ...actionTags[i] });
        }
      }
      setActionTags(tempData);
    };

    handleSetPromotionType = (type) => () => {
      setPromotionType(type);
    };

    handleCampaign = () => {
      const tempConditionTags = getFormatTags(conditionServiceProductTags);
      const tempActionTags = getFormatTags(actionTags);
      const campaign = {
        name: title,
        fromDate: `${formatWithMoment(
          new Date(startDate),
          "YYYY-MM-DD"
        )}T${formatHourMinute(formatWithMoment(startTime, HOURS_FORMAT))}:00`,
        toDate: `${formatWithMoment(
          new Date(endDate),
          "YYYY-MM-DD"
        )}T${formatHourMinute(formatWithMoment(endTime, HOURS_FORMAT))}:00`,
        conditionId: getConditionIdByTitle(condition),
        applyTo: getShortNameForDiscountAction(actionCondition),
        conditionDetail:
          getConditionIdByTitle(condition) === 4
            ? numberOfTimesApply
            : {
                service: tempConditionTags?.services || [],
                product: tempConditionTags?.products || [],
              },
        applyToDetail: {
          service: tempActionTags?.services || [],
          product: tempActionTags?.products || [],
        },
        promotionType: promotionType,
        promotionValue: `${promotionValue || 0.0}`,
        isDisabled: isDisabled ? 0 : 1,
        smsAmount: smsAmount,
        customerSendSMSQuantity: customerSendSMSQuantity,
      };

      // ------------ Check Valid ---------
      let isValid = true;
      const fromDate = new Date(campaign?.fromDate).getTime();
      const toDate = new Date(campaign?.toDate).getTime();

      if (!campaign?.name) {
        alert("Enter the campaign's name please!");
        isValid = false;
      } else if (parseInt(fromDate) >= parseInt(toDate)) {
        alert("The start date is not larger than the to date ");
        isValid = false;
      } else if (
        campaign.conditionId === 2 &&
        conditionServiceProductTags.length < 1
      ) {
        alert("Select services/product specific please!");
        isValid = false;
      } else if (
        campaign.conditionId === 4 &&
        parseInt(numberOfTimesApply ? numberOfTimesApply : 0) < 1
      ) {
        alert("Enter the number of times applied please!");
        isValid = false;
      } else if (campaign?.applyTo === "specific" && actionTags.length < 1) {
        alert("Select services/product for discount specific please!");
        isValid = false;
      } else if (promotionValue == 0) {
        alert("Enter promotion value please!");
        isValid = false;
      }

      if (isValid) {
        isHandleEdit
          ? updatePromotionById(promotionId, campaign)
          : handleCreateNewCampaign(campaign);
      }
    };

    handleScroll =
      (number, animated = true) =>
      () => {
        scrollRef?.current?.scrollTo({
          x: 0,
          y: scaleSize(number),
          animated: animated,
        });
      };

    handleConditionDropdown = (count = 0) => {
      setDynamicConditionMarginBottom(count * 24);
    };

    handleActionTagsDropdown = (count = 0) => {
      setDynamicActionTagsMarginBottom(count * 24);
    };

    handleSetCondition = (value) => {
      setCondition(value);
      setDynamicConditionMarginBottom(24);
      getSMSInformation(getConditionIdByTitle(value));
    };

    handleSetActionCondition = (value) => {
      setActionCondition(value);
      setDynamicActionTagsMarginBottom(24);
    };

    hanldeSliderValue = (value) => {
      setValue(value);
      calculatorsmsMoney(value);
    };

    handleSetCampaignName = (title) => {
      setTitle(title);
      // calculatorsmsMoney(value);
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: scaleSize(14),
        }}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* ------------------- New Campaigns ------------------- */}
          <Text
            style={{
              color: "#404040",
              fontSize: scaleSize(16),
              fontWeight: "600",
              marginBottom: scaleSize(20),
            }}
          >
            {`New campaign`}
          </Text>

          <InputForm
            title={`${localize("Campaign Name", language)}:`}
            subTitle=""
            placeholder="Campaign name"
            value={title}
            onChangeText={handleSetCampaignName}
            style={{ marginBottom: scaleSize(10) }}
            styleTitle={{
              fontSize: scaleSize(14),
              fontWeight: "600",
              marginBottom: scaleSize(5),
            }}
            styleInputText={{ fontSize: scaleSize(13) }}
          />

          {/* ------------------- Date ------------------- */}
          <Text
            style={[
              styles.txt_tit,
              { marginBottom: scaleSize(10), marginTop: scaleSize(12) },
            ]}
          >
            {`Date:`}
          </Text>

          {/* ------------------- Start Date and End Date ------------------- */}
          <View style={{ flexDirection: "row" }}>
            {/* ------------------- Start Date ------------------- */}
            <View style={{ flex: 1 }}>
              <Text style={[styles.txt_date, { marginBottom: scaleSize(10) }]}>
                {`Start Date`}
              </Text>
              <View style={{ flexDirection: "row", height: scaleSize(30) }}>
                <SelectPromotionDate
                  value={startDate}
                  onChangeText={setStartDate}
                  showDatePicker={showDatePicker("start")}
                />
                <View style={{ width: scaleSize(25) }} />
                {/* ---------  Start Time ------ */}
                {/* <Dropdown
                    label={"h:mm"}
                    data={WorkingTime}
                    value={startTime}
                    onChangeText={setStartTime}
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: "#DDDDDD",
                      flex: 1,
                    }}
                    itemCount={WorkingTime.length}
                  /> */}
                <CustomTimePicker
                  editable={true}
                  defaultValue={startTime}
                  onChangeDate={(d) => {
                    setStartTime(d);
                  }}
                  renderBase={(showPicker) => (
                    <View
                      style={{
                        width: scaleSize(135),
                        height: "100%",
                        borderWidth: 1,
                        borderColor: "#ccc",
                        flexDirection: "row",
                        paddingHorizontal: scaleSize(10),
                      }}
                    >
                      <TextInput
                        editable={false}
                        placeholder="--:--"
                        value={getWorkingTime(startTime)}
                        // editable={false}
                        // onChangeText={(txt) => {
                        //   setStartTime(txt);
                        // }}
                        style={{
                          flex: 1,
                          fontSize: scaleSize(14),
                          color: "#1f1f1f",
                          padding: 0,
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          width: scaleSize(40),
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                        onPress={showPicker}
                      >
                        <Image
                          source={IMAGE.dropdown}
                          style={{ resizeMode: "center" }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />

                <View style={{ width: scaleSize(28) }} />
              </View>

              {/* ---------  Specific Condition ------ */}
              <ConditionSpecific
                title={"Condition"}
                comparativeCondition={"Using specific services"}
                dropdownData={MARKETING_CONDITIONS}
                condition={condition}
                setCondition={handleSetCondition}
                addTag={addConditionServiceProductTags}
                dataServiceProduct={dataServiceProduct}
              />

              {condition === "Using specific services" && (
                <>
                  <Text
                    style={[
                      styles.txt_date,
                      { marginBottom: scaleSize(8), marginTop: scaleSize(5) },
                    ]}
                  >
                    {`Select services/products`}
                  </Text>
                  <View
                    style={{
                      height: scaleSize(30),
                      width: scaleSize(330),
                      paddingHorizontal: 1,
                      marginBottom: scaleSize(
                        dynamicConditionMarginBottom === 24 &&
                          conditionServiceProductTags.length > 0
                          ? 5
                          : dynamicConditionMarginBottom
                      ),
                    }}
                  >
                    <DropdownSearch
                      dataServiceProduct={dataServiceProduct}
                      selectedTag={addConditionServiceProductTags}
                      onFocus={handleScroll(280)}
                      onChangeText={handleConditionDropdown}
                    />
                  </View>

                  <View style={{ width: "90%" }}>
                    <Tags
                      tags={conditionServiceProductTags}
                      removeTag={removeConditionServiceProductTags}
                    />
                  </View>
                </>
              )}

              {condition === "Times using the service reached the quantity" && (
                <InputForm
                  title={`${localize("Number of times applied", language)}:`}
                  subTitle=""
                  placeholder="Campaign name"
                  value={numberOfTimesApply}
                  isOnlyNumber={true}
                  onChangeText={setNumberOfTimesApply}
                  style={{
                    marginBottom: scaleSize(10),
                    marginTop: scaleSize(5),
                    width: scaleSize(200),
                  }}
                  styleTitle={{
                    fontSize: scaleSize(12),
                    fontWeight: "400",
                    marginBottom: scaleSize(2),
                  }}
                  styleInputText={{ fontSize: scaleSize(13) }}
                  onFocus={handleScroll(280)}
                />
              )}

              {/* ---------  Promotion type ------ */}
              <Text
                style={[
                  styles.txt_tit,
                  { marginBottom: scaleSize(15), marginTop: scaleSize(20) },
                ]}
              >
                {`Promotion type:`}
              </Text>

              <View style={{ flexDirection: "row", height: scaleSize(30) }}>
                {/* ---------  Specific ------ */}
                <Button
                  onPress={handleSetPromotionType("percent")}
                  style={[
                    { width: scaleSize(30) },
                    styles.centered_box,
                    promotionType === "percent"
                      ? styles.border_select
                      : styles.border_unselect,
                  ]}
                >
                  <Text
                    style={
                      promotionType === "percent"
                        ? styles.txt_condition_select
                        : styles.txt_condition_unselect
                    }
                  >
                    {`%`}
                  </Text>
                </Button>
                {/* ---------  All ------ */}
                <Button
                  onPress={handleSetPromotionType("fixed")}
                  style={[
                    {
                      width: scaleSize(30),
                      marginLeft: scaleSize(4),
                      marginRight: scaleSize(10),
                    },
                    styles.centered_box,
                    promotionType === "fixed"
                      ? styles.border_select
                      : styles.border_unselect,
                  ]}
                >
                  <Text
                    style={
                      promotionType === "fixed"
                        ? styles.txt_condition_select
                        : styles.txt_condition_unselect
                    }
                  >
                    {`$`}
                  </Text>
                </Button>

                <View
                  style={[
                    { flexDirection: "row", width: scaleSize(140) },
                    styles.border_comm,
                  ]}
                >
                  {/* --------- Input Promotion type ------ */}
                  <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }}>
                    <TextInputMask
                      type={"money"}
                      options={{
                        precision: 2,
                        separator: ".",
                        delimiter: ",",
                        unit: "",
                        suffixUnit: "",
                      }}
                      placeholder="0.00"
                      value={promotionValue}
                      onChangeText={setPromotionValue}
                      style={[
                        {
                          flex: 1,
                          fontSize: scaleSize(12),
                          color: "#404040",
                          padding: 0,
                        },
                      ]}
                      onFocus={handleScroll(500)}
                    />
                  </View>
                  <View
                    onPress={showDatePicker}
                    style={[{ width: scaleSize(25) }, styles.centered_box]}
                  >
                    <Text style={styles.txt_date}>
                      {promotionType === "percent" ? `%` : `$`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ---------  Promotion type ------ */}
              <Text
                style={[
                  styles.txt_tit,
                  { marginBottom: scaleSize(10), marginTop: scaleSize(20) },
                ]}
              >
                {`Active`}
              </Text>

              <Switch
                trackColor={{ false: "#767577", true: "#0764B0" }}
                ios_backgroundColor="#E5E5E5"
                value={isDisabled}
                onValueChange={setIsDisabled}
              />
            </View>

            {/* ------------------- End Date ------------------- */}
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.txt_date,
                  { marginLeft: scaleSize(18), marginBottom: scaleSize(10) },
                ]}
              >
                {`End Date`}
              </Text>
              <View style={{ flexDirection: "row", height: scaleSize(30) }}>
                <View style={{ width: scaleSize(18) }} />
                <SelectPromotionDate
                  value={endDate}
                  onChangeText={setEndDate}
                  showDatePicker={showDatePicker("end")}
                />
                <View style={{ width: scaleSize(25) }} />
                {/* ---------  End Time ------ */}
                {/* <Dropdown
                    label={"h:mm"}
                    data={WorkingTime}
                    value={endTime}
                    onChangeText={setEndTime}
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: "#DDDDDD",
                      flex: 1,
                    }}
                  /> */}
                <CustomTimePicker
                  editable={false}
                  defaultValue={endTime}
                  onChangeDate={(d) => {
                    setEndTime(d);
                  }}
                  renderBase={(showPicker) => (
                    <View
                      style={{
                        width: scaleSize(135),
                        height: "100%",
                        borderWidth: 1,
                        borderColor: "#ccc",
                        flexDirection: "row",
                        paddingHorizontal: scaleSize(10),
                      }}
                    >
                      <TextInput
                        placeholder="--:--"
                        value={getWorkingTime(endTime)}
                        // onChangeText={(txt) => {
                        //   setEndTime(txt);
                        // }}
                        style={{
                          flex: 1,
                          fontSize: scaleSize(14),
                          color: "#1f1f1f",
                          padding: 0,
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          width: scaleSize(40),
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                        onPress={showPicker}
                      >
                        <Image
                          source={IMAGE.dropdown}
                          style={{ resizeMode: "center" }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <View style={{ width: scaleSize(10) }} />
              </View>

              {/* ---------  Actions Condition ------ */}
              <ConditionSpecific
                title={"Action"}
                condition={actionCondition}
                comparativeCondition={"Discount for specific services"}
                dropdownData={DISCOUNT_ACTION}
                setCondition={handleSetActionCondition}
                dataServiceProduct={dataServiceProduct}
                addTag={addActionTags}
              />

              {actionCondition === "Discount for specific services" && (
                <>
                  <Text
                    style={[
                      styles.txt_date,
                      { marginBottom: scaleSize(8), marginTop: scaleSize(5) },
                    ]}
                  >
                    {`Select services/products`}
                  </Text>
                  <View
                    style={{
                      height: scaleSize(30),
                      width: scaleSize(330),
                      paddingHorizontal: 1,
                      marginBottom: scaleSize(
                        dynamicActionTagsMarginBottom === 24 &&
                          actionTags.length > 0
                          ? 5
                          : dynamicActionTagsMarginBottom
                      ),
                    }}
                  >
                    <DropdownSearch
                      dataServiceProduct={dataServiceProduct}
                      selectedTag={addActionTags}
                      onFocus={handleScroll(450)}
                      onChangeText={handleActionTagsDropdown}
                    />
                  </View>

                  <View style={{ width: "100%" }}>
                    <Tags tags={actionTags} removeTag={removeActionTags} />
                  </View>
                </>
              )}

              {/* ---------- SMS configuration ----------- */}
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(16),
                  fontWeight: "600",
                  marginTop: scaleSize(20),
                }}
              >
                {`SMS configuration`}
              </Text>
              <Text
                style={{
                  color: "#404040",
                  fontSize: scaleSize(14),
                  fontWeight: "400",
                  marginTop: scaleSize(8),
                }}
              >
                {`Number of messages`}
              </Text>

              {/* -------------- Range Of Slider ----------------- */}
              <View
                style={{
                  paddingRight: scaleSize(26),
                  marginVertical: scaleSize(30),
                }}
              >
                {/* -------------- Min Of Slider ----------------- */}

                <View
                  style={{
                    height: scaleSize(20),
                    marginTop: scaleSize(8),
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(14),
                      fontWeight: "400",
                    }}
                  >
                    {`0`}
                  </Text>

                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(14),
                      fontWeight: "400",
                    }}
                  >
                    {`${smsInfoMarketing?.customerCount}`}
                  </Text>
                </View>

                <Slider
                  value={value}
                  onValueChange={hanldeSliderValue}
                  trackStyle={{
                    height: scaleSize(10),
                    backgroundColor: "#F1F1F1",
                    borderRadius: scaleSize(6),
                  }}
                  thumbStyle={{
                    height: scaleSize(24),
                    width: scaleSize(24),
                    borderRadius: scaleSize(12),
                    backgroundColor: "#fff",
                    ...Platform.select({
                      ios: {
                        shadowColor: "rgba(0, 0, 0,0.3)",
                        shadowOffset: { width: 1, height: 0 },
                        shadowOpacity: 1,
                      },

                      android: {
                        elevation: 2,
                      },
                    }),
                  }}
                  minimumTrackTintColor="#0764B0"
                  smsCount={customerSendSMSQuantity}
                  smsMaxCount={smsInfoMarketing?.customerCount || 1}
                  smsMoney={smsAmount}
                  smsMaxMoney={smsMaxAmount}
                />

                {/* -------------- Max Of Slider ----------------- */}
                <View
                  style={{
                    height: scaleSize(20),
                    marginTop: scaleSize(8),
                    alignItems: "flex-end",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(14),
                      fontWeight: "600",
                    }}
                  >
                    {`$ 0.00`}
                  </Text>

                  <Text
                    style={{
                      color: "#404040",
                      fontSize: scaleSize(14),
                      fontWeight: "600",
                    }}
                  >
                    {`$${smsMaxAmount}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: scaleSize(300) }} />
        </ScrollView>

        {/* --------------- Footer ---------------- */}
        <View
          style={{
            width: scaleSize(250),
            height: scaleSize(35),
            position: "absolute",
            bottom: scaleSize(20),
            left: (width - scaleSize(280)) / 2,
            flexDirection: "row",
          }}
        >
          <Button
            onPress={cancelCampaign}
            style={[
              { flex: 1, backgroundColor: "#F1F1F1", borderRadius: 2 },
              styles.centered_box,
            ]}
          >
            <Text style={styles.txt_footer}>{`CANCEL`}</Text>
          </Button>
          <View style={{ width: scaleSize(25) }} />
          <Button
            onPress={handleCampaign}
            style={[
              { flex: 1, backgroundColor: "#0764B0", borderRadius: 2 },
              styles.centered_box,
            ]}
          >
            <Text style={[styles.txt_footer, { color: "#fff" }]}>
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
);

// ---------------- Internal Components ------------------

const SelectPromotionDate = ({ value, onChangeText, showDatePicker }) => {
  return (
    <View
      style={[
        { flexDirection: "row", width: scaleSize(190) },
        styles.border_comm,
      ]}
    >
      {/* --------- Input Start Date ------ */}
      <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }}>
        <TextInputMask
          type={"custom"}
          options={{
            mask: "99/99/9999",
          }}
          placeholder="MM/DD/YYYY"
          value={value}
          onChangeText={onChangeText}
          style={[
            { flex: 1, fontSize: scaleSize(12), color: "#404040", padding: 0 },
          ]}
          editable={false}
        />
      </View>
      <View style={{ width: 1, paddingVertical: scaleSize(3) }}>
        <View style={{ flex: 1, backgroundColor: "#CCCCCC" }} />
      </View>
      <Button
        onPress={showDatePicker}
        style={{
          width: scaleSize(35),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={ICON.marketing_calendar} />
      </Button>
    </View>
  );
};

const ConditionSpecific = ({
  title,
  condition,
  setCondition,
  addTag,
  dropdownData,
  dataServiceProduct,
}) => {
  const [tag, setTag] = useState("");
  const [tagIndex, setTagIndex] = useState(-1);

  onChangeServiceProduct = (value, index) => {
    setTag(value);
    setTagIndex(index);
  };

  handleAddTag = () => {
    if (tag && tagIndex !== -1) {
      addTag({ ...dataServiceProduct[tagIndex] });
      setTag("");
      setTagIndex(-1);
    }
  };

  return (
    <View>
      <Text
        style={[
          styles.txt_tit,
          { marginBottom: scaleSize(15), marginTop: scaleSize(16) },
        ]}
      >
        {`${title}:`}
      </Text>

      {/* ---------  Condition Dropdown ------ */}
      <View
        style={{
          width: scaleSize(330),
          height: scaleSize(30),
          marginBottom: scaleSize(10),
        }}
      >
        <Dropdown
          label={"h:mm"}
          data={dropdownData}
          value={condition}
          onChangeText={setCondition}
          containerStyle={{
            borderWidth: 1,
            borderColor: "#DDDDDD",
            flex: 1,
          }}
        />
      </View>
    </View>
  );
};

const Tags = ({ tags, removeTag }) => {
  return (
    <View style={{ flexDirection: "row", marginTop: scaleSize(10) }}>
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
        {tags.map((tag, index) => (
          <Tag
            key={index}
            name={tag?.value || ""}
            removeTag={() => removeTag(tag)}
          />
        ))}
      </View>
      <View style={[{ width: scaleSize(85), marginLeft: scaleSize(15) }]} />
    </View>
  );
};

const Tag = ({ name, removeTag }) => {
  return (
    <Button
      onPress={removeTag}
      style={{
        flexDirection: "row",
        marginRight: scaleSize(18),
        alignItems: "center",
        marginBottom: scaleSize(4),
      }}
    >
      <Text style={[styles.txt_condition_select, { fontWeight: "600" }]}>
        {name}
      </Text>
      <Image source={ICON.remove_tag} style={{ marginLeft: scaleSize(5) }} />
    </Button>
  );
};

const styles = StyleSheet.create({
  centered_box: {
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: scaleSize(14),
    fontWeight: "600",
  },
  txt_condition_unselect: {
    color: "#A9A9A9",
    fontSize: scaleSize(14),
    fontWeight: "600",
  },
  txt_date: {
    color: "#6A6A6A",
    fontSize: scaleSize(12),
    fontWeight: "400",
  },
  border_comm: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  txt_tit: {
    color: "#404040",
    fontSize: scaleSize(14),
    fontWeight: "600",
  },
  txt_footer: {
    fontSize: scaleSize(14),
    color: "#404040",
    fontWeight: "400",
  },
});

export default PromotiomDetail;