import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native';
import * as Progress from 'react-native-progress';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService } from '@components';
import styles from './style';
import IMAGE from '@resources';
import {TabFirstSettle,TabSecondSettle } from './widget';

const { width } = Dimensions.get('window');

class Layout extends React.Component {

    render() {
        return (
            <View style={styles.container} >
               {/* <TabFirstSettle /> */}
               <TabSecondSettle />
            </View>
        );
    }

}
export default Layout;

