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
import { FlatList } from 'react-native-gesture-handler';

class RowEmptyTableStaffSalary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sortUpStaffName: false,
            sortUpId: false,
            sortUpRole: false,
            sortUpStatus: false
        }
    }

    sortStaffName = () => {
        this.setState(prevState => ({
            sortUpStaffName: !prevState.sortUpStaffName
        }))
    }

    sortId = () => {
        this.setState(prevState => ({
            sortUpId: !prevState.sortUpId
        }))
    }

    sortRole = () => {
        this.setState(prevState => ({
            sortUpRole: !prevState.sortUpRole
        }))
    }

    sortStatus = () => {
        this.setState(prevState => ({
            sortUpStatus: !prevState.sortUpStatus
        }))
    }

    render() {
        const { sortUpStaffName, sortUpId, sortUpRole, sortUpStatus } = this.state;
        const iconSortStaffName = sortUpStaffName ? IMAGE.sortUp : IMAGE.sortDown;
        const { calendar } = this.props;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 0 ------ */}
                <View style={{
                    width: scaleSize(40), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                        </Text>
                    </View>
                </View>
                {/* ----- 1 ------ */}
                <View style={{
                    flexDirection: 'row', width: scaleSize(120)
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ------ */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={calendar}
                        keyExtractor={(item, index) => index + ''}
                        renderItem={({ item }) => <View style={{
                            width: scaleSize(120), flexDirection: 'row',
                        }} >
                            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                                <Text style={styles.textTableHeader} >
                                </Text>
                            </View>
                            <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                                <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                            </View>
                        </View>
                        }
                    />
                </View>
                {/* ----- 4 ------ */}
                <View style={{
                    width: scaleSize(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 5 ------ */}
                <View style={{
                    width: scaleSize(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 6 ------ */}
                <View style={{
                    width: scaleSize(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSize(35),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSize(13)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSort: {
        width: scaleSize(8),
        height: scaleSize(12)
    }

})

export default RowEmptyTableStaffSalary;

