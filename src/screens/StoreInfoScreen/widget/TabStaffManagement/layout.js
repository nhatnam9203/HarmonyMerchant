import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList
} from 'react-native';

import { FooterTab, PopupConfirm, Text } from '@components';
import { scaleSzie } from '@utils';
import styles from './style';
import StaffInfo from '../StaffInfo';
import { TableHeader, RowTable } from './widget';

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

class Layout extends React.Component {

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
                            ref={this.setRefStaff}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            staff={item}
                            archiveStaff={() => this.togglePopupArchive(true, item)}
                            restoreStaff={() => this.togglePopupRestore(true, item)}
                            editStaff={() => this.editStaff()}
                        />}
                        keyExtractor={(item, index) => item.id}
                    />
                </View>
                <FooterTab
                    backTab={() => this.props.backTab()}
                    nextTab={() => this.props.nextTab()}
                    addNew={this.addNewStaff}

                />
            </View>
        )
    }

    render() {
        const { isAddStaff, visibleArchive, visibleRestore } = this.state;
        return (
            <View style={styles.container} >
                {isAddStaff ? <StaffInfo
                    backTabelStaff={() => this.setState({ isAddStaff: false })}
                /> : this.renderTable()}
                <PopupConfirm
                    visible={visibleArchive}
                    title="Confirmation"
                    message="Do you want to Archive this Staff ?"
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveStaffYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title="Confirmation"
                    message="Do you want to Restore this Staff ?"
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
            </View>

        );
    }
}

export default Layout;
