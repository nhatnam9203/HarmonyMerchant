import React from "react";
import { TouchableOpacity, Text, View, Platform } from "react-native";
// import Autocomplete from 'react-native-autocomplete-input';

import connectRedux from "@redux/ConnectRedux";
import { scaleSize, removeAccent, checkIsTablet } from '@utils';
import { DropdownSearchable } from "@components";

class DropdownSearch extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: ""
        }
    }

    onChangeText = async (value) => {
        await this.setState({
            value
        })
        if (value.length === 0) {
            this.setState({
                data: []
            });
            this.props.onChangeText(value, 1);
            return;
        }
        const temptState = this.props.dataServiceProduct;
        let temptData = [];
        for (let i = 0; i < temptState.length; i++) {
            if (removeAccent(temptState[i]?.value.toLowerCase()).startsWith(removeAccent(value).toLowerCase())) {
                temptData.push(temptState[i]);
            }
        }
        this.setState({
            data: temptData,
        })
        this.props.onChangeText(temptData.length !== 0 ? (temptData.length > 4 ? 5 : temptData.length + 1) : 1);
    }

    selectSuggestion = (value) => () => {
        this.setState({
            data: [],
            value: ""
        })
        this.props.selectedTag(value);
    }

    onFocus = () => {
        if (this.state.value === "") {
            const temptState = this.props.dataServiceProduct;
            this.setState({
                data: temptState,
            });
            this.props.onChangeText(temptState.length !== 0 ? (temptState.length > 4 ? 5 : temptState.length) : 1);
        }
        this.props.onFocus();
    }

    onBlur = () => {

    }

    render() {
        const { onFocus, inputContainerStyle, editable } = this.props;
        const { data, value } = this.state;
        const temp_list_style = checkIsTablet() ? { zIndex: 1, position: 'absolute', left: -10, width: "100%" } : {};

        return (
            <DropdownSearchable
                data={data}
                // defaultValue={value}
                value={value}
                onChangeText={this.onChangeText}
                renderItem={({ item, index }) => <TouchableOpacity style={{
                    height: scaleSize(25),
                    paddingHorizontal: scaleSize(8),
                    justifyContent: "center",
                }} onPress={this.selectSuggestion(item)}>
                    <Text>{item?.value}</Text>
                </TouchableOpacity>}
                placeholder={"Type to search"}
                containerStyle={{
                    flex: 1,
                    // color:"#000"
                }}
                inputContainerStyle={{
                    paddingHorizontal: scaleSize(8),
                    height: "100%",
                    justifyContent: "center",
                    ...inputContainerStyle
                }}
                style={{ flex: 1, fontSize: scaleSize(16), padding: 0, color: "#000" }}
                onFocus={onFocus && this.onFocus}
                keyExtractor={(item, index) => `${item}_${index}`}
                listStyle={temp_list_style}
                editable={editable}
                listContainerStyle={{
                    maxHeight:scaleSize(100),
                    position: "absolute",
                    top: scaleSize(30),
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    ...Platform.select({
                        ios: {
                            shadowRadius: 1,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowOpacity: 0.6,
                            shadowOffset: { width: 0, height: 0 },
                        },

                        android: {
                            elevation: 2,
                        },
                    })

                }}
            />

        );
    }
}

export default DropdownSearch;
