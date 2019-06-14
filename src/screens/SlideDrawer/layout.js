import React from 'react';
import {
    View,
    Image
} from 'react-native';

import { Text ,Button} from '@components';
import { scaleSzie,localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

const dataDrawer = ['Home','Invoice','Settlement','Customer','Inventory','Report','Setting','Support'];

export default class Layout extends React.Component {

    render() {
        const {language} = this.props;
        return (
            <View style={styles.container} >
                {
                    dataDrawer.map((item,index) => <ItemDrawer 
                    key={index}
                    title={localize(item,language) }
                    icon={IMAGE[item]}
                    onPress={() => this.changeLanguage(item)}
                    />)
                }
            </View>

        );
    }
}

const ItemDrawer = ({title,icon,onPress}) => {
    return (
        <Button onPress={() => onPress()} style={{
            flexDirection: 'row', 
            alignItems: 'center',height:scaleSzie(40)
        }} >
            <Image source={icon}
                style={{
                    width: scaleSzie(22), height: scaleSzie(22),
                    marginRight: scaleSzie(23),marginLeft:scaleSzie(18)
                }}
            />
            <Text style={{ color: '#fff', fontSize: scaleSzie(17) }} >
                {title}
            </Text>
        </Button>
    );
}
