import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { scaleSzie } from '@utils';
import styles from '../style';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const ItemCalendar = ({title,value,onPress}) => {
    return (
        <Button onPress={() => onPress()} style={{ height: scaleSzie(30), flexDirection: 'row', marginTop: scaleSzie(8) }} >
            <View style={{
                justifyContent: 'center', width: scaleSzie(80), paddingRight: scaleSzie(10), alignItems: 'flex-end'
            }} >
                <Text style={styles.textNormal} >
                    {title}
                </Text>
            </View>

            <View style={{
                width: scaleSzie(180), backgroundColor: '#F1F1F1', borderWidth: 1, borderColor: '#C5C5C5',
                flexDirection: 'row'
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(8) }} >
                    <Text style={styles.textNormal} >
                        {value}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSzie(2) }} >
                    <View style={{ flex: 1, backgroundColor: '#C5C5C5' }} />
                </View>
                <View style={{ width: scaleSzie(40), justifyContent: 'center', alignItems: 'center' }} >
                    <Image source={IMAGE.calendar} style={{ height: scaleSzie(20), width: scaleSzie(20) }} />
                </View>
            </View>
        </Button>
    );
}

export default ItemCalendar;