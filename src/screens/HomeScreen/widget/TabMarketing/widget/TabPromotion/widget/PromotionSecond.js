import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize, updateStateChildren, getServiceNameById ,formatWithMoment} from '@utils';
import { Text, InputForm, ButtonCustom } from '@components';
import ItemCalendar from './ItemCalendar';
import ItemPromo from './ItemPromo';
import ItemDropdown from './ItemDropdown';
import ItemCheckBoxInput from './ItemCheckBoxInput';
import connectRedux from '@redux/ConnectRedux';

class PromotionSecond extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            isShowContent: true
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

    toogleFromParent = async (isShowContent = false) => {
        await this.setState({
            isShowContent
        })
    }

    showContent =  () => {
        this.setState(prevState => ({
            isShowContent: !prevState.isShowContent
        }),() =>{
            if(!this.state.isShowContent){
                this.props.toogleOtherPromotions("promotionSecondRef");
            }
        })
    }

    checkSelectPromotion = () => {
        const { data } = this.state;
        const isCheck = data.isDisabled === 0 ? 1 : 0;
        this.setState({
            data: updateStateChildren('isDisabled', isCheck, data)
        });
        this.props.actions.marketing.setStatusApplyButton(true,2);
    }

    applyPromotion = () => {
        const { data } = this.state;
        const isSendNoti = data.isDisabled === 0 ? false : true;
        this.props.applyPromotion(data.promotionId,isSendNoti);
    }

    // ----------- RENDER ----------

    render() {
        const { language, showCalendar, dataDropdown, servicesByMerchant,onFocus ,isApplySecondPromotion} = this.props;
        const { data ,isShowContent} = this.state;
        const { campaignName } = data;
        return (
            <ItemPromo
                title={data.defaultName}
                isSelected={data.isDisabled === 0 ? false : true}
                isShowContent={isShowContent}
                checkSelectPromotion={this.checkSelectPromotion}
                showContent={this.showContent}
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
                            this.props.actions.marketing.setStatusApplyButton(true,2);
                        }}
                        style={{ marginBottom: scaleSzie(10) }}
                        styleTitle={{fontWeight:"600"}}
                        onFocus={() => onFocus(100)}
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
                            title={localize('Start Date ', language)}
                            value={`${formatWithMoment(data.fromDate,'MM/DD/YYYY')}`}
                            onPress={() => showCalendar('fromDate', data.fromDate, 2)}
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCalendar
                            title={localize('End Date', language)}
                            value={`${formatWithMoment(data.toDate,'MM/DD/YYYY')}`}
                            onPress={() => showCalendar('toDate', data.toDate, 2)}

                        />
                    </View>
                    {/* ---- Row ---- */}
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                        marginTop: scaleSzie(14),
                        fontWeight:"600"
                    }} >
                        {`${localize('Promotional Services', language)}:`}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{
                        flexDirection: 'row', marginTop: scaleSzie(2), marginBottom: scaleSzie(20),
                    }} >
                        <ItemDropdown
                            title={localize('Using', language)}
                            width={180}
                            placeholder={localize('Services', language)}
                            value={getServiceNameById(servicesByMerchant, data.serviceUsing)}
                            dataDropdown={dataDropdown}
                            onChangeText={value => {
                                this.setState({
                                    data: updateStateChildren('serviceUsing', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true,2);
                            }}
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemDropdown
                            title={localize('Apply to', language)}
                            width={180}
                            placeholder={localize('Services', language)}
                            value={getServiceNameById(servicesByMerchant, data.serviceApply)}
                            dataDropdown={dataDropdown}
                            onChangeText={value => {
                                this.setState({
                                    data: updateStateChildren('serviceApply', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true,2);
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
                                this.props.actions.marketing.setStatusApplyButton(true,2);
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_percent') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,2);
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_percent', data)
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,2);
                                }
                            }}
                            onFocus={() => onFocus(330)}
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
                                this.props.actions.marketing.setStatusApplyButton(true,2);
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_fixtom') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,2);
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_fixtom', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,2);
                                }
                            }}
                            onFocus={() => onFocus(330)}
                        />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: scaleSzie(20) }} >
                        {
                            isApplySecondPromotion ? <ButtonCustom
                                width={scaleSzie(150)}
                                height={40}
                                backgroundColor="#4CD964"
                                title={localize('Apply', language)}
                                textColor="#fff"
                                onPress={this.applyPromotion}
                                styleText={{ fontSize: scaleSzie(17), fontWeight: 'bold' }}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(4) }}
                            /> : <ButtonCustom
                                    width={scaleSzie(150)}
                                    height={40}
                                    backgroundColor="#E5E5E5"
                                    title={localize('APPLY', language)}
                                    textColor="#404040"
                                    onPress={() => { }}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                    styleText={{ fontSize: scaleSzie(17), fontWeight: 'bold' }}
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
    servicesByMerchant: state.service.servicesByMerchant,
    isApplySecondPromotion: state.marketing.isApplySecondPromotion
})



export default connectRedux(mapStateToProps, PromotionSecond);