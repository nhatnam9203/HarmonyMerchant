import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSize,WorkingTime } from '@utils';
import styles from '../style';
import { Text,Dropdown } from '@components';

class ItemDropdown extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const { title, width ,placeholder,value,onChangeText,dataDropdown} = this.props;
        const temptData = dataDropdown ? dataDropdown : WorkingTime;
        return(
            <View style={{ height: scaleSize(30), flexDirection: 'row', marginTop: scaleSize(8) }} >
            <View style={{
                justifyContent: 'center', width: scaleSize(80), paddingRight: scaleSize(10),
                alignItems: 'flex-end'
            }} >
                <Text style={styles.textNormal} >
                    {title}
                </Text>
            </View>

            <View style={{ width: scaleSize(180)}} >
                <View style={{ height: scaleSize(30), width: scaleSize(width) }} >
                    <Dropdown
                        label={placeholder}
                        data={temptData}
                        value={value}
                        onChangeText={(value) => onChangeText(value)}
                        containerStyle={{
                            backgroundColor: '#F1F1F1',
                            borderWidth: 1,
                            borderColor: '#C5C5C5',
                            flex: 1
                        }}
                    />
                </View>
            </View>
        </View>
        );
    }

}


export default ItemDropdown;