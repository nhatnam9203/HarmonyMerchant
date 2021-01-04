import React from 'react';
import {
    View,
    Image
} from 'react-native';
import Swipeout from 'react-native-swipeout';

import { scaleSzie, getTotalProductByQuantity, formatMoney } from '@utils';
import { Text, Button } from '@components';
import ICON from '@resources';

const ItemBasket = ({ item, removeItemBasket, onPress, disabled = false, changeProduct, removeExtra }) => {
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
                            item.type === 'Service' ? <View style={{ width: scaleSzie(30), height: scaleSzie(30),
                            //  borderRadius: scaleSzie(20), overflow: 'hidden' 
                             }} >
                                {item.staff && item.staff.imageUrl ? <Image source={{ uri: item.imageUrl }}
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
                                    // item.type === 'Service' ? (item.staff && item.staff.displayName ? item.staff.displayName : 'Any staff') : data.name
                                    item.type === 'Service' ? (item?.data?.name || "") : data?.name || ""
                                    // item?.data?.name || ""
                                }
                            </Text>
                        </View>

                        {/* ------------ */}
                        <View style={{
                            flex: 1, justifyContent: 'center',
                            // alignItems: 'center' 
                        }} >

                            <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), fontWeight: "500" }} >
                                {item.type === 'Product' || item.type === "GiftCards" ? item?.quanlitySet || 1 : item?.staff?.displayName || 'Any staff'}
                            </Text>
                        </View>
                        {/* -------- Price ------- */}
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
                {
                    item.type === "Service" && item.extras ?
                        item.extras.map((extra) => <View key={extra?.id} style={{ alignItems: "center", paddingLeft: scaleSzie(45), paddingRight: scaleSzie(10), flexDirection: "row", marginBottom: scaleSzie(8) }} >
                            <Image
                                source={ICON.extra_mini}
                                style={{ height: scaleSzie(15), width: scaleSzie(15) }}
                            />
                            <Text style={{
                                color: '#6A6A6A', fontSize: scaleSzie(12), fontWeight: "500",
                                marginHorizontal: scaleSzie(6)
                            }} numberOfLines={1} >
                                {`${extra?.data?.name}`}
                            </Text>

                            <Button onPress={() => removeExtra(extra)}>
                                <Image
                                    source={ICON.delete_extra_mini}
                                    style={{ height: scaleSzie(15), width: scaleSzie(15) }}
                                />
                            </Button>

                            {/* --------------- Price ------------------ */}
                            <Text style={{
                                flex: 1, textAlign: "right", color: '#6A6A6A', fontSize: scaleSzie(12), fontWeight: "600",
                            }} numberOfLines={1} >
                                {`$ ${extra?.data?.price}`}
                            </Text>
                        </View>)
                        :
                        null
                }



            </Button>
        </Swipeout>
    );
}



export default ItemBasket;