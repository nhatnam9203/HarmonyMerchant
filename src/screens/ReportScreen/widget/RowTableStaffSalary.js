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
import { FlatList, ScrollView } from 'react-native-gesture-handler';

class RowTableStaffSalary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sortUpStaffName: false,
            sortUpId: false,
            sortUpRole: false,
            sortUpStatus: false,
            enableScroll: false
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

        const { staff, index, dx } = this.props;

        return (

            <View style={styles.tableHeader} >
                {/* ----- 0 ------ */}
                <View style={{
                    width: scaleSzie(40), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`${index}.`}
                        </Text>
                    </View>
                </View>
                {/* ----- 1 ------ */}
                <View style={{
                    width: scaleSzie(120), flexDirection: 'row'
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {staff.name}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ------ */}
                <View style={{ flex: 1 }}>
                    <ScrollView
                        scrollEnabled={false}
                        contentContainerStyle={{ flex: 1 }}
                        // keyExtractor={(item, index) => index + ''}
                        horizontal
                    // showsHorizontalScrollIndicator={false}
                    // data={staff.salariesByDate}
                    // renderItem={({ item }) => {
                    //     return (
                    //         <View style={{
                    //             width: scaleSzie(100), flexDirection: 'row',
                    //         }} >
                    //             <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                    //                 <Text style={styles.textTableHeader} >
                    //                     {`$ ${item.salary}`}
                    //                 </Text>
                    //             </View>
                    //             <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                    //                 <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    //             </View>
                    //         </View>
                    //     )
                    // }}
                    >
                        {staff.salariesByDate.map((item, index) => {
             
                            return (
                                <View
                                    key={index}
                                    style={{
                                        width: scaleSzie(120), flexDirection: 'row',
                                    }} >
                                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                                        <Text style={styles.textTableHeader} >
                                            {`$ ${item.salary}`}
                                        </Text>
                                    </View>
                                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
                {/* ----- 4 ------ */}
                <View style={{
                    width: scaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${staff.split}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 5 ------ */}
                <View style={{
                    width: scaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${staff.tip}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>

                <View style={{
                    width: scaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${staff.product}`}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 6 ------ */}
                <View style={{
                    width: scaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {`$ ${staff.total}`}
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
        height: scaleSzie(35),
        backgroundColor: '#FAFAFA',
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

export default RowTableStaffSalary;

