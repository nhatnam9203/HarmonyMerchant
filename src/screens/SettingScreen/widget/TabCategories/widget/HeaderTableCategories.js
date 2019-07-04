import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { scaleSzie } from '@utils';

class HeaderTableCategories extends React.Component {

    render() {
        return (
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
                        width: scaleSzie(180), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                            <Text style={styles.textTableHeader} >
                             Name
                            </Text>
                        </View>
                    </View>
                    {/* ----- 3 ------ */}
                    <View style={{
                        width: scaleSzie(230), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center',paddingLeft: scaleSzie(10)   }} >
                            <Text style={styles.textTableHeader} >
                            Type
                            </Text>
                        </View>
                    </View>
                    {/* ----- 4 ----- */}
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
        height: scaleSzie(35),
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C5C5C5',
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
    iconSort:{
         width: scaleSzie(8),
          height: scaleSzie(12) 
        }

})

export default HeaderTableCategories;

