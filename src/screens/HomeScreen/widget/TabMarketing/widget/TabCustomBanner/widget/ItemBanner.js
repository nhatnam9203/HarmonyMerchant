import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { scaleSzie ,formatWithMoment} from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const ItemBanner = ({ banner, deleteBanner }) => {
    const { createdDate, description, imageUrl, title, merchantBannerId } = banner;
    return (
        <View style={{
            height: scaleSzie(100), paddingLeft: scaleSzie(15), marginBottom: scaleSzie(10),
        }} >
            <View style={{
                width: scaleSzie(360),
                backgroundColor: '#F1F1F1',
                height: scaleSzie(100),
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
                        <FastImage
                            style={{ width: scaleSzie(130), height: scaleSzie(85) }}
                            source={{
                                uri: imageUrl,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: scaleSzie(10), paddingTop: scaleSzie(10), paddingRight: scaleSzie(10) }}  >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} numberOfLines={1} >
                        {title}
                    </Text>
                    <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginVertical: scaleSzie(2) }} >
                        {`Date: ${formatWithMoment(createdDate,'MM/DD/YYYY')}`}
                    </Text>
                    <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} numberOfLines={2} >
                        {description}
                    </Text>
                </View>
                <Button onPress={() => deleteBanner(merchantBannerId)} style={{
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