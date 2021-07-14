import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import IMAGE from '@resources';
import { DropdownCustom, Button } from '@components';
import { scaleSize, WorkingTime } from '@utils';


export const ItemWorkingTime = ({ title, data, selectCheckbox, onChangeTimeOfWorkingTime, isEdit }) => {
    const isCheck = data?.isCheck;
    const timeStart = data?.timeStart;
    const timeEnd = data?.timeEnd
    const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;

    // console.log({ isEdit })

    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSize(36),
            paddingHorizontal: scaleSize(25),
            marginTop: scaleSize(14)
        }} >
            <Button onPress={selectCheckbox} style={{ width: scaleSize(30), justifyContent: 'center' }} >
                <Image source={temptIconCheck} style={{ width: scaleSize(15), height: scaleSize(15) }} />
            </Button>

            <View style={{ width: scaleSize(120), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSize(14),
                    fontWeight: '600',
                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ width: scaleSize(150) }} >
                <DropdownCustom
                    label={'08:00 AM'}
                    data={WorkingTime}
                    value={timeStart}
                    onChangeText={(value) => onChangeTimeOfWorkingTime(value, title, "timeStart")}
                    containerStyle={{
                        backgroundColor: '#F1F1F1',
                        borderWidth: 1,
                        borderColor: '#C5C5C5',
                        flex: 1
                    }}
                    isScrollNow={!isEdit}
                />
            </View>
            <View style={{ justifyContent: 'center', paddingHorizontal: scaleSize(8) }} >
                <View style={{
                    backgroundColor: '#404040',
                    width: scaleSize(12),
                    height: 1
                }}  >
                </View>
            </View>
            <View style={{ width: scaleSize(150) }} >
                <DropdownCustom
                    label={'09:00 AM'}
                    data={WorkingTime}
                    value={timeEnd}
                    onChangeText={(value) => onChangeTimeOfWorkingTime(value, title, "timeEnd")}
                    containerStyle={{
                        backgroundColor: '#F1F1F1',
                        borderWidth: 1,
                        borderColor: '#C5C5C5',
                        flex: 1
                    }}
                    isScrollNow={!isEdit}
                />
            </View>
        </View>
    );
}