import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import Swiper from 'react-native-swiper';

import { Text, ButtonCustom, Button } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

export default class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={styles.header} >
                <View style={styles.headerLeft} >
                    <Image source={IMAGE.logo_small}
                        style={{
                            height: scaleSzie(50),
                            width: scaleSzie(222)
                        }}
                    />
                </View>
                <View style={styles.headerRigth} >
                    <Button onPress={this.skip} >
                        <Text style={styles.textSkip} >
                            {localize('Skip', language)}
                        </Text>
                    </Button>
                </View>
            </View>
        );
    }

    renderBody() {
        const { language } = this.props;
        return (
            <View style={styles.body} >
                <Swiper style={{}}
                    autoplay={true}
                    showsButtons={false}
                    autoplayTimeout={3}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={styles.activeDotStyle}
                    removeClippedSubviews={false}
                >
                    <View style={{ flex: 1 }} >
                        <ItemSlide
                            title={localize('Booking Management', language)}
                            desc={localize('BookingDes', language)}
                            icon={IMAGE.slider1}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <ItemSlide
                            title={localize('POS System', language)}
                            desc={localize('PosDes', language)}
                            icon={IMAGE.slider2}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <ItemSlide
                            title={localize('Marketing', language)}
                            desc={localize('MarketingDes', language)}
                            icon={IMAGE.slider3}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <ItemSlideLast
                            title={localize('Report And Management', language)}
                            desc={localize('ReportDes', language)}
                            icon={IMAGE.slider4}
                        />
                    </View>




                </Swiper>
            </View>
        );
    }

    renderFooter() {
        const { language } = this.props;
        return (
            <View style={styles.footer} >
                <View style={styles.footerLeft} >
                    <ButtonCustom
                        width="40%"
                        backgroundColor="#4CD964"
                        title={localize('APPLICATION', language)}
                        textColor="#fff"
                        onPress={this.gotoApplication}
                        styleText={{fontSize :scaleSzie(26)}}
                        style={{borderRadius:scaleSzie(4)}}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </View>
        );
    }
}


const ItemSlide = props => {
    const { title, desc, icon } = props;
    return (
        <View style={styles.slide} >
            <View style={styles.slideImage} >
                <Image
                    source={icon}
                    style={{ width: null, height: null, flex: 1 }}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.slideText} >
                <Text style={styles.slideTextTitle} >{title}</Text>
                <Text style={styles.slideTextDesc} >{desc}</Text>
            </View>
        </View>
    );
}

const ItemSlideLast = props => {
    const { title, desc, icon } = props;
    return (
        <View style={styles.slide} >
            <View style={styles.slideImage} >
                <Image
                    source={icon}
                    style={{ width: null, height: null, flex: 1 }}
                    resizeMode="contain"
                />
            </View>
            {/* <View style={styles.slideText} >
                <Text style={styles.slideTextTitle} >{title}</Text>
                <Text style={styles.slideTextDesc} >{desc}</Text>
            </View> */}
        </View>
    );
}