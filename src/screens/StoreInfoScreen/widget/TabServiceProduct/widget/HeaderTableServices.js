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

class HeaderTableServices extends React.Component {

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
        const iconSortRole = sortUpRole ? IMAGE.sortUp : IMAGE.sortDown;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{
                    width: scaleSize(230), flexDirection: 'row',
                }} >
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(20) }} >
                        <Text style={styles.textTableHeader} >
                            Service Name
                            </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ------ */}
                <View style={{
                    width: scaleSize(180), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            Categories
                            </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ------ */}
                <View style={{
                    width: scaleSize(180), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                        <Text style={styles.textTableHeader} >
                            Extra
                            </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 4 ------ */}
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
    iconSort: {
        width: scaleSize(8),
        height: scaleSize(12)
    }

})

export default HeaderTableServices;

