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

class ItemInvoice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {invoice} = this.props;
        return (
            <View style={{
                height: scaleSzie(62), paddingHorizontal: scaleSzie(10),
                borderBottomColor: '#C5C5C5', borderBottomWidth: 1,
            }} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#404040' }} >
                            Deandre Wallace
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            Today
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(80), justifyContent: 'center', alignItems: 'flex-end' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            4:39 pm
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginRight: scaleSzie(20) }} >
                            #1500
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'red' }} />
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginLeft: scaleSzie(5) }} >
                          {invoice.status}
                        </Text>

                    </View>
                    <View style={{}} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                            $ 200
                        </Text>
                    </View>
                </View>

            </View>

        );
    }
}


export default ItemInvoice;

