import React from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl

} from 'react-native';

import { scaleSzie, localize } from '@utils';
import styles from './style';
import { ButtonCustom,  DatePicker } from '@components';
import {
    PromotionFirst, PromotionSecond, PromotionThird, PromotionFour, PromotionFive,
    PromotionRewardPoints
} from './widget';

const { width } = Dimensions.get('window');

class Layout extends React.Component {

    renderLoadingPromotion() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ scale: 4 }]
            }} >
                <ActivityIndicator
                    size={'large'}
                    color="rgb(83,157,209)"
                />
            </View>

        );
    }

    render() {
        const { language, promotions, isApplyPromotion, refreshingPromotion } = this.props;
        const { show, dateCalendar } = this.state;
        if (promotions.length == 0) {
            return this.renderLoadingPromotion();
        }
        return (
            <View style={styles.container} >
                <View style={{ flex: 1 }} >
                    <ScrollView
                        ref={this.scrollRef}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshingPromotion}
                                onRefresh={this.onPressListPromotion}
                            />
                        }
                    >
                        {
                            this.getDataItemPromotion(1, promotions) ? <PromotionFirst
                                ref={this.promotionFirstRef}
                                language={language}
                                data={this.getDataItemPromotion(1, promotions)}
                                showCalendar={this.showCalendar}
                                checkSelectPromotion={this.checkSelectPromotion}
                                applyPromotion={this.applyPromotion}
                                onFocus={this.scrollToNumber}
                                toogleOtherPromotions={this.toogleOtherPromotions}
                            /> : <View />
                        }

                        <View style={{ height: scaleSzie(16) }} />
                        {
                            this.getDataItemPromotion(2, promotions) ? <PromotionSecond
                                ref={this.promotionSecondRef}
                                language={language}
                                data={this.getDataItemPromotion(2, promotions)}
                                showCalendar={this.showCalendar}
                                dataDropdown={this.getDataDropdownService()}
                                checkSelectPromotion={this.checkSelectPromotion}
                                applyPromotion={this.applyPromotion}
                                onFocus={this.scrollToNumber}
                                toogleOtherPromotions={this.toogleOtherPromotions}
                            /> : <View />
                        }

                        {
                            this.getDataItemPromotion(3, promotions) ? <PromotionThird
                                ref={this.promotionThirdRef}
                                language={language}
                                data={this.getDataItemPromotion(3, promotions)}
                                checkSelectPromotion={this.checkSelectPromotion}
                                applyPromotion={this.applyPromotion}
                                toogleOtherPromotions={this.toogleOtherPromotions}
                                onFocus={this.scrollToNumber}
                            /> : <View />
                        }

                        {
                            this.getDataItemPromotion(4, promotions) ? < PromotionFour
                                ref={this.promotionFourRef}
                                language={language}
                                data={this.getDataItemPromotion(4, promotions)}
                                checkSelectPromotion={this.checkSelectPromotion}
                                applyPromotion={this.applyPromotion}
                                toogleOtherPromotions={this.toogleOtherPromotions}
                                onFocus={this.scrollToNumber}
                            /> : <View />
                        }

                        {
                            this.getDataItemPromotion(5, promotions) ? <PromotionFive
                                ref={this.promotionFiveRef}
                                language={language}
                                data={this.getDataItemPromotion(5, promotions)}
                                checkSelectPromotion={this.checkSelectPromotion}
                                applyPromotion={this.applyPromotion}
                                toogleOtherPromotions={this.toogleOtherPromotions}
                                onFocus={this.scrollToNumber}
                            /> : <View />
                        }

                        {/* ---------- Reward Points -------- */}
                        <View style={{ height: scaleSzie(16) }} />
                        {
                            this.getDataItemPromotion(6, promotions) ? <PromotionRewardPoints
                                ref={this.promotionRewardPointsRef}
                                language={language}
                                data={this.getDataItemPromotion(6, promotions)}
                                showCalendar={this.showCalendar}
                                checkSelectPromotion={this.checkSelectPromotion}
                                sendNotification={this.sendNotification}
                                toogleOtherPromotions={this.toogleOtherPromotions}
                            /> : <View />
                        }

                        <View style={{ height: scaleSzie(300) }} />
                    </ScrollView>
                </View>

                {/* -------- Button ------------ */}
                {/* <View style={{
                    position: 'absolute', bottom: 0,
                    width: width, height: scaleSzie(70), flexDirection: 'row', justifyContent: 'center'
                }} >
                    <View style={{ width: scaleSzie(20) }} />
                    {
                        isApplyPromotion ? <ButtonCustom
                            width={scaleSzie(290)}
                            height={60}
                            backgroundColor="#0764B0"
                            title={localize('APPLY', language)}
                            textColor="#fff"
                            onPress={this.applyPromotion}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        />
                            :
                            <ButtonCustom
                                width={scaleSzie(290)}
                                height={60}
                                backgroundColor="#E5E5E5"
                                title={localize('APPLY', language)}
                                textColor="#404040"
                                onPress={() => { }}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                activeOpacity={1}
                            />
                    }
                </View> */}

                {/* ------- Date -------- */}
                <DatePicker
                    visible={show}
                    onRequestClose={() => this.setState({ show: false })}
                    title={localize('Select From Date', language)}
                    dateCalendar={dateCalendar}
                    setDateSelected={this.setDateSelected}
                />

            </View>
        );
    }
}




export default Layout;

