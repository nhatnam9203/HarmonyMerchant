import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

import { scaleSzie } from '../../../../../../utils';
import styles from './style';
import IMAGE from '../../../../../../resources';
import { Text, Button, ButtonCustom } from '../../../../../../components';

class Layout extends React.Component {

    renderHeader() {
        return (
            <View style={styles.header} >
                <View style={{
                    flex: 1, justifyContent: 'flex-end',
                    paddingLeft: scaleSzie(15), paddingBottom: scaleSzie(10)
                }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                        Media List
                        </Text>
                </View>
                <View style={{
                    flex: 0.8,
                    paddingBottom: scaleSzie(10), justifyContent: 'flex-end'
                }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                        Create new media
                        </Text>
                </View>
            </View>
        );
    }

    renderLeftContent() {
        return (
            <View style={styles.leftContent} >
                <ScrollView>
                    <View style={{ height: scaleSzie(15) }} />
                    {/* ----- Item ---- */}
                    <View style={{ height: scaleSzie(100), paddingLeft: scaleSzie(15) }} >
                        <View style={{
                            width: scaleSzie(350), backgroundColor: '#F1F1F1', height: scaleSzie(100),
                            flexDirection: 'row'
                        }} >
                            <View style={{
                                paddingLeft: scaleSzie(6), paddingRight: scaleSzie(9),
                                justifyContent: 'center'
                            }} >
                                <Image
                                    source={IMAGE.iconItemBanner}
                                    style={{ width: scaleSzie(10), height: scaleSzie(65) }}
                                />
                            </View>
                            <View style={{ justifyContent: 'center' }} >
                                <View style={{ width: scaleSzie(130), height: scaleSzie(85) }} >
                                    <Image source={{ uri: 'https://www.superdrug.com/medias/custom-content/microsites/2015/event01/nails/images/landing/newdesign/nail-makeup-main-banner-mob.jpg' }}
                                        style={{ width: null, height: null, flex: 1 }}
                                        resizeMode="stretch"
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1, paddingLeft: scaleSzie(10), paddingTop: scaleSzie(10), paddingRight: scaleSzie(10) }}  >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} numberOfLines={1} >
                                    Banner Name
                                </Text>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginVertical: scaleSzie(2) }} >
                                    Date: 07/08/2019
                                </Text>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} numberOfLines={2} >
                                    Lorem Ipsum is simply dummy
                                    text of the printing and.
                                </Text>
                            </View>
                            <Button onPress={() => { }} style={{
                                width: scaleSzie(28), height: scaleSzie(28), backgroundColor: '#fff',
                                position: 'absolute', top: 2, right: 2, justifyContent: 'center', alignItems: 'center'
                            }} >
                                <Image source={IMAGE.deleteIconBanner} style={{ width: scaleSzie(14), height: scaleSzie(14) }} />
                            </Button>
                        </View>
                    </View>

                    {/* --------------- */}
                </ScrollView>
            </View>
        );
    }

    renderRightContent() {
        return (
            <View style={styles.rightContent} >
                <View style={{ flex: 1, paddingTop: scaleSzie(40) }} >
                    <View style={{
                        width: scaleSzie(300), height: scaleSzie(240),
                        borderWidth: 2, borderColor: '#C5C5C5',
                        borderStyle: "dashed",
                        borderRadius: scaleSzie(14),
                        alignItems: 'center',
                        paddingTop: scaleSzie(30)

                    }} >
                        <Button onPress={() => { }} >
                            <Image
                                source={IMAGE.camera}
                            />
                        </Button>

                        <View style={{ flex: 1, alignItems: 'center', marginTop: scaleSzie(10) }} >
                            <Text style={{
                                color: '#6A6A6A', fontSize: scaleSzie(20), fontWeight: 'bold',
                            }} >
                                Take a Photo
                            </Text>
                            <Text style={{
                                color: '#6A6A6A', fontSize: scaleSzie(20),
                                marginVertical: scaleSzie(15)
                            }} >
                                Or
                            </Text>
                            <ButtonCustom
                                width={scaleSzie(140)}
                                height={40}
                                backgroundColor="#F1F1F1"
                                title="Browse File"
                                textColor="#6A6A6A"
                                onPress={() => { }}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                styleText={{ fontSize: scaleSzie(16), fontWeight: '500' }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ height: scaleSzie(70), }} >
                    <ButtonCustom
                        width={scaleSzie(290)}
                        height={60}
                        backgroundColor="#0764B0"
                        title="NEXT"
                        textColor="#fff"
                        onPress={() => { }}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(24), fontWeight: 'bold' }}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                <View style={styles.content} >
                    {this.renderLeftContent()}
                    {this.renderRightContent()}
                </View>
            </View>
        );
    }

}

export default Layout;

