import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    StyleSheet
} from 'react-native';

import { ScaleSzie, formatWithMoment } from '@utils';
import { Text, Button } from '@components';

class ItemSettle extends React.Component {

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

    setStateFromParent = async (isSelected) => {
        if (this._isMounted) {
            await this.setState({
                isSelected
            })
        }
    }

    render() {
        const { batchHistory, onPress } = this.props;
        const { isSelected } = this.state;
        const temptColorSelected = !isSelected ? {} : { backgroundColor: '#F1F1F1' };
        return (
            <Button onPress={() => onPress(batchHistory)} style={[{ height: ScaleSzie(58), borderBottomColor: '#C5C5C5', borderBottomWidth: 1 }, temptColorSelected]} >
                <View style={{ flex: 1, flexDirection: 'row',  }} >
                    <View style={{ flex: 0.7,justifyContent:"center" }} >
                        <Text style={[styles.textTitleLefConten, { marginLeft: ScaleSzie(12) }]} >
                            {`# ${batchHistory.settlementId}`}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent:"center"}} >
                        <Text style={styles.textTitleLefConten} >
                            {`${formatWithMoment(batchHistory.settlementDate, 'MM/DD/YYYY')}`}
                        </Text>
                        <View style={{ height: 2 }} />
                        <Text style={[styles.textTitleLefConten, { fontWeight: "600" }]} >
                            {`${formatWithMoment(batchHistory.settlementDate, 'hh:mm A')}`}
                        </Text>
                    </View>
                    <View style={{ flex: 0.8, justifyContent: "center" }} >
                        <Text style={[styles.textTitleLefConten, { fontWeight: "600" }]} >
                            {`$ ${batchHistory.total}`}
                        </Text>
                    </View>
                </View>
            </Button>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


}


const styles = StyleSheet.create({
    textTitleLefConten: {
        color: '#404040',
        fontSize: ScaleSzie(14)
    },
});

export default ItemSettle;