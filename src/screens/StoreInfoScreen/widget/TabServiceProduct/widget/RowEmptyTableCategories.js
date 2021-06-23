import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { scaleSize } from '@utils';
import IMAGE from '@resources';

class RowEmptyTableCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isArchive: true
        }
    }

    handleArchirveStaff = () => {
        this.setState({
            isArchive: false
        })
    }

    handleRestoreStaff = () => {
        this.setState({
            isArchive: true
        })
    }

    render() {
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{
                    width: scaleSize(250), flexDirection: 'row',
                }} >
                    <View style={[{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: scaleSize(12)
                    }]} >
                        <Image source={IMAGE.indicate}
                            style={{ width: scaleSize(12), height: scaleSize(29), marginRight: scaleSize(12) }}
                        />
                    </View>
                </View>
                {/* ----- 2 ----- */}
                <View style={{
                    width: scaleSize(350), flexDirection:'row',
                }} >
                    <View style={{flex:1}} />
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ------ */}
                <View style={{
                    flex: 1,
                }} />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSize(60),
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#C5C5C5',
        fontSize: scaleSize(14)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default RowEmptyTableCategories;

