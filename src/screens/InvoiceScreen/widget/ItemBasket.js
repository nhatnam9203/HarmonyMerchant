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
        const { title, value } = this.props;
        return (
            <View style={{ height: scaleSzie(35), borderColor: '#C5C5C5', borderWidth: 1, flexDirection: 'row' ,
            backgroundColor:'#FAFAFA'
            }} >
                <View style={{ width: scaleSzie(45), justifyContent: 'center', alignItems: 'center' }} >
                    <Image source={IMAGE.basketInvoice} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />
                </View>
                {/* ------------ Text ------------- */}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), }} >
                        Product 1
                        </Text>
                    </View>

                    {/* ------------ */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(13), }} >
                            {/* {item.type === 'Product' ? item.quanlitySet : item.serviceName} */}
                            5
                        </Text>
                    </View>
                    {/* ------------ */}
                    <View style={{
                        flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10),
                    }} >
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14), }} >
                        $ 20
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}


export default ItemBasket;

