import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { scaleSize ,formatWithMoment} from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const ItemBanner = ({ banner, deleteBanner }) => {
    const { createdDate, description, imageUrl, title, merchantBannerId } = banner;
    return (
        <View style={{
            height: scaleSize(100), paddingLeft: scaleSize(15), marginBottom: scaleSize(10),
        }} >
            <View style={{
                width: scaleSize(360),
                backgroundColor: '#F1F1F1',
                height: scaleSize(100),
                flexDirection: 'row'
            }} >
                <View style={{
                    paddingLeft: scaleSize(6), paddingRight: scaleSize(9),
                    justifyContent: 'center'
                }} >
                    <Image
                        source={IMAGE.iconItemBanner}
                        style={{ width: scaleSize(10), height: scaleSize(65) }}
                    />

                </View>
                <View style={{ justifyContent: 'center' }} >
                    <View style={{ width: scaleSize(130), height: scaleSize(85) }} >
                        <FastImage
                            style={{ width: scaleSize(130), height: scaleSize(85) }}
                            source={{
                                uri: imageUrl,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: scaleSize(10), paddingTop: scaleSize(10), paddingRight: scaleSize(10) }}  >
                    <Text style={{ color: '#404040', fontSize: scaleSize(14) }} numberOfLines={1} >
                        {title}
                    </Text>
                    <Text style={{ color: '#404040', fontSize: scaleSize(12), marginVertical: scaleSize(2) }} >
                        {`Date: ${formatWithMoment(createdDate,'MM/DD/YYYY')}`}
                    </Text>
                    <Text style={{ color: '#404040', fontSize: scaleSize(12) }} numberOfLines={2} >
                        {description}
                    </Text>
                </View>
                <Button onPress={() => deleteBanner(merchantBannerId)} style={{
                    width: scaleSize(28), height: scaleSize(28), backgroundColor: '#fff',
                    position: 'absolute', top: 2, right: 2, justifyContent: 'center', alignItems: 'center'
                }} >
                    <Image source={IMAGE.deleteIconBanner} style={{ width: scaleSize(14), height: scaleSize(14) }} />
                </Button>
            </View>
        </View>
    );
}

export default ItemBanner;