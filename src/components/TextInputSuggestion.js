import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import Autocomplete from 'react-native-autocomplete-input';

import connectRedux from "../redux/ConnectRedux";
import { scaleSzie, removeAccent } from '@utils';


class TextInputSuggestion extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    onChangeText = (value) => {
        if (value.length === 0) {
            this.setState({
                data: []
            });
            this.props.onChangeText(value, 1);
            return;
        }
        const { stateCity } = this.props;
        const temptState = stateCity.map(state => state.name);
        let temptData = [];
        for (let i = 0; i < temptState.length; i++) {
            if (removeAccent(temptState[i].toLowerCase()).startsWith(removeAccent(value).toLowerCase())) {
                temptData.push(temptState[i]);
            }
        }
        this.setState({
            data: temptData
        })
        this.props.onChangeText(value, temptData.length !== 0 ? temptData.length : 1);
    }

    selectSuggestion(value) {
        this.setState({
            data: []
        })
        this.props.onChangeText(value, 1);
    }

    onFocus = () => {
        const { value } = this.props;
        this.onChangeText(value, 1);
        this.props.onFocus();
    }

    onBlur = () => {
        setTimeout(() => {
            this.setState({
                data: []
            });
            this.props.resetMarginState();
        }, 1000);

    }

    render() {
        const { value, onFocus, inputContainerStyle, editable } = this.props;
        const { data } = this.state;
        return (
            <Autocomplete
                data={data}
                defaultValue={value}
                onChangeText={this.onChangeText}
                renderItem={({ item, index }) => {
                    if (index < 200) {
                        return <TouchableOpacity style={{
                            height: scaleSzie(25), paddingHorizontal: scaleSzie(8),
                            justifyContent: "center",
                        }} onPress={() => this.selectSuggestion(item)}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    }
                    return null
                }}
                placeholder={"State"}
                containerStyle={{
                    flex: 1
                }}
                inputContainerStyle={{
                    paddingHorizontal: scaleSzie(8),
                    height: scaleSzie(30),
                    justifyContent: "center",
                    ...inputContainerStyle
                }}
                style={{ fontSize: scaleSzie(16) }}
                onFocus={onFocus && this.onFocus}
                onBlur={this.onBlur}
                keyExtractor={(item, index) => `${item}_${index}`}
                listStyle={{
                    // height: scaleSzie(50),
                }}
                editable={editable}
                listContainerStyle={{
                }}
            />

        );
    }
}

const mapStateToProps = state => {
    return {
        stateCity: state.dataLocal.stateCity
    };
};

export default connectRedux(mapStateToProps, TextInputSuggestion);
