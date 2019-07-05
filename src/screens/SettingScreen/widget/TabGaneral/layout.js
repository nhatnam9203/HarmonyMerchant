import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
} from 'react-native';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import {
    Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService,
    PopupEditAddExtra
} from '@components';
import styles from './style';
import IMAGE from '@resources';
import { HeaderTableExtra, RowTableExtra, RowTableEmptyExtra } from './widget';

class Layout extends React.Component {

    render() {
        return (
            <View style={{ flex: 1 }} >
            </View>
        );
    }
}

export default Layout;

