import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import {  Button } from '@components';
import { ScaleSzie ,localize} from '@utils';
import IMAGE from '@resources';

class HeaderTableService extends React.Component {

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
        const{language} = this.props;
        const { sortUpStaffName, sortUpId, sortUpRole, sortUpStatus } = this.state;

        return (
                <View style={styles.tableHeader} >
                    {/* ----- 1 ------ */}
                    <View style={[{
                        width: ScaleSzie(50),
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >
                            {`${localize('No', language)}.`}
                        </Text>
                    </View>
                    {/* ----- 2 ------ */}
                    <View style={{
                        width: ScaleSzie(160), flexDirection: 'row',
                    }} >
                        {/* <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View> */}
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(5) }} >
                            <Text style={styles.textTableHeader} >
                            
                            {localize('Service Name', language)}
                            </Text>
                        </View>
                        {/* <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View> */}
                    </View>
                    {/* ----- 3 ------ */}
                    <View style={{
                        width: ScaleSzie(140), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center',paddingLeft: ScaleSzie(10)   }} >
                            <Text style={styles.textTableHeader} >
                            
                            {localize('Categories', language)}
                            </Text>
                        </View>
                        {/* <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View> */}
                    </View>
                    {/* ----- 4 ----- */}
                    <View style={{
                        width: ScaleSzie(110), flexDirection: 'row',
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: ScaleSzie(10) }} >
                            <Text style={styles.textTableHeader} >
                                
                                {localize('Status', language)}
                            </Text>
                        </View>
                        {/* <View style={{ width: 1, paddingVertical: ScaleSzie(3) }} >
                            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                        </View> */}
                    </View>
                    {/* ----- 5 ------ */}
                    <View style={[{
                        flex: 1,
                    }, styles.itemTableHeaderContainer]} >
                        <Text style={styles.textTableHeader} >
                            
                            {localize('Actions', language)}
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
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C5C5C5',
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
    iconSort:{
         width: ScaleSzie(8),
          height: ScaleSzie(12) 
        }

})

export default HeaderTableService;

