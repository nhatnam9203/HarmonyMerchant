import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { scaleSize } from '@utils';
import IMAGE from '@resources';
import { InputForm, Button } from '@components';

class ItemCheckBoxInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    selectCheckbox = () => {
        this.props.selectCheckbox();
    }

    render() {
        const { title, placeholder, isSelectCheckBox, value, onChangeText, onFocus } = this.props;
        const temptIconCheckbox = isSelectCheckBox ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        return (
            <View style={{ height: scaleSize(55), flexDirection: 'row', marginTop: scaleSize(8) }} >
                <View style={{
                    justifyContent: 'flex-start', width: scaleSize(80), paddingRight: scaleSize(10),
                    alignItems: 'flex-end'
                }} >
                    <Button onPress={this.selectCheckbox} >
                        <Image source={temptIconCheckbox} style={{ width: scaleSize(20), height: scaleSize(20) }} />
                    </Button>
                </View>
                <View style={{
                    width: scaleSize(180),
                }} >
                    <InputForm
                        typeInputMask={'money'}
                        optionsInputMask={{
                            precision: 2,
                            separator: '.',
                            delimiter: ',',
                            unit: '',
                            suffixUnit: ''
                        }}
                        title={title}
                        subTitle=""
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value) => onChangeText(value)}
                        style={{ marginBottom: scaleSize(10) }}
                        isOnlyNumber={true}
                        editable={isSelectCheckBox}
                        keyboardType="numeric"
                        onFocus={() => onFocus && onFocus()}
                    />

                </View>
            </View>
        );
    }

}

export default ItemCheckBoxInput;