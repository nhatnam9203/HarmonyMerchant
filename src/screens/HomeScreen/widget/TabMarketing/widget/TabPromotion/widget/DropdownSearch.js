import React from "react";
import { TouchableOpacity, Text, View ,Platform} from "react-native";
// import Autocomplete from 'react-native-autocomplete-input';

import connectRedux from "@redux/ConnectRedux";
import { scaleSzie, removeAccent, checkIsTablet } from '@utils';
import {DropdownSearchable} from "@components";

class DropdownSearch extends React.PureComponent {

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
        // const { stateCity } = this.props;
        // const temptState = stateCity.map(state => state.name);
        const temptState = this.props.dataServiceProduct;
        // console.log(JSON.stringify(temptState));

        let temptData = [];
        for (let i = 0; i < temptState.length; i++) {
            if (removeAccent(temptState[i]?.value.toLowerCase()).startsWith(removeAccent(value).toLowerCase())) {
                temptData.push(temptState[i]);
            }
        }
        this.setState({
            data: temptData
        })
        this.props.onChangeText(value, temptData.length !== 0 ? (temptData.length > 4 ? 5 :temptData.length ) : 1);
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
        // setTimeout(() => {
        //     this.setState({
        //         data: []
        //     });

        //     this.props.resetMarginState && this.props.resetMarginState();
        // }, 800);

    }

    render() {
        const { value, onFocus, inputContainerStyle, editable } = this.props;
        const { data } = this.state;
        const temp_list_style = checkIsTablet() ? { zIndex: 1, position: 'absolute', left: -10, width: "100%" } : {};

        return (
            <DropdownSearchable
                data={data}
                defaultValue={value}
                onChangeText={this.onChangeText}
                renderItem={({ item, index }) => <TouchableOpacity style={{
                    height: scaleSzie(25),
                    paddingHorizontal: scaleSzie(8),
                    justifyContent: "center",
                }} onPress={() => this.selectSuggestion(item)}>
                    <Text>{item?.value}</Text>
                </TouchableOpacity>}
                placeholder={"State"}
                containerStyle={{
                    flex: 1,
                    // color:"#000"
                }}
                inputContainerStyle={{
                    paddingHorizontal: scaleSzie(8),
                    height: "100%",
                    justifyContent: "center",
                    ...inputContainerStyle
                }}
                style={{ flex: 1, fontSize: scaleSzie(16), padding: 0,color:"#000" }}
                onFocus={onFocus && this.onFocus}
                keyExtractor={(item, index) => `${item}_${index}`}
                listStyle={temp_list_style}
                editable={editable}
                listContainerStyle={{
                    maxHeight:scaleSzie(100),
                    position:"absolute",
                    top:scaleSzie(30),
                    left:0,
                    right:0,
                    backgroundColor:"#fff",
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

// const mapStateToProps = state => {
//     return {
//         stateCity: state.dataLocal.stateCity
//     };
// };

export default DropdownSearch;
