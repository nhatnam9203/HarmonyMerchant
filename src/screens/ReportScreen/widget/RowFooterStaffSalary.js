import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSzie } from '@utils';
import IMAGE from '@resources';

class RowFooterStaffSalary extends React.Component {

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
       
        return (
            <View style={styles.tableHeader} >
                {/* ----- 0 ------ */}
                <View style={{
                    width: scaleSzie(40), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        {/* <Text style={styles.textTableHeader} >
                       1.
                        </Text> */}
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>
                {/* ----- 1 ------ */}
                <View style={{
                    flex:1, flexDirection: 'row'
                }} >
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(10) }} >
                        <Text style={[styles.textTableHeader,{fontWeight:'bold'}]} numberOfLines={1} >
                        Total
                        </Text>
                    </View>
                    {/* <Button onPress={this.sortStaffName} style={{ width: scaleSzie(30), alignItems: 'center', justifyContent: 'center' }} >
                        <Image source={iconSortStaffName} style={styles.iconSort} />
                    </Button> */}
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ------ */}
                <View style={{
                    width: scaleSzie(110), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                        51
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
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                        $ 50
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
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                        $ 50
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                 {/* ----- 5 ------ */}
                 <View style={{
                    width: scaleSzie(110), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                        $ 200
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                 {/* ----- 6 ------ */}
                 <View style={{
                    width: scaleSzie(110), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                        $ 4205
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
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
        height: scaleSzie(40),
        backgroundColor: '#E5E5E5',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSzie(13)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSort: {
        width: scaleSzie(8),
        height: scaleSzie(12)
    }

})

export default RowFooterStaffSalary;

