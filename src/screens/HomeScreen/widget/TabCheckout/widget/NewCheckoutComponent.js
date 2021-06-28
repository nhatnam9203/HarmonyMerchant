import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from "ramda";

import { scaleSize, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";
import styles from "../style";

export const StaffItem = ({staff,selectedStaff ,displayCategoriesColumn}) => {
    const temptBackgrounColor = staff?.staffId === selectedStaff?.staffId ? { backgroundColor: '#0764B0' } : {};
    const tempTxtColor = staff?.staffId === selectedStaff?.staffId  ? {color:"#fff"} :{};
    const backgroundColorAvailable = staff?.isNextAvailableStaff ? {backgroundColor:"#FF3B30"} : {};
   
    return (
        <Button onPress={displayCategoriesColumn} style={[styles.staff_item,temptBackgrounColor]} >
            <View style={styles.staff_avatar_box} >
                <FastImage
                    style={styles.staff_avatar}
                    source={{
                        uri: staff?.imageUrl || "https://staffsenate.uncg.edu/wp-content/uploads/2019/02/Avatar-2.png",
                        headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                />
            </View>
            <Text style={[styles.txt_staff_name,tempTxtColor]} >
                {staff?.displayName || ""}
            </Text>
            {/* -------- staff number of appointment ------- */}
            <View style={[styles.number_staff_appointment_box,backgroundColorAvailable]} >
                <Text style={styles.number_staff_appointment} >
                    {staff?.orderNumber || 0}
                </Text>
            </View>
        </Button>
    );
}
