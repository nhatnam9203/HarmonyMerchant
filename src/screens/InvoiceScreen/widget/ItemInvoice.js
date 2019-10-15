import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import moment from 'moment';

import { Button } from '@components';
import { scaleSzie } from '@utils';
import IMAGE from '@resources';

class ItemInvoice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        }
    }

    setStateFromParent = isSlect =>{
        this.setState({
            isSelected: isSlect
        })
    }
 
    getColorStatus(status) {
        let color = '';
        switch (status) {
            case 'paid':
                color = '#4CD964';
                break;
            case 'pending':
                color = '#0764B0';
                break;
            default:
                color = '#C5C5C5';
        }
        return color;
    }

    render() {
        const { invoice, onPress } = this.props;
        const { user } = invoice;
        const tempDate = `${moment.parseZone(invoice.createdDate).local().format('MM/DD/YYYY')}` === `${moment.parseZone().local().format('MM/DD/YYYY')}` ? 'Today' : moment.parseZone(invoice.createdDate).local().format('MM/DD/YYYY');
        const temptFirstName = user ? user.firstName : '';
        const temptLastName = user ? user.lastName : '';
        const colorStaus = this.getColorStatus(invoice.status);

        const temptBackground = this.state.isSelected ? { backgroundColor: 'rgb(225,246,254)' } : {}
        return (
            <Button onPress={() => onPress()} style={[{
                height: scaleSzie(62), paddingHorizontal: scaleSzie(10),
                borderBottomColor: '#C5C5C5', borderBottomWidth: 1,
                backgroundColor: '#FAFAFA'
            }, temptBackground]} >
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#404040' }} >
                            {`${temptFirstName} ${temptLastName}`}
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {tempDate}
                        </Text>
                    </View>
                    <View style={{ width: scaleSzie(80), justifyContent: 'center', alignItems: 'flex-end' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {`${moment.parseZone(invoice.createdDate).local().format('h:mm A')}`}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginRight: scaleSzie(20) }} >
                            {`# ${invoice.code}`}
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colorStaus }} />
                        <Text style={{ fontSize: scaleSzie(14), color: colorStaus, marginLeft: scaleSzie(5) }} >
                            {invoice.status}
                        </Text>

                    </View>
                    <View style={{}} >
                        <Text style={{ fontSize: scaleSzie(18), color: '#404040' }} >
                            {`$ ${invoice.total}`}
                        </Text>
                    </View>
                </View>
            </Button>

        );
    }
}


export default ItemInvoice;

