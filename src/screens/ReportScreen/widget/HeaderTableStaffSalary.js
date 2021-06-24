import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSzie, formatDateApi ,localize} from '@utils';
import IMAGE from '@resources';
import { FlatList } from 'react-native-gesture-handler';

class HeaderTableStaffSalary extends React.Component {

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
        const { calendar,language } = this.props;
        const { sortUpStaffName, sortUpId, sortUpRole, sortUpStatus } = this.state;
        const iconSortStaffName = sortUpStaffName ? IMAGE.sortUp : IMAGE.sortDown;
        

        return (
            <View style={styles.tableHeader} >
                {/* ----- 0 ------ */}
                <View style={{
                    width: scaleSzie(40), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                        
                            {`${localize('No', language)}.`}
                        </Text>
                    </View>
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                </View>
                {/* ----- 1 ------ */}
                <View style={{
                    width: scaleSzie(120), flexDirection: 'row'
                }} >
                    {/* <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View> */}
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            
                            {localize('Name', language)}
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
                <View style={{ flex: 1 }}>
                    <FlatList
                        keyExtractor={(item, index) => index + ''}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={calendar}
                        renderItem={({ item }) => {
                           
                            return (
                                <View style={{
                                    width: scaleSzie(120), flexDirection: 'row',
                                }} >
                                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                                        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <Text style={[styles.textTableHeader]} >
                                                {item.dateInWeek}
                                            </Text>
                                            <Text style={[styles.textTableHeader]} >
                                                {formatDateApi(item.date).month} {formatDateApi(item.date).day}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
                {/* ----- 4 ------ */}
                <View style={{
                    width: scaleSzie(120), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            
                            {localize('Split', language)}
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
                            
                            {localize('Tip', language)}
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
                            
                            {localize('Product', language)}
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
                            
                            {localize('Total', language)}
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
        color: '#0764B0',
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

export default HeaderTableStaffSalary;

