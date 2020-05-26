import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import moment from 'moment';

import { scaleSzie, localize, updateStateChildren } from '@utils';
import IMAGE from '@resources';
import { Text, InputForm, ButtonCustom } from '@components';
import ItemCalendar from './ItemCalendar';
import ItemPromo from './ItemPromo';
import ItemDropdown from './ItemDropdown';
import ItemCheckBoxInput from './ItemCheckBoxInput';
import connectRedux from '@redux/ConnectRedux';

class PromotionFirst extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    setStateFromParent = async (data) =>{
        await this.setState({
            data
        })
    }

    setDateFromParent = (key, value) => {
        this.setState({
            data: updateStateChildren(key, value, this.state.data)
        })
    }

    checkSelectPromotion = () => {
        const { data } = this.state;
        const isCheck = data.isDisabled === 0 ? 1 : 0;
        this.setState({
            data: updateStateChildren('isDisabled', isCheck, data)
        });
        this.props.checkSelectPromotion();
    }

    sendNotification = () => {
        const { data } = this.state;
        this.props.sendNotification(data.promotionId)
    }

    // ----------- RENDER ----------

    render() {
        const { language, showCalendar } = this.props;
        const { data } = this.state;
        const { campaignName } = data;
        return (
            <ItemPromo
                title={data.defaultName}
                isSelected={data.isDisabled === 0 ? false : true}
                isShowContent={false}
                checkSelectPromotion={this.checkSelectPromotion}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title={`${localize('Campaign Name', language)}:`}
                        subTitle=""
                        placeholder=""
                        value={campaignName}
                        onChangeText={(value) => {
                            this.setState({
                                data: updateStateChildren('campaignName', value, data)
                            });
                            this.props.actions.marketing.setStatusApplyButton(true);
                        }}
                        style={{ marginBottom: scaleSzie(10) }}
                        styleTitle={{fontWeight:"600"}}
                    />
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                        fontWeight:"600"
                    }} >
                        {`${localize('Campaign Time', language)}:`}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCalendar
                            title={localize('Start Date', language)}
                            value={`${moment(data.fromDate).format('MM/DD/YYYY')}`}
                            onPress={() => showCalendar('fromDate', data.fromDate, 1)}
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCalendar
                            title={localize('End Date', language)}
                            value={`${moment(data.toDate).format('MM/DD/YYYY')}`}
                            onPress={() => showCalendar('toDate', data.toDate, 1)}

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <View style={{
                        flexDirection: 'row', marginTop: scaleSzie(2), marginBottom: scaleSzie(20),
                    }} >
                        <ItemDropdown
                            ref={this.dropdownFromRef}
                            title={localize('From', language)}
                            width={120}
                            placeholder="08:00 AM"
                            value={data.fromTime}
                            onChangeText={value => {
                                this.setState({
                                    data: updateStateChildren('fromTime', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true);
                            }}
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemDropdown
                            ref={this.dropdownToRef}
                            title={localize('To', language)}
                            width={120}
                            placeholder="08:00 AM"
                            value={data.toTime}
                            onChangeText={value => {
                                this.setState({
                                    data: updateStateChildren('toTime', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true);
                            }}
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                        fontWeight:"600"
                    }} >
                        {`${localize('Promotion form', language)}:`}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title={`${localize('Discount by percent', language)} (%)`}
                            placeholder="15"
                            isSelectCheckBox={data.discountType === 'discount_percent' ? true : false}
                            value={data.discountType === 'discount_percent' ? data.discount : ''}
                            onChangeText={(value) => {
                                this.setState({
                                    data: updateStateChildren('discount', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true);
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_percent') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true);
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_percent', data)
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true);
                                }
                            }}
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={`${localize('Discount fix amount', language)} ($)`}
                            placeholder="100"
                            isSelectCheckBox={data.discountType === 'discount_fixtom' ? true : false}
                            value={data.discountType === 'discount_fixtom' ? data.discount : ''}
                            onChangeText={(value) => {
                                this.setState({
                                    data: updateStateChildren('discount', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true);
                            }}
                            selectCheckbox={() => {
                                this.props.actions.marketing.setStatusApplyButton(true);
                                if (data.discountType === 'discount_fixtom') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_fixtom', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                }
                            }}
                        />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: scaleSzie(20) }} >
                        <ButtonCustom
                            width={scaleSzie(160)}
                            height={40}
                            backgroundColor="#4CD964"
                            title={localize('Send Notification', language)}
                            textColor="#fff"
                            onPress={this.sendNotification}
                            styleText={{ fontSize: scaleSzie(14), fontWeight: '600' }}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(4) }}
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

}

const mapStateToProps = state => ({
  })
  
  
  
  export default connectRedux(mapStateToProps, PromotionFirst);