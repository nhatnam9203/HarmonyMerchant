import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { ScaleSzie } from '@utils';
import IMAGE from '@resources';

class HeaderTableCategories extends React.Component {

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
        const iconSortId = sortUpId ? IMAGE.sortUp : IMAGE.sortDown;
        const iconSortRole = sortUpRole ? IMAGE.sortUp : IMAGE.sortDown;
        const iconSortStatus = sortUpStatus ? IMAGE.sortUp : IMAGE.sortDown;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={{
                    width: ScaleSzie(300), flexDirection: 'row',
                }} >
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(20) }} >
                        <Text style={styles.textTableHeader} >
                            Category Name
                            </Text>
                    </View>
                    {/* <Button onPress={this.sortStaffName} style={{ width: ScaleSzie(30), alignItems: 'center', justifyContent: 'center' }} >
                        <Image source={iconSortStaffName} style={styles.iconSort} />
                    </Button> */}
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 2 ------ */}
                <View style={{
                    width: ScaleSzie(300), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            Type
                            </Text>
                    </View>
                    {/* <Button onPress={this.sortRole} style={{ width: ScaleSzie(30), alignItems: 'center', justifyContent: 'center' }} >
                        <Image source={iconSortRole} style={styles.iconSort} />
                    </Button> */}
                    <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ------ */}
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
        height: ScaleSzie(35),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#0764B0',
        fontSize: ScaleSzie(16)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSort: {
        width: ScaleSzie(8),
        height: ScaleSzie(12)
    }

})

export default HeaderTableCategories;

