import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { InputAuth, ButtonCustom, Button, DefaultTabBar } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';
import IMAGE from '../../../../../resources';

class TableHeader extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.tableHeader} >
                    {/* ----- 1 ------ */}
                    <View style={[{
                        width: scaleSzie(50),
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >
                            No.
                        </Text>
                    </View>
                    {/* ----- 2 ------ */}
                    <View style={{
                        width: scaleSzie(200), flexDirection: 'row',
                    }} >
                        <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                            <Text style={styles.textTableHeader} >
                                Staff Name
                            </Text>
                        </View>
                        <View style={{ width: scaleSzie(30), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={IMAGE.sortDown} style={{ width: scaleSzie(10), height: scaleSzie(16) }} />
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                    </View>
                    {/* ----- 3 ------ */}
                    <View style={{
                        width: scaleSzie(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                            <Text style={styles.textTableHeader} >
                                ID
                            </Text>
                        </View>
                        <View style={{ width: scaleSzie(30), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={IMAGE.sortDown} style={{ width: scaleSzie(10), height: scaleSzie(16) }} />
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                    </View>
                    {/* ----- 4 ------ */}
                    <View style={{
                        width: scaleSzie(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                            <Text style={styles.textTableHeader} >
                                Role
                            </Text>
                        </View>
                        <View style={{ width: scaleSzie(30), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={IMAGE.sortDown} style={{ width: scaleSzie(10), height: scaleSzie(16) }} />
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View>
                    </View>
                    {/* ----- 5 ----- */}
                    <View style={{
                        width: scaleSzie(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                            <Text style={styles.textTableHeader} >
                                Status
                            </Text>
                        </View>
                        <View style={{ width: scaleSzie(30), alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={IMAGE.sortDown} style={{ width: scaleSzie(10), height: scaleSzie(16) }} />
                        </View>
                        <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
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
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSzie(35),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#0764B0',
        fontSize: scaleSzie(16)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },

})

export default TableHeader;

