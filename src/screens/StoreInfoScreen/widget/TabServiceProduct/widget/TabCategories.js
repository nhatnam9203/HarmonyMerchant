import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';
import TableHeaderCategories from './TableHeaderCategories';
import RowTableCategories from './RowTableCategories';
import IMAGE from '../../../../../resources';

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


class TabCategories extends React.Component {

    constructor(props) {
        super(props);
    }


    renderTable() {
        return (
            <View style={{ flex: 1 }} >
                <TableHeaderCategories />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={FakeData}
                        renderItem={({ item, index }) => <RowTableCategories
                            // ref={this.setRefStaff}
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
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderTable()}
                <FooterTab />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: scaleSzie(12)
    },
})

export default TabCategories;

