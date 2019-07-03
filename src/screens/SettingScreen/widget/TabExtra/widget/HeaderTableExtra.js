import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import {  Button } from '@components';
import { scaleSzie ,localize} from '@utils';
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
                        width: scaleSzie(50),
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >
                            {localize('No.',language)}
                        </Text>
                    </View>
                    {/* ----- 2 ------ */}
                    <View style={{
                        width: scaleSzie(160), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                            <Text style={styles.textTableHeader} >
                            {localize('Name',language)}
                            </Text>
                        </View>
                    </View>
                    {/* ----- 3 ------ */}
                    <View style={{
                        width: scaleSzie(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center',paddingLeft: scaleSzie(10)   }} >
                            <Text style={styles.textTableHeader} >
                            {`${localize('Price',language)} $`}
                            </Text>
                        </View>
                    </View>
                    {/* ----- 4 ----- */}
                    <View style={{
                        width: scaleSzie(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                            <Text style={styles.textTableHeader} >
                                Status
                            </Text>
                        </View>
                    </View>
                    {/* ----- 5 ------ */}
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

export default HeaderTableExtra;

