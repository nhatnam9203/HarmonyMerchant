import React from 'react';
import {
    View,
    Image,
    ScrollView,
    Dimensions,
    ActivityIndicator
} from 'react-native';

import { scaleSzie, localize, updateStateChildren } from '@utils';
import styles from './style';
import IMAGE from '@resources';
import { ButtonCustom, Text, InputForm, DatePicker } from '@components';
import {
    PromotionFirst,PromotionSecond, PromotionThird,  PromotionFour,PromotionFive
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
        const { language, promotions } = this.props;
        const { show, dateCalendar } = this.state;
        if (promotions.length == 0) {
            return this.renderLoadingPromotion();
        }
        return (
            <View style={styles.container} >
                <View style={{ flex: 1 }} >
                    <ScrollView>
                        <PromotionFirst
                            ref={this.promotionFirstRef}
                            language={language}
                            data={this.getDataItemPromotion(1, promotions)}
                            showCalendar={this.showCalendar}
                        />
                        <View style={{ height: scaleSzie(16) }} />
                        <PromotionSecond
                            ref={this.promotionSecondRef}
                            language={language}
                            data={this.getDataItemPromotion(2, promotions)}
                            showCalendar={this.showCalendar}
                            dataDropdown={this.getDataDropdownService()}
                        />
                        <PromotionThird
                            ref={this.promotionSecondRef}
                            language={language}
                            data={this.getDataItemPromotion(3, promotions)}
                        />
                        < PromotionFour 
                             ref={this.promotionSecondRef}
                             language={language}
                             data={this.getDataItemPromotion(4, promotions)}
                        />
                        <PromotionFive
                            ref={this.promotionSecondRef}
                            language={language}
                            data={this.getDataItemPromotion(5, promotions)}
                        />
                        <View style={{ height: scaleSzie(300) }} />
                    </ScrollView>
                </View>

                {/* -------- Button ------------ */}
                <View style={{
                    position: 'absolute', bottom: 0,
                    width: width, height: scaleSzie(70), flexDirection: 'row', justifyContent: 'center'
                }} >
                    <View style={{ width: scaleSzie(20) }} />
                    <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title={localize('APPLY', language)}
                        textColor="#fff"
                        onPress={this.applyPromotion}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>

                {/* ------- Date -------- */}
                <DatePicker
                    visible={show}
                    onRequestClose={() => this.setState({ show: false })}
                    title="Select From Date"
                    dateCalendar={dateCalendar}
                    setDateSelected={this.setDateSelected}
                />

            </View>
        );
    }
}




export default Layout;

