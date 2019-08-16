import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform
} from 'react-native';

import { Button, Text } from '@components';
import { scaleSzie, localize} from '@utils';
import IMAGE from '@resources';

class AddDeviceHardware extends React.Component {

    onPressBox=(type)=>{
       
    }

    // -------- Render ------

    render() {
        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(14), paddingTop: scaleSzie(20) }} >
            <Text style={{
                fontSize: scaleSzie(16),
                fontWeight: '600',
                color: '#0764B0'
            }} >
                Payment Terminal
            </Text>

            <Text style={{
                fontSize: scaleSzie(16),
                fontWeight: '600',
                color: 'rgb(81,81,81)',
                marginTop: scaleSzie(26)
            }} >
                Connected device
            </Text>

            <Text style={{
                fontSize: scaleSzie(12),
                //  fontWeight: '600',
                color: 'rgb(131,131,131)',
                marginTop: scaleSzie(10),
                marginBottom: scaleSzie(7)
            }} >
                No connected device
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center',}} >
                <View style={{
                    width: scaleSzie(20), height: scaleSzie(20),
                    borderRadius: scaleSzie(4), borderColor: '#0764B0', borderWidth: 3, 
                    justifyContent: 'center',
                     alignItems: 'center',
                }} >
                    <Text style={{
                        fontSize: scaleSzie(14),
                        color: '#0764B0',
                        fontWeight: 'bold'
                    }} >
                        +
                    </Text>
                </View>

                <Text style={{
                    fontSize: scaleSzie(12),
                    color: '#0764B0',
                    marginLeft: scaleSzie(8)
                }} >
                    Add device
                </Text>
            </View>

        </View>
        );
    }
}


export default AddDeviceHardware;

