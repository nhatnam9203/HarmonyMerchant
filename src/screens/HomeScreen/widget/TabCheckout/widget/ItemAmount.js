import React from 'react';
import {
    View,
    Image
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button } from '@components';
import IMAGE from '@resources';

const ItemAmount = ({ }) => {
    return (
        <View onPress={() => { }} style={{
            height: scaleSzie(85),
            borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: '#0764B0',
        }} >
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-around', paddingTop: scaleSzie(8)
            }} >
                <Button>
                    <Image
                        source={IMAGE.subAmount}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button>
                <View style={{
                    width: scaleSzie(90), borderColor: '#fff',
                    borderWidth: 3, borderRadius: scaleSzie(8), height: scaleSzie(40),
                    justifyContent: 'center', alignItems: 'center'
                }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(30),fontWeight:'bold' }} >
                       1
                    </Text>
                </View>
                <Button>
                    <Image
                        source={IMAGE.plusAmount}
                        style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                    />
                </Button>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: '#fff', fontSize: scaleSzie(20) }} >
                    $ 10
                </Text>
            </View>
        </View>
    );
}

export default ItemAmount;