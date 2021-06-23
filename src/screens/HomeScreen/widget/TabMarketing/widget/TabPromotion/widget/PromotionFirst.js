import React from 'react';
import {
    View,
} from 'react-native';

import { ScaleSzie, localize, updateStateChildren, formatWithMoment } from '@utils';
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
            isShowContent: true
        };
    }

    setStateFromParent = async (data) => {
        await this.setState({
            data
        })
    }

    toogleFromParent = async (isShowContent = false) => {
        await this.setState({
            isShowContent
        })
    }

    showContent = () => {
        this.setState(prevState => ({
            isShowContent: !prevState.isShowContent
        }), () => {
            if (!this.state.isShowContent) {
                this.props.toogleOtherPromotions("promotionFirstRef");
            }
        })
    }

    setDateFromParent = async (key, value) => {
        await this.setState({
            data: updateStateChildren(key, value, { ...this.state.data })
        });
    }

    checkSelectPromotion = () => {
        const { data } = this.state;
        const isCheck = data.isDisabled === 0 ? 1 : 0;
        this.setState({
            data: updateStateChildren('isDisabled', isCheck, data)
        });
        this.props.actions.marketing.setStatusApplyButton(true, 1);
    }

    applyPromotion = () => {
        const { data } = this.state;
        const isSendNoti = data.isDisabled === 0 ? false : true;
        this.props.applyPromotion(data.promotionId, isSendNoti);
    }

    // ----------- RENDER ----------
    render() {
        const { language, showCalendar, onFocus, isApplyFirstPromotion } = this.props;
        const { data, isShowContent } = this.state;
        const { campaignName } = data;
        return (
            <ItemPromo
                ref={this.promoRef}
                title={data.defaultName}
                isSelected={data.isDisabled === 0 ? false : true}
                isShowContent={isShowContent}
                checkSelectPromotion={this.checkSelectPromotion}
                showContent={this.showContent}
            >
                <View style={{ paddingHorizontal: ScaleSzie(10), paddingVertical: ScaleSzie(10) }} >
                    <InputForm
                        title={`${localize('Campaign Name', language)}:`}
                        subTitle=""
                        placeholder=""
                        value={campaignName}
                        onChangeText={(value) => {
                            this.setState({
                                data: updateStateChildren('campaignName', value, data)
                            });
                            this.props.actions.marketing.setStatusApplyButton(true, 1);
                        }}
                        style={{ marginBottom: ScaleSzie(10) }}
                        styleTitle={{ fontWeight: "600" }}
                    />
                    <Text style={{
                        color: '#404040',
                        fontSize: ScaleSzie(14),
                        fontWeight: "600"
                    }} >
                        {`${localize('Campaign Time', language)}:`}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCalendar
                            title={localize('Start Date', language)}
                            value={`${formatWithMoment(data.fromDate, 'MM/DD/YYYY')}`}
                            onPress={() => showCalendar('fromDate', data.fromDate, 1)}
                        />
                        <View style={{ width: ScaleSzie(50) }} />
                        <ItemCalendar
                            title={localize('End Date', language)}
                            value={`${formatWithMoment(data.toDate, 'MM/DD/YYYY')}`}
                            onPress={() => showCalendar('toDate', data.toDate, 1)}

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <View style={{
                        flexDirection: 'row', marginTop: ScaleSzie(2), marginBottom: ScaleSzie(20),
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
                                this.props.actions.marketing.setStatusApplyButton(true, 1);
                            }}
                        />
                        <View style={{ width: ScaleSzie(50) }} />
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
                                this.props.actions.marketing.setStatusApplyButton(true, 1);
                            }}
                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={{
                        color: '#404040',
                        fontSize: ScaleSzie(14),
                        fontWeight: "600"
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
                                this.props.actions.marketing.setStatusApplyButton(true, 1);
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_percent') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true, 1);
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_percent', data)
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true, 1);
                                }
                            }}
                            onFocus={() => onFocus(250)}
                        />
                        <View style={{ width: ScaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={`${localize('Discount fix amount', language)} ($)`}
                            placeholder="100"
                            isSelectCheckBox={data.discountType === 'discount_fixtom' ? true : false}
                            value={data.discountType === 'discount_fixtom' ? data.discount : ''}
                            onChangeText={(value) => {
                                this.setState({
                                    data: updateStateChildren('discount', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true, 1);
                            }}
                            selectCheckbox={() => {
                                this.props.actions.marketing.setStatusApplyButton(true, 1);
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
                            onFocus={() => onFocus(250)}
                        />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: ScaleSzie(20) }} >
                        {
                            isApplyFirstPromotion ? <ButtonCustom
                                width={ScaleSzie(150)}
                                height={40}
                                backgroundColor="#4CD964"
                                title={localize('Apply', language)}
                                textColor="#fff"
                                onPress={this.applyPromotion}
                                styleText={{ fontSize: ScaleSzie(17), fontWeight: 'bold' }}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: ScaleSzie(4) }}
                            /> : <ButtonCustom
                                    width={ScaleSzie(150)}
                                    height={40}
                                    backgroundColor="#E5E5E5"
                                    title={localize('APPLY', language)}
                                    textColor="#404040"
                                    onPress={() => { }}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                    styleText={{ fontSize: ScaleSzie(17), fontWeight: 'bold' }}
                                    activeOpacity={1}
                                />
                        }
                    </View>
                </View>
            </ItemPromo>
        );
    }

}

const mapStateToProps = state => ({
    isApplyFirstPromotion: state.marketing.isApplyFirstPromotion
})



export default connectRedux(mapStateToProps, PromotionFirst);