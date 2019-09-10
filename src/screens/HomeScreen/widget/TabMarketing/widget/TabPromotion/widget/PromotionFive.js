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
import { Text, InputForm } from '@components';
import ItemCalendar from './ItemCalendar';
import ItemPromo from './ItemPromo';
import ItemDropdown from './ItemDropdown';
import ItemCheckBoxInput from './ItemCheckBoxInput';

export default class PromotionFive extends React.Component {

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
        })
    }


    // ----------- RENDER ----------

    render() {
        const { language } = this.props;
        const { data } = this.state;
        const { campaignName } = data;
        return (
            <ItemPromo
                title={localize(campaignName, language)}
                style={{ marginTop: scaleSzie(15) }}
                isSelected={data.isDisabled === 0 ? false : true}
                isShowContent={true}
                checkSelectPromotion={this.checkSelectPromotion}
            >
                <View style={{ paddingHorizontal: scaleSzie(10), paddingVertical: scaleSzie(10) }} >
                    <InputForm
                        title={localize('Campaign Name:', language)}
                        subTitle=""
                        placeholder=""
                        // value={bankName}
                        onChangeText={(value) => { }}
                        style={{ marginBottom: scaleSzie(10) }}
                    />
                    {/* ---- Row ---- */}
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14)
                    }} >
                        {localize('Promotion form:', language)}
                    </Text>
                    {/* ---- Row ---- */}
                    <View style={{ flexDirection: 'row' }} >
                        <ItemCheckBoxInput
                            title={localize('Discount by percent (%)', language)}
                            placeholder="15"
                            isSelectCheckBox={data.discountType === 'discount_percent' ? true : false}
                            value={data.discountType === 'discount_percent' ? data.discount : ''}
                            onChangeText={(value) => {
                                this.setState({
                                    data: updateStateChildren('discount', value, data)
                                })
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_percent') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    })
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_percent', data)
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    })
                                }
                            }}
                        />
                        <View style={{ width: scaleSzie(50) }} />
                        <ItemCheckBoxInput
                            title={localize('Discount fixtom amount ($)', language)}
                            placeholder="100"
                            isSelectCheckBox={data.discountType === 'discount_fixtom' ? true : false}
                            value={data.discountType === 'discount_fixtom' ? data.discount : ''}
                            onChangeText={(value) => {
                                this.setState({
                                    data: updateStateChildren('discount', value, data)
                                })
                            }}
                            selectCheckbox={() => {
                                if (data.discountType === 'discount_fixtom') {
                                    const tempData = updateStateChildren('discountType', '', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    })
                                } else {
                                    const tempData = updateStateChildren('discountType', 'discount_fixtom', data);
                                    this.setState({
                                        data: { ...tempData, discount: 0 }
                                    })
                                }
                            }}
                        />
                    </View>
                </View>
            </ItemPromo>
        );
    }

}