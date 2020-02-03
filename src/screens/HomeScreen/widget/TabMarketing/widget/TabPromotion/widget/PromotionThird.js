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
import { Text, InputForm ,ButtonCustom} from '@components';
import ItemCalendar from './ItemCalendar';
import ItemPromo from './ItemPromo';
import ItemDropdown from './ItemDropdown';
import ItemCheckBoxInput from './ItemCheckBoxInput';
import connectRedux from '@redux/ConnectRedux';

class PromotionThird extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
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
        const { language } = this.props;
        const { data } = this.state;
        const { campaignName } = data;
        return (
            <ItemPromo
                title={data.defaultName}
                style={{ marginTop: scaleSzie(15) }}
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
                    />
                    {/* ---- Row ---- */}
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14)
                    }} >
                        {`${localize('Promotion', language)}:`}
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
                                if (data.discountType === 'discount_fixtom') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true);
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_fixtom', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    });
                                    this.props.actions.marketing.setStatusApplyButton(true);
                                }
                            }}
                        />
                    </View>
                    <View style={{alignItems:'center',marginTop:scaleSzie(20)}} >
                        <ButtonCustom
                            width={scaleSzie(160)}
                            height={40}
                            backgroundColor="#4CD964"
                            title={localize('Send Notification', language)}
                            textColor="#fff"
                            onPress={this.sendNotification}
                            styleText={{fontSize:scaleSzie(14),fontWeight:'600'}}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' ,borderRadius:scaleSzie(4)}}
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

}

const mapStateToProps = state => ({
  })
  
  
  
  export default connectRedux(mapStateToProps, PromotionThird);