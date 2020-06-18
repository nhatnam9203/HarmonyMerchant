import React from 'react';
import {
    View,
    Image,

} from 'react-native';
import Swipeout from 'react-native-swipeout';

import { scaleSzie, localize, formatMoney } from '@utils';
import { Text, Button } from '@components';
import IMAGE from '@resources';

const ItemBasket = ({ item, removeItemBasket, onPress, disabled = false, changeProduct }) => {
    const { data } = item;
    console.log('item : '+ JSON.stringify(item));
    const swipeoutBtns = [
        {
            backgroundColor: '#6A6A6A',
            component: <Button onPress={() => removeItemBasket(item)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Image source={IMAGE.removeItemBasket} style={{ width: scaleSzie(24), height: scaleSzie(24) }} />
            </Button>,
        }
    ];
    return (
        <Swipeout
            right={swipeoutBtns}
            buttonWidth={scaleSzie(45)}
            disabled={disabled}
            close={true}
        >
            <Button onPress={() => {
                if (item.type === 'Service') {
                    onPress(item);
                } else if (item.type === 'Product') {
                    changeProduct(item)
                }
            }} style={{
                height: scaleSzie(35), backgroundColor: '#fff',
                borderBottomColor: '#DDDDDD', borderBottomWidth: 1,
                flexDirection: 'row'
            }} >
                {/* -------- Avatar ------- */}
                <View style={{ width: scaleSzie(45), justifyContent: 'center', alignItems: 'center' }} >
                    {
                        item.type === 'Service' ? <View style={{ width: scaleSzie(30), height: scaleSzie(30), borderRadius: scaleSzie(20), overflow: 'hidden' }} >
                            {item.staff && item.staff.imageUrl ? <Image source={{ uri: item.staff.imageUrl }}
                                style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                            /> : <Image source={IMAGE.staff_basket}
                                style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                                />}
                        </View> :
                            item.type === 'Extra' ? <View style={{
                                width: scaleSzie(30), height: scaleSzie(30), borderRadius: scaleSzie(20), justifyContent: 'center',
                                alignItems: 'center', overflow: 'hidden'
                            }} >
                                <Image source={IMAGE.extra_holder} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />
                            </View> :
                                (item.type === 'GiftCards' ? <Image source={IMAGE.giftcard}
                                //   style={{ width: scaleSzie(22), height: scaleSzie(20) }} 
                                /> : <Image source={IMAGE.blue_productBasket} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />)
                    }
                </View>
                {/* -------- Name ------- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), }} numberOfLines={1} >
                            {
                                item.type === 'Service' ? (item.staff && item.staff.displayName ? item.staff.displayName : 'Any staff') : data.name
                            }
                        </Text>
                    </View>

                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center', 
                    alignItems: 'center' 
                    }} >

                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), }} >
                            {item.type === 'Product' || item.type === "GiftCards" ? item.quanlitySet : item.data.name}
                        </Text>
                    </View>
                    {/* ------------ */}
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10),
                    }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), }} >
                            {`$ ${formatMoney(data.price)}`}
                        </Text>
                    </View>
                </View>
            </Button>
        </Swipeout>
    );
}

export default ItemBasket;