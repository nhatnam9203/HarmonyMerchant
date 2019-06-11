import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import Swiper from 'react-native-swiper';

import { Text, ButtonCustom, Button } from '../../components';
import { scaleSzie } from '../../utils';
import styles from './style';
import Configs from '../../configs';
import IMAGE from '../../resources';
import strings from './strings';

export default class Layout extends React.Component {

    renderHeader() {
        return (
            <View style={styles.header} >
                <View style={styles.headerLeft} >
                    <Image source={IMAGE.logo}
                        style={{
                            height: scaleSzie(50),
                            width: scaleSzie(222)
                        }}
                    />
                </View>
                <View style={styles.headerRigth} >
                    <Button onPress={this.skip} >
                        <Text style={styles.textSkip} >
                            Skip
                        </Text>
                    </Button>
                </View>
            </View>
        );
    }

    renderBody() {
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
                            title={"Booking Management"}
                            desc={strings.Booking}
                            icon={IMAGE.slider1}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <ItemSlide
                            title={"POS System"}
                            desc={strings.Pos}
                            icon={IMAGE.slider2}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <ItemSlide
                            title={"Marketing"}
                            desc={strings.Marketing}
                            icon={IMAGE.slider3}
                        />
                    </View>
                    <View style={{ flex: 1 }} >
                        <ItemSlide
                            title={"Report And Management"}
                            desc={strings.Report}
                            icon={IMAGE.slider4}
                        />
                    </View>




                </Swiper>
            </View>
        );
    }

    renderFooter() {
        return (
            <View style={styles.footer} >
                <View style={styles.footerLeft} >
                    <ButtonCustom
                        width="80%"
                        backgroundColor="#4CD964"
                        title="APPLICATION"
                        textColor="#fff"
                        onPress={this.gotoApplication}
                    />
                </View>
                <View style={styles.footerLeft} >
                    <ButtonCustom
                        width="80%"
                        backgroundColor="#0764B0"
                        title="DEMO"
                        textColor="#fff"
                        onPress={this.gotoDemo}
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