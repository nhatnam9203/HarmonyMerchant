import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

import { InputAuth, ButtonCustom, Button, Text } from '../../../../components';
import { scaleSzie } from '../../../../utils';
import styles from './style';
import StaffInfo from '../StaffInfo';
import{EmptyStaff ,TableHeader,RowTable,PopupArchive} from './widget';
import IMAGE from '../../../../resources';



const FakeData = [{
    id: 'HP000002',
    name: 'Pena Valdez',
    role: 'Staff',
    status: 'Active'
},
{
    id: 'HP000003',
    name: 'Jessica Miles',
    role: 'Staff',
    status: 'Active'
},
{
    id: 'HP000004',
    name: 'Pena Valdez',
    role: 'Staff',
    status: 'Active'
}, {
    id: 'HP000005',
    name: 'Jessica Miles',
    role: 'Staff',
    status: 'Active'
}]

class TabStaffManagement extends React.Component {

    renderTable() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    height: scaleSzie(55), justifyContent: 'flex-end', paddingLeft: scaleSzie(15),
                    paddingBottom: scaleSzie(8)
                }} >
                    <Text style={{ color: '#0764B0', fontSize: scaleSzie(18) }} >
                        Staff List
                    </Text>
                </View>
                <TableHeader />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={FakeData}
                        renderItem={({ item, index }) => <RowTable
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            staff={item}
                            archiveStaff={() => this.archiveStaff()}
                        />}
                        keyExtractor={(item, index) => item.id}
                    />
                </View>
                {this.renderButtonAdd()}
                {this.renderFooter()}
            </View>
        )
    }

    renderButtonAdd() {
        return (
            <View style={{
                height: scaleSzie(45),
                paddingHorizontal: scaleSzie(15), paddingVertical: scaleSzie(4)
            }} >
                <Button onPress={this.addNewStaff} style={{
                    flex: 1, backgroundColor: '#4CD964',
                    borderWidth: 1, borderColor: '#707070', borderRadius: scaleSzie(4),
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
                }} >
                    <Image source={IMAGE.addStaff} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                    <Text style={{
                        color: '#fff', fontSize: scaleSzie(18), fontWeight: 'bold',
                        marginLeft: scaleSzie(8)
                    }} >
                        ADD NEW
                </Text>
                </Button>
            </View>
        );
    }

    renderFooter() {
        return (
            <View style={styles.footer} >
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title="BACK"
                        textColor="#6A6A6A"
                        onPress={this.nextTab}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title="NEXT"
                        textColor="#fff"
                        onPress={this.nextTab}
                    />
                </View>
            </View>
        );
    }

    render() {
        const { isAddStaff } = this.state;
        return (
            <View style={styles.container} >
                {/* <EmptyStaff 
                addStaff={() =>alert('dd')}
                /> */}
                {/* <StaffInfo /> */}
                {isAddStaff ? <StaffInfo
                    backTabelStaff={() => this.setState({ isAddStaff: false })}
                /> : this.renderTable()}
                <PopupArchive />
            </View>

        );
    }
}

export default TabStaffManagement;
