import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { scaleSzie } from '@utils';
import IMAGE from '@resources';

class RowTable extends React.Component {

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
                <View style={[{
                    width: scaleSzie(60),
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }]} >
                    <Image source={IMAGE.indicate}
                        style={{ width: scaleSzie(12), height: scaleSzie(29) }}
                    />
                    <Text style={styles.textTableHeader} >
                        {/* {`${index}.`} */}
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
                            {/* {staff.name} */}
                        </Text>
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
                            {/* {staff.id} */}
                        </Text>
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
                            {/* {staff.role} */}
                        </Text>
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
                            {/* {staff.status} */}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 6 ------ */}
                <View style={{
                    flex: 1,
                    flexDirection: 'row'
                }} >
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
        height: scaleSzie(60),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#C5C5C5',
        fontSize: scaleSzie(14)
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

export default RowTable;

