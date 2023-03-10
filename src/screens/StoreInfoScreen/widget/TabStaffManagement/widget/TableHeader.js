import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import {  Button } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';

class TableHeader extends React.Component {

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

    sortStatus =() =>{
        this.setState(prevState => ({
            sortUpStatus: !prevState.sortUpStatus
        }))
    }

    render() {
        const { sortUpStaffName, sortUpId, sortUpRole, sortUpStatus } = this.state;
        const iconSortStaffName = sortUpStaffName ? IMAGE.sortUp : IMAGE.sortDown;
        const iconSortId = sortUpId ? IMAGE.sortUp : IMAGE.sortDown;
        const iconSortRole = sortUpRole ? IMAGE.sortUp : IMAGE.sortDown;
        const iconSortStatus = sortUpStatus ? IMAGE.sortUp : IMAGE.sortDown;
        return (
                <View style={styles.tableHeader} >
                    {/* ----- 1 ------ */}
                    <View style={[{
                        width: scaleSize(60),
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >
                            No.
                        </Text>
                    </View>
                    {/* ----- 2 ------ */}
                    <View style={{
                        width: scaleSize(200), flexDirection: 'row',
                    }} >
                        <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                            <Text style={styles.textTableHeader} >
                                Staff Name
                            </Text>
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                    </View>
                    {/* ----- 3 ------ */}
                    <View style={{
                        width: scaleSize(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                            <Text style={styles.textTableHeader} >
                                ID
                            </Text>
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                    </View>
                    {/* ----- 4 ------ */}
                    <View style={{
                        width: scaleSize(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                            <Text style={styles.textTableHeader} >
                                Role
                            </Text>
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                    </View>
                    {/* ----- 5 ----- */}
                    <View style={{
                        width: scaleSize(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                            <Text style={styles.textTableHeader} >
                                Status
                            </Text>
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                    </View>
                    {/* ----- 6 ------ */}
                    <View style={[{
                        flex: 1,
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >
                            Actions
                        </Text>
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
        color: '#0764B0',
        fontSize: scaleSize(16)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSort:{
         width: scaleSize(8),
          height: scaleSize(12)
        }

})

export default TableHeader;

