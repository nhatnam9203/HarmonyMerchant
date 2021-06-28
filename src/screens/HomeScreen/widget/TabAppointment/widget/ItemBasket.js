import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import Swipeout from 'react-native-swipeout'

import { scaleSize, getTotalProductByQuantity, formatMoney } from '@utils';
import { Text, Button } from '@components';
import IMAGE from '@resources';

const ItemBasket = ({ item, removeItemBasket, onPress, changeProductInBasket }) => {
    const { data } = item;
    const swipeoutBtns = [
        {
            backgroundColor: '#fff',
            component: <Button onPress={() => removeItemBasket(item)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Image source={IMAGE.removeItemBasket} style={{ width: scaleSize(26), height: scaleSize(26) }} />
            </Button>,
        }
    ]
    return (
        <Swipeout
            right={swipeoutBtns}
            buttonWidth={scaleSize(45)}
            close={true}
        >
            <Button onPress={() => {
                if (item.type === 'Service') {
                    onPress(item);
                } else if (item.type === 'Product') {
                    changeProductInBasket(item);
                }
            }} style={{
                height: scaleSize(40), backgroundColor: '#0764B0', borderBottomColor: '#fff', borderBottomWidth: 2,
                flexDirection: 'row'
            }} >
                {/* -------- Avatar ------- */}
                <View style={{ width: scaleSize(45), justifyContent: 'center', alignItems: 'center' }} >
                    {
                        item.type === 'Service' ? <View style={{ width: scaleSize(30), height: scaleSize(30), borderRadius: scaleSize(20), overflow: 'hidden' }} >
                            {item.staff && item.staff.imageUrl ? <Image source={{ uri: item.staff.imageUrl }}
                                style={{ width: scaleSize(30), height: scaleSize(30) }}
                            /> : <View />}
                        </View> :
                            item.type === 'Extra' ? <View style={{
                                width: scaleSize(30), height: scaleSize(30), borderRadius: scaleSize(20), justifyContent: 'center',
                                alignItems: 'center', overflow: 'hidden'
                            }} >
                                <Image source={IMAGE.extra_holder} style={{ width: scaleSize(22), height: scaleSize(20) }} />
                            </View> :
                                <Image source={IMAGE.productBasket} style={{ width: scaleSize(22), height: scaleSize(20) }} />
                    }
                </View>
                {/* -------- Avatar ------- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#fff', fontSize: scaleSize(13), }} >
                            {
                                item.type === 'Service' ? (item.staff && item.staff.displayName ? item.staff.displayName : '') : data.name
                            }
                        </Text>
                    </View>

                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#fff', fontSize: scaleSize(13), }} >
                            {item.type === 'Product' ? item.quanlitySet : item.data.name}
                        </Text>
                    </View>
                    {/* ------------ */}
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSize(10),
                    }} >
                        <Text style={{ color: '#fff', fontSize: scaleSize(14), }} >
                            {`$ ${item.type === 'Product' ? getTotalProductByQuantity(data.price, item.quanlitySet) : formatMoney(data.price)}`}
                        </Text>
                    </View>
                </View>
            </Button>
        </Swipeout>
    );
}

export default ItemBasket;