import React from "react";
import { TouchableOpacity, Text } from "react-native";
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
            this.props.onChangeText(value);
            return;
        }

        if (value.length > 1) {
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
        }

        this.props.onChangeText(value);
    }

    selectSuggestion(value) {
        this.setState({
            data: []
        })
        this.props.onChangeText(value);
    }

    onFocus = () => {
        const { value } = this.props;
        this.onChangeText(value);
        this.props.onFocus();
    }

    onBlur = () => {
        setTimeout(() => {
            this.setState({
                data: []
            })
        }, 1000)
    }

    render() {
        const { value, onChangeText, onFocus } = this.props;
        const { data } = this.state;
        return (
            <Autocomplete
                data={data}
                defaultValue={value}
                onChangeText={this.onChangeText}
                renderItem={({ item, i }) => (
                    <TouchableOpacity style={{
                        height: scaleSzie(25), paddingHorizontal: scaleSzie(8),
                        justifyContent: "center"
                    }} onPress={() => this.selectSuggestion(item)}>
                        <Text>{item}</Text>
                    </TouchableOpacity>

                )}
                placeholder={"State"}
                containerStyle={{
                    flex: 1
                }}
                inputContainerStyle={{
                    paddingHorizontal: scaleSzie(8),
                    height: scaleSzie(30),
                    justifyContent: "center"
                }}
                style={{ fontSize: scaleSzie(16) }}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                keyExtractor={(item, index) => `${item}_${index}`}
                // listContainerStyle={{ height: scaleSzie(50) }}
                listStyle={{height: scaleSzie(50) }}
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
