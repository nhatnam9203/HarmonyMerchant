import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { scaleSzie } from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const ItemBanner = ({ title, placeholder }) => {
    return (
        <View style={{ height: scaleSzie(100), paddingLeft: scaleSzie(15) ,marginBottom:scaleSzie(10)}} >
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
    );
}

export default ItemBanner;