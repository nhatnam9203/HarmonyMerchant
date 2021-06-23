import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import IMAGE from '@resources';
import { Dropdown, Button } from '@components';
import { ScaleSzie, WorkingTime } from '@utils';


export const ItemWorkingTime = ({ title, data,selectCheckbox, onChangeTimeOfWorkingTime }) => {
    const isCheck = data?.isCheck;
    const timeStart = data?.timeStart;
    const timeEnd = data?.timeEnd
    const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;

    return (
        <View style={{
            flexDirection: 'row',
            height: ScaleSzie(36),
            paddingHorizontal: ScaleSzie(25),
            marginTop: ScaleSzie(14)
        }} >
            <Button onPress={selectCheckbox} style={{ width: ScaleSzie(30), justifyContent: 'center' }} >
                <Image source={temptIconCheck} style={{ width: ScaleSzie(15), height: ScaleSzie(15) }} />
            </Button>

            <View style={{ width: ScaleSzie(120), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: ScaleSzie(14),
                    fontWeight: '600',
                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ width: ScaleSzie(150) }} >
                <Dropdown
                    label={'08:00 AM'}
                    data={WorkingTime}
                    value={timeStart}
                    onChangeText={(value) => onChangeTimeOfWorkingTime(value,title,"timeStart")}
                    containerStyle={{
                        backgroundColor: '#F1F1F1',
                        borderWidth: 1,
                        borderColor: '#C5C5C5',
                        flex: 1
                    }}
                />
            </View>
            <View style={{ justifyContent: 'center', paddingHorizontal: ScaleSzie(8) }} >
                <View style={{
                    backgroundColor: '#404040',
                    width: ScaleSzie(12),
                    height: 1
                }}  >
                </View>
            </View>
            <View style={{ width: ScaleSzie(150) }} >
                <Dropdown
                    label={'09:00 AM'}
                    data={WorkingTime}
                    value={timeEnd}
                    onChangeText={(value) => onChangeTimeOfWorkingTime(value,title,"timeEnd")}
                    containerStyle={{
                        backgroundColor: '#F1F1F1',
                        borderWidth: 1,
                        borderColor: '#C5C5C5',
                        flex: 1
                    }}
                />
            </View>
        </View >
    );
}