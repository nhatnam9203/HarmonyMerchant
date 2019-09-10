import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { scaleSzie,WorkingTime } from '@utils';
import styles from '../style';
import IMAGE from '@resources';
import { Button, Text,Dropdown } from '@components';

class ItemDropdown extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            value : this.props.value
        }

    }

    render(){
        const { title, width ,placeholder} = this.props;
        const {value } = this.state;
        return(
            <View style={{ height: scaleSzie(30), flexDirection: 'row', marginTop: scaleSzie(8) }} >
            <View style={{
                justifyContent: 'center', width: scaleSzie(70), paddingRight: scaleSzie(10),
                alignItems: 'flex-end'
            }} >
                <Text style={styles.textNormal} >
                    {title}
                </Text>
            </View>

            <View style={{ width: scaleSzie(180), }} >
                <View style={{ height: scaleSzie(30), width: scaleSzie(width) }} >
                    <Dropdown
                        label={placeholder}
                        data={WorkingTime}
                        value={value}
                        onChangeText={(value) => this.setState({value})}
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