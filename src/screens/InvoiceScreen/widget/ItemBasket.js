import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';

class ItemBasket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { item } = this.props;
        const { data } = item;

        return (
            <View style={{
                height: scaleSize(35), borderColor: '#C5C5C5', borderWidth: 1, flexDirection: 'row',
                backgroundColor: '#FAFAFA'
            }} >
                <View style={{ width: scaleSize(45), justifyContent: 'center', alignItems: 'center' }} >
                    {
                        item.type === 'Service' ?
                            <View style={{ width: scaleSize(30), height: scaleSize(30), borderRadius: scaleSize(20), overflow: 'hidden' }} >
                                {item.staff && item.staff.imageUrl ? <Image source={{ uri: item.staff.imageUrl }}
                                    style={{ width: scaleSize(30), height: scaleSize(30) }}
                                /> : <View />}
                            </View>
                            :
                            item.type === 'Extra' ?
                                <View style={{
                                    width: scaleSize(30), height: scaleSize(30), borderRadius: scaleSize(20), justifyContent: 'center',
                                    alignItems: 'center', overflow: 'hidden'
                                }} >
                                    <Image source={IMAGE.extra_holder} style={{ width: scaleSize(22), height: scaleSize(20) }} />
                                </View>
                                : ( item.type === 'GiftCards' ? <Image source={IMAGE.giftcard}
                                   style={{ width: scaleSize(22), height: scaleSize(20) }}
                                /> :
                                <Image source={IMAGE.basketInvoice} style={{ width: scaleSize(22), height: scaleSize(20) }} />)
                    }
                </View>
                {/* ------------ Text ------------- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSize(13) }} numberOfLines={1} >
                            {
                                item.type === 'Service' ? (item.staff && item.staff.displayName ? item.staff.displayName : '') : data.name
                            }
                        </Text>
                    </View>

                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSize(13), }} numberOfLines={1} >
                            {item.type === 'Product' ||  item.type ==="GiftCards" ? item.quanlitySet : item.data.name}
                        </Text>
                    </View>
                    {/* ------------ */}
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSize(10),
                    }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSize(14), }} numberOfLines={1} >
                            {`$ ${data.price}`}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}


export default ItemBasket;

