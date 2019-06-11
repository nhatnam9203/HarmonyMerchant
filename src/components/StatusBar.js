import React from 'react';
import {
    View,
    StatusBar,
    Platform
} from 'react-native';

const StatusBarHeader = () => {
    if(Platform.OS === 'ios'){
        return (
            <View>
                <StatusBar backgroundColor="blue" barStyle="light-content" />
                <View style={{ height: 20,backgroundColor:'#000' }} />
            </View>
        );
    }
    return <View />
   
}

export default StatusBarHeader;