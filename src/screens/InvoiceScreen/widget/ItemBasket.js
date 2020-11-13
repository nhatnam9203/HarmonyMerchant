import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSzie } from '@utils';
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
                height: scaleSzie(35), borderColor: '#C5C5C5', borderWidth: 1, flexDirection: 'row',
                backgroundColor: '#FAFAFA'
            }} >
                <View style={{ width: scaleSzie(45), justifyContent: 'center', alignItems: 'center' }} >
                    {
                        item.type === 'Service' ?
                            <View style={{ width: scaleSzie(30), height: scaleSzie(30), borderRadius: scaleSzie(20), overflow: 'hidden' }} >
                                {item.staff && item.staff.imageUrl ? <Image source={{ uri: item.staff.imageUrl }}
                                    style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                                /> : <View />}
                            </View>
                            :
                            item.type === 'Extra' ?
                                <View style={{
                                    width: scaleSzie(30), height: scaleSzie(30), borderRadius: scaleSzie(20), justifyContent: 'center',
                                    alignItems: 'center', overflow: 'hidden'
                                }} >
                                    <Image source={IMAGE.extra_holder} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />
                                </View>
                                : ( item.type === 'GiftCards' ? <Image source={IMAGE.giftcard} 
                                   style={{ width: scaleSzie(22), height: scaleSzie(20) }} 
                                /> :
                                <Image source={IMAGE.basketInvoice} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />)
                    }
                </View>
                {/* ------------ Text ------------- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13) }} numberOfLines={1} >
                            {
                                item.type === 'Service' ? (item.staff && item.staff.displayName ? item.staff.displayName : '') : data.name
                            }
                        </Text>
                    </View>

                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), }} numberOfLines={1} >
                            {/* {item.type === 'Product' ? item.quanlitySet : item.data.name} */}
                            {item.type === 'Product' ||  item.type ==="GiftCards" ? item.quanlitySet : item.data.name}
                        </Text>
                    </View>
                    {/* ------------ */}
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10),
                    }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14), }} numberOfLines={1} >
                            {`$ ${data.price}`}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}


export default ItemBasket;

