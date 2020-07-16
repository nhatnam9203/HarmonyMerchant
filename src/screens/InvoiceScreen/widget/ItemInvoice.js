import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSzie, formatWithMoment } from '@utils';
import IMAGE from '@resources';

class ItemInvoice extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    setStateFromParent = isSlect => {
        if (this._isMounted) {
            this.setState({
                isSelected: isSlect
            });
        };

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
            case 'complete':
                color = '#0035FF';
                break;
            default:
                color = '#C5C5C5';
        }
        return color;
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { invoice } = this.props;
        const { isSelected } = this.state
        return invoice.code !== nextProps.invoice.code || isSelected !== nextState.isSelected ||
            invoice.status !== nextProps.invoice.status || invoice.createdDate !== nextProps.createdDate;
    }

    render() {
        const { invoice, onPress } = this.props;
        const { user } = invoice;
        const tempDate = `${formatWithMoment(invoice.createdDate, 'MM/DD/YYYY')}` === `${formatWithMoment(new Date(), 'MM/DD/YYYY')}` ? 'Today' : formatWithMoment(invoice.createdDate, 'MM/DD/YYYY');
        const temptFirstName = user ? user.firstName : '';
        const temptLastName = user ? user.lastName : '';
        const colorStaus = this.getColorStatus(invoice.status);

        const temptBackground = this.state.isSelected ? { backgroundColor: 'rgb(225,246,254)' } : {}
        return (
            <Button onPress={() => onPress()} style={[{
                height: scaleSzie(62), paddingHorizontal: scaleSzie(10),
                borderBottomColor: '#C5C5C5', borderBottomWidth: 1,
                backgroundColor: '#FAFAFA',
                flexDirection: "row"
            }, temptBackground]} >
                {/* ----------- Col 1 --------- */}
                <View style={{ flex: 1.7 }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#404040' }} >
                            {`${temptFirstName} ${temptLastName}`}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginRight: scaleSzie(20) }} >
                            {`# ${invoice.code}`}
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colorStaus }} />
                        <Text style={{ fontSize: scaleSzie(14), color: colorStaus, marginLeft: scaleSzie(5) }} >
                            {invoice.status}
                        </Text>

                    </View>
                </View>
                {/* ----------- Col 2 --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {tempDate}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', fontWeight: "bold" }} >
                            {`${formatWithMoment(invoice.createdDate, 'hh:mm A')}`}
                        </Text>
                    </View>
                </View>
                {/* ----------- Col 3 --------- */}
                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'flex-end' }} >
                    <Text style={{ fontSize: scaleSzie(16), color: '#404040', fontWeight: "600" }} >
                        {`$ ${invoice.total}`}
                    </Text>
                </View>
            </Button>

        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}


export default ItemInvoice;

