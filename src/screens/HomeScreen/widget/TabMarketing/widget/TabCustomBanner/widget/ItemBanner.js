import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { ScaleSzie ,formatWithMoment} from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const ItemBanner = ({ banner, deleteBanner }) => {
    const { createdDate, description, imageUrl, title, merchantBannerId } = banner;
    return (
        <View style={{
            height: ScaleSzie(100), paddingLeft: ScaleSzie(15), marginBottom: ScaleSzie(10),
        }} >
            <View style={{
                width: ScaleSzie(360),
                backgroundColor: '#F1F1F1',
                height: ScaleSzie(100),
                flexDirection: 'row'
            }} >
                <View style={{
                    paddingLeft: ScaleSzie(6), paddingRight: ScaleSzie(9),
                    justifyContent: 'center'
                }} >
                    <Image
                        source={IMAGE.iconItemBanner}
                        style={{ width: ScaleSzie(10), height: ScaleSzie(65) }}
                    />

                </View>
                <View style={{ justifyContent: 'center' }} >
                    <View style={{ width: ScaleSzie(130), height: ScaleSzie(85) }} >
                        <FastImage
                            style={{ width: ScaleSzie(130), height: ScaleSzie(85) }}
                            source={{
                                uri: imageUrl,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: ScaleSzie(10), paddingTop: ScaleSzie(10), paddingRight: ScaleSzie(10) }}  >
                    <Text style={{ color: '#404040', fontSize: ScaleSzie(14) }} numberOfLines={1} >
                        {title}
                    </Text>
                    <Text style={{ color: '#404040', fontSize: ScaleSzie(12), marginVertical: ScaleSzie(2) }} >
                        {`Date: ${formatWithMoment(createdDate,'MM/DD/YYYY')}`}
                    </Text>
                    <Text style={{ color: '#404040', fontSize: ScaleSzie(12) }} numberOfLines={2} >
                        {description}
                    </Text>
                </View>
                <Button onPress={() => deleteBanner(merchantBannerId)} style={{
                    width: ScaleSzie(28), height: ScaleSzie(28), backgroundColor: '#fff',
                    position: 'absolute', top: 2, right: 2, justifyContent: 'center', alignItems: 'center'
                }} >
                    <Image source={IMAGE.deleteIconBanner} style={{ width: ScaleSzie(14), height: ScaleSzie(14) }} />
                </Button>
            </View>
        </View>
    );
}

export default ItemBanner;