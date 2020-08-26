import React from 'react';
import {
    View
} from 'react-native';

import { scaleSzie, localize, updateStateChildren } from '@utils';
import { Text, InputForm, ButtonCustom } from '@components';
import ItemPromo from './ItemPromo';
import ItemCheckBoxInput from './ItemCheckBoxInput';
import connectRedux from '@redux/ConnectRedux';

class PromotionFive extends React.Component {

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

    showContent =  () => {
        this.setState(prevState => ({
            isShowContent: !prevState.isShowContent
        }),() =>{
            if(!this.state.isShowContent){
                this.props.toogleOtherPromotions("promotionFiveRef");
            }
        })
    }

    checkSelectPromotion = () => {
        const { data } = this.state;
        const isCheck = data.isDisabled === 0 ? 1 : 0;
        this.setState({
            data: updateStateChildren('isDisabled', isCheck, data)
        });
        this.props.actions.marketing.setStatusApplyButton(true,5);
    }

    applyPromotion = () => {
        const { data } = this.state;
        const isSendNoti = data.isDisabled === 0 ? false : true;
        this.props.applyPromotion(data.promotionId,isSendNoti);
    }

    // ----------- RENDER ----------

    render() {
        const { language,onFocus,isApplyFivethPromotion } = this.props;
        const { data ,isShowContent} = this.state;
        const { campaignName } = data;
        return (
            <ItemPromo
                title={data.defaultName}
                style={{ marginTop: scaleSzie(15) }}
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
                            this.props.actions.marketing.setStatusApplyButton(true,5);
                        }}
                        style={{ marginBottom: scaleSzie(10) }}
                        styleTitle={{ fontWeight: "600" }}
                        onFocus={() => onFocus(250)}
                    />
                    {/* ---- Row ---- */}
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
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
                                this.props.actions.marketing.setStatusApplyButton(true,5);
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_percent') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,5);
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_percent', data)
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,5);
                                }
                            }}
                            onFocus={() => onFocus(350)}
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
                                this.props.actions.marketing.setStatusApplyButton(true,5);
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_fixtom') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,5);
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_fixtom', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true,5);
                                }
                            }}
                            onFocus={() => onFocus(350)}
                        />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: scaleSzie(20) }} >
                         {
                            isApplyFivethPromotion ? <ButtonCustom
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
    isApplyFivethPromotion: state.marketing.isApplyFivethPromotion
})

export default connectRedux(mapStateToProps, PromotionFive);