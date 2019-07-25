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
            <View style={{ height: scaleSzie(35), borderColor: '#C5C5C5', borderWidth: 1, flexDirection: 'row' ,
            backgroundColor:'#FAFAFA'
            }} >
                <View style={{ width: scaleSzie(45), justifyContent: 'center', alignItems: 'center' }} >
                    {
                        item.type === 'Service' ? <View style={{ width: scaleSzie(30), height: scaleSzie(30), backgroundColor: 'red', borderRadius: scaleSzie(20) }} ></View> :
                            item.type === 'Extra' ? <View style={{ width: scaleSzie(30), height: scaleSzie(30), backgroundColor: 'green', borderRadius: scaleSzie(20) }} ></View> :
                                <Image source={IMAGE.basketInvoice} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />
                    }
                </View>
                {/* ------------ Text ------------- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), }} >
                        {data.name}
                        </Text>
                    </View>

                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), }} >
                        {item.type === 'Product' ? item.quanlitySet : item.serviceName}
                        </Text>
                    </View>
                    {/* ------------ */}
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10),
                    }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14), }} >
                        {`$ ${data.price}`}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}


export default ItemBasket;

