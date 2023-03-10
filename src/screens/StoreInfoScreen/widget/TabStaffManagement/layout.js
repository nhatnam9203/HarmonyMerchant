import React from 'react';
import {
    View,
    FlatList
} from 'react-native';

import { FooterTab, PopupConfirm, Text } from '@components';
import { scaleSize, localize } from '@utils';
import styles from './style';
import StaffInfo from '../StaffInfo';
import { TableHeader, RowTable, RowEmptyTable } from './widget';


class Layout extends React.Component {

    renderTable() {
        const { listStaffByMerchant, refreshListStaffs, language } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    height: scaleSize(55), justifyContent: 'flex-end', paddingLeft: scaleSize(15),
                    paddingBottom: scaleSize(8)
                }} >
                    <Text style={{ color: '#0764B0', fontSize: scaleSize(18) }} >
                        {localize('Staff List', language)}
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
                        onRefresh={() => this.props.actions.staff.getStaffByMerchantId("", "", "",false ,false)}
                        refreshing={refreshListStaffs}
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
        const { isAddStaff, language, stateCity, profile } = this.props;
        const { visibleArchive, visibleRestore, infoStaffHandle,
            isEditStaff
        } = this.state;

        return (
            <View style={styles.container} >
                {isAddStaff ? <StaffInfo
                    profile={profile}
                    stateCity={stateCity}
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
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Archive this Staff', language)}?`}
                    onRequestClose={() => this.togglePopupArchive(false)}
                    confimYes={() => this.archirveStaffYess()}
                />
                <PopupConfirm
                    visible={visibleRestore}
                    title={localize('Confirmation', language)}
                    message={`${localize('Do you want to Restore this Staff', language)}?`}
                    onRequestClose={() => this.togglePopupRestore(false)}
                    confimYes={() => this.restoreStaffYess()}
                />
            </View>

        );
    }
}

export default Layout;
