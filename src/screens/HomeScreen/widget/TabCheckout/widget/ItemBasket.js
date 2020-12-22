import React from 'react';
import {
    View,
    Image
} from 'react-native';
import Swipeout from 'react-native-swipeout';

import { scaleSzie, getTotalProductByQuantity, formatMoney } from '@utils';
import { Text, Button } from '@components';
import ICON from '@resources';

const ItemBasket = ({ item, removeItemBasket, onPress, disabled = false, changeProduct }) => {
    const { data } = item;
    const swipeoutBtns = [
        {
            backgroundColor: '#6A6A6A',
            component: <Button onPress={() => removeItemBasket(item)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Image source={ICON.removeItemBasket} style={{ width: scaleSzie(24), height: scaleSzie(24) }} />
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
                minHeight: scaleSzie(35), backgroundColor: '#fff',
                borderBottomColor: '#DDDDDD', borderBottomWidth: 1,
            }} >
                <View style={{
                    height: scaleSzie(35),
                    flexDirection: 'row',
                }} >
                    {/* -------- Avatar ------- */}
                    <View style={{ width: scaleSzie(45), justifyContent: 'center', alignItems: 'center' }} >
                        {
                            item.type === 'Service' ? <View style={{ width: scaleSzie(30), height: scaleSzie(30), borderRadius: scaleSzie(20), overflow: 'hidden' }} >
                                {item.staff && item.staff.imageUrl ? <Image source={{ uri: item.staff.imageUrl }}
                                    style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                                /> : <Image source={ICON.staff_basket}
                                    style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                                    />}
                            </View> :
                                item.type === 'Extra' ? <View style={{
                                    width: scaleSzie(30), height: scaleSzie(30), borderRadius: scaleSzie(20), justifyContent: 'center',
                                    alignItems: 'center', overflow: 'hidden'
                                }} >
                                    <Image source={ICON.extra_holder} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />
                                </View> :
                                    (item.type === 'GiftCards' ? <Image source={ICON.giftcard}
                                    //   style={{ width: scaleSzie(22), height: scaleSzie(20) }} 
                                    /> : <Image source={ICON.blue_productBasket} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />)
                        }
                    </View>
                    {/* -------- Name ------- */}
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        {/* ------------ */}
                        <View style={{ flex: 1, justifyContent: 'center' }} >
                            <Text style={{ color: '#0764B0', fontSize: scaleSzie(13), fontWeight: "500" }} numberOfLines={1} >
                                {
                                    item.type === 'Service' ? (item.staff && item.staff.displayName ? item.staff.displayName : 'Any staff') : data.name
                                }
                            </Text>
                        </View>

                        {/* ------------ */}
                        <View style={{
                            flex: 1, justifyContent: 'center',
                            // alignItems: 'center' 
                        }} >

                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), fontWeight: "500" }} >
                                {item.type === 'Product' || item.type === "GiftCards" ? item.quanlitySet : item.data.name}
                            </Text>
                        </View>
                        {/* ------------ */}
                        <View style={{
                            flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10),
                        }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14), fontWeight: "500" }} >
                                {`$ ${item.type === 'Product' ? getTotalProductByQuantity(data.price, item.quanlitySet) : formatMoney(data.price)}`}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ------------------ Extra ----------------- */}
                <View style={{ paddingLeft: scaleSzie(45), flexDirection: "row" }} >
                    <Image
                        source={ICON.delete_extra_mini}
                    />
                    <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(12), fontWeight: "300" }} numberOfLines={1} >
                        {'Extra'}
                    </Text>
                </View>

            </Button>
        </Swipeout>
    );
}



export default ItemBasket;