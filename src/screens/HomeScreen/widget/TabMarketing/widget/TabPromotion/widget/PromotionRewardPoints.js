import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions,
    ActivityIndicator
} from 'react-native';

import { scaleSzie, localize, updateStateChildren } from '@utils';
import IMAGE from '@resources';
import { Text, InputForm, ButtonCustom } from '@components';
import ItemCalendar from './ItemCalendar';
import ItemPromo from './ItemPromo';
import ItemDropdown from './ItemDropdown';
import ItemCheckBoxInput from './ItemCheckBoxInput';
import connectRedux from '@redux/ConnectRedux';

class PromotionRewardPoints extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    setDateFromParent = (key, value) => {
        this.setState({
            data: updateStateChildren(key, value, this.state.data)
        })
    }

    checkSelectPromotion = () => {
        // const { data } = this.state;
        // const isCheck = data.isDisabled === 0 ? 1 : 0;
        // this.setState({
        //     data: updateStateChildren('isDisabled', isCheck, data)
        // });
        // this.props.checkSelectPromotion();
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
                        styleTitle={{ fontWeight: "600" }}
                        editable={false}
                    />

                    {/* ---- Row ---- */}
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                         marginTop: scaleSzie(10),
                        fontWeight: "600"
                    }} >
                        {`${localize('Promotion form', language)}:`}
                    </Text>

                    <Text style={{
                        color: '#6A6A6A',
                        fontSize: scaleSzie(14), marginTop: scaleSzie(15),
                    }} >
                        {`${localize('Receive reward points according to the payment value', language)}`}
                    </Text>

                    {/* ---- Row ---- */}
                    <View style={{ width: scaleSzie(200), marginTop: scaleSzie(15) }}  >
                        <InputForm
                            title={`${localize('Rate', language)} (%)`}
                            subTitle=""
                            placeholder="100"
                            value={data.discount}
                            onChangeText={(value) => {
                                this.setState({
                                    data: updateStateChildren('discount', value, data)
                                });
                                this.props.actions.marketing.setStatusApplyButton(true);
                            }}
                            // onChangeText={(value) => { }}
                            style={{ marginBottom: scaleSzie(0) }}
                            styleTitle={{ color: "#404040" }}
                            isOnlyNumber={true}
                            typeInputMask={'money'}
                            optionsInputMask={{
                                precision: 2,
                                separator: '.',
                                delimiter: ',',
                                unit: '',
                                suffixUnit: ''
                            }}
                            editable={false}
                        />
                    </View>

                    <Text style={{
                        color: '#6A6A6A',
                        fontSize: scaleSzie(12), marginTop: scaleSzie(7),marginBottom:scaleSzie(6)
                    }} >
                        {`* ${localize('Payment of ', language)}`}
                        <Text style={{ color: '#0764B0', fontWeight: "bold" }} >
                            $100
                        </Text>
                        <Text style={{}} >
                            {`${localize(' get ', language)}`}
                        </Text>
                        <Text style={{ color: '#0764B0', fontWeight: "bold" }} >
                            100
                        </Text>
                        <Text style={{}} >
                            {`${localize(' reward points', language)}`}
                        </Text>
                    </Text>


                </View>
            </ItemPromo>
        );
    }

}

const mapStateToProps = state => ({
})



export default connectRedux(mapStateToProps, PromotionRewardPoints);