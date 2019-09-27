import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    StyleSheet
} from 'react-native';
import moment from 'moment';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, } from '@components';

class ItemSettle extends React.Component {

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
        const { batchHistory,onPress } = this.props;
        const { isSelected } = this.state;
        const temptColorSelected = !isSelected ? {} : { backgroundColor: '#F1F1F1' };
        return (
            <Button onPress={() => onPress(batchHistory)} style={[{ height: scaleSzie(58), borderBottomColor: '#C5C5C5', borderBottomWidth: 1 }, temptColorSelected]} >
                <View style={{ flex: 1, flexDirection: 'row', paddingTop: scaleSzie(8) }} >
                    <View style={{ flex: 0.7, }} >
                        <Text style={[styles.textTitleLefConten, { marginLeft: scaleSzie(12) }]} >
                            {`#${batchHistory.settlementId}`}
                        </Text>
                    </View>
                    <View style={{ flex: 1, }} >
                        <Text style={styles.textTitleLefConten} >
                            {`${moment.parseZone(batchHistory.settlementDate).local().format('MM/DD/YYYY')}`}
                        </Text>
                        <View style={{ height: 2 }} />
                        <Text style={styles.textTitleLefConten} >
                            {`${moment.parseZone(batchHistory.settlementDate).local().format('h:mm A')}`}
                        </Text>
                    </View>
                    <View style={{ flex: 0.8, }} >
                        <Text style={styles.textTitleLefConten} >
                            {`${batchHistory.total}$`}
                        </Text>
                    </View>
                </View>
            </Button>
        );
    }


}


const styles = StyleSheet.create({
    textTitleLefConten: {
        color: '#404040',
        fontSize: scaleSzie(14)
    },
});

export default ItemSettle;