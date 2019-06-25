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
import { TableHeader, RowTable, RowEmptyTable } from './widget';


class Layout extends React.Component {

    renderTable() {
        const { listStaffByMerchant } = this.props;
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
                        data={listStaffByMerchant}
                        renderItem={({ item, index }) => <RowTable
                            ref={this.setRefStaff}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            staff={item}
                            archiveStaff={() => this.togglePopupArchive(true, item)}
                            restoreStaff={() => this.togglePopupRestore(true, item)}
                            editStaff={() => this.editStaff(item)}
                        />}
                        keyExtractor={(item, index) => `${item.staffId}`}
                        ListEmptyComponent={<RowEmptyTable />}
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
        const { visibleArchive, visibleRestore, infoStaffHandle,
            isEditStaff
        } = this.state;
        const { isAddStaff, language } = this.props;
        return (
            <View style={styles.container} >
                {isAddStaff ? <StaffInfo
                    language={language}
                    backTabelStaff={() => {
                        this.props.actions.staff.switchAddStaff(false);
                        this.setState({
                            isEditStaff: false
                        })
                    }}
                    nextTab={() => this.props.nextTab()}
                    infoStaffHandle={infoStaffHandle}
                    isEditStaff={isEditStaff}
                    addStaff={this.submitAddStaff}
                    editStaff={this.submitEditStaff}
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
