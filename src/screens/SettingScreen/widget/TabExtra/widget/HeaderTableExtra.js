import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import {  Button } from '@components';
import { scaleSize ,localize} from '@utils';
import IMAGE from '@resources';

class HeaderTableExtra extends React.Component {

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
        const {language} = this.props
        return (
                <View style={styles.tableHeader} >
                    {/* ----- 1 ------ */}
                    <View style={[{
                        width: scaleSize(50),
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >
                            {`${localize('No',language)}.`}
                        </Text>
                    </View>
                    {/* ----- 2 ------ */}
                    <View style={{
                        width: scaleSize(160), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                            <Text style={styles.textTableHeader} >
                            {localize('Name',language)}
                            </Text>
                        </View>
                    </View>
                    {/* ----- 3 ------ */}
                    <View style={{
                        width: scaleSize(140), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center',paddingLeft: scaleSize(10)   }} >
                            <Text style={styles.textTableHeader} >
                            {`${localize('Price',language)} ($)`}
                            </Text>
                        </View>
                    </View>
                    {/* ----- 4 ----- */}
                    <View style={{
                        width: scaleSize(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                            <Text style={styles.textTableHeader} >

                                {localize('Status',language)}
                            </Text>
                        </View>
                    </View>
                    {/* ----- 5 ------ */}
                    <View style={[{
                        flex: 1,
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >

                            {localize('Actions',language)}
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
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C5C5C5',
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

export default HeaderTableExtra;

