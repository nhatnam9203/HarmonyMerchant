import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from "ramda";

import { scaleSzie, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";
import styles from "../style";

export const StaffItem = ({ displayCategoriesColumn}) => {

    return (
        <Button onPress={displayCategoriesColumn} style={styles.staff_item} >
            <View style={styles.staff_avatar_box} >
                <FastImage
                    style={styles.staff_avatar}
                    source={{
                        uri: 'https://unsplash.it/400/400?image=1',
                        headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
            <Text style={styles.txt_staff_name} >
                {`Jessica`}
            </Text>
            {/* -------- staff number of appointment ------- */}
            <View style={styles.number_staff_appointment_box} >
                <Text style={styles.number_staff_appointment} >
                    {`1`}
                </Text>
            </View>
        </Button>
    );
}
