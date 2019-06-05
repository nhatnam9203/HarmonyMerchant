import React from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { FooterTab } from '../../../../../components';
import { scaleSzie } from '../../../../../utils';
import HeaderTableCategories from './HeaderTableCategories';
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
        this.state = {
            visibleArchive: false,
            visibleRestore: false,
            serviceInfoHandle: {}
        }

        this.inputRefsService = [];
    }

    setRefService = (ref) => {
        if (ref != null) {
            this.inputRefsService.push(ref);
        }
    };

    async  togglePopupArchive(bool, service = {}) {
        if (bool === true) {
            await this.setState({
                serviceInfoHandle: service
            })
        }
        this.setState(prevState => ({
            visibleArchive: bool
        }))
    }

    renderTable() {
        return (
            <View style={{ flex: 1 }} >
                <HeaderTableCategories />
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={FakeData}
                        renderItem={({ item, index }) => <RowTableCategories
                            ref={this.setRefService}
                            key={index}
                            key={index} index={parseInt(index + 1)}
                            staff={item}
                            archiveService={() => this.togglePopupArchive(true, item)}
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

