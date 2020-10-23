import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize, updateStateChildren } from '@utils';
import { Text, InputForm } from '@components';
import ItemPromo from './ItemPromo';
import connectRedux from '@redux/ConnectRedux';

class PromotionRewardPoints extends React.Component {

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
                this.props.toogleOtherPromotions("promotionRewardPointsRef");
            }
        })
    }

    checkSelectPromotion = () => {
    }

    sendNotification = () => {
        const { data } = this.state;
        this.props.sendNotification(data.promotionId)
    }

    // ----------- RENDER ----------
    render() {
        const { language } = this.props;
        const { data,isShowContent } = this.state;
        const { campaignName } = data;
        const earnPoint = (100* parseFloat(data.discount)/100);

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
                            {`${parseInt(earnPoint)}`}
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