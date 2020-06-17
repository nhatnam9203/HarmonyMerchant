import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import IMAGE from '@resources';

export default class ItemStaff extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        }
    }

    setStateFromParent = async (isSelected) => {
        await this.setState({
            isSelected
        })
    }

    render() {
        const { isSelected } = this.state;
        const { index, item, getInvoicesOfStaff } = this.props;
        const temptColorSelected = !isSelected ? {} : { backgroundColor: '#F1F1F1' };
        return (
            <Button onPress={() => getInvoicesOfStaff(item.staffId)} style={[{
                height: scaleSzie(40), borderBottomColor: '#C5C5C5', borderBottomWidth: 1,
                paddingHorizontal: scaleSzie(10), flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between'
            }, temptColorSelected]} >
                <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                    {`${index + 1}. ${item.name}`}
                </Text>
                <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
                    {`$ ${item.totalAmount}`}
                </Text>
            </Button>
        );
    }

}