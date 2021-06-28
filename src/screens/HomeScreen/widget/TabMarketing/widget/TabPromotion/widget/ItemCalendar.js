import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { scaleSize } from '@utils';
import styles from '../style';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const ItemCalendar = ({title,value,onPress}) => {
    return (
        <Button onPress={() => onPress()} style={{ height: scaleSize(30), flexDirection: 'row', marginTop: scaleSize(8) }} >
            <View style={{
                justifyContent: 'center', width: scaleSize(80), paddingRight: scaleSize(10), alignItems: 'flex-end'
            }} >
                <Text style={styles.textNormal} >
                    {title}
                </Text>
            </View>

            <View style={{
                width: scaleSize(180), backgroundColor: '#F1F1F1', borderWidth: 1, borderColor: '#C5C5C5',
                flexDirection: 'row'
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSize(8) }} >
                    <Text style={styles.textNormal} >
                        {value}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSize(2) }} >
                    <View style={{ flex: 1, backgroundColor: '#C5C5C5' }} />
                </View>
                <View style={{ width: scaleSize(40), justifyContent: 'center', alignItems: 'center' }} >
                    <Image source={IMAGE.calendar} style={{ height: scaleSize(20), width: scaleSize(20) }} />
                </View>
            </View>
        </Button>
    );
}

export default ItemCalendar;