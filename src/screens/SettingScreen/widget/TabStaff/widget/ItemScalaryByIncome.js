import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ICON from '@resources';
import { Button } from '@components';
import { scaleSzie } from '@utils';


export default class ItemScalary extends React.Component {

    constructor(props) {
        super(props);
        const { dataInit } = this.props;
        this.state = {
            isCheck: dataInit.isCheck,
            value: dataInit.value,
            rows: [1]
        }
    }

    setStateFromParent = async (isCheck = false, value = "0") => {
        await this.setState({
            isCheck,
            value
        })
    }

    onPress = () => {
        if (!this.props.isNotToggleCheck) {
            this.setState((prevState, props) => ({
                isCheck: !prevState.isCheck
            }), () => {
                if (!this.state.isCheck) {
                    this.setState({
                        value: "0"
                    })
                } else {
                    this.props.toogleCheck && this.props.toogleCheck();
                }
            });
        }
    }

    addSalaryIncome = () => {
        const tempRows = [...this.state.rows];
        tempRows.push(tempRows.length + 1);
        this.setState({
            rows: tempRows
        });
    }

    removeRow = (index) => {
        const tempRows =  this.state.rows.filter((row) => row !== index);
        this.setState({
            rows: tempRows
        })
    }

    render() {
        const { title, placeholder, onFocus, maxLength } = this.props;
        const { isCheck, rows } = this.state;
        const temptIconCheck = isCheck ? ICON.checkBox : ICON.checkBoxEmpty;
        return (
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: scaleSzie(25),
                marginTop: scaleSzie(20)
            }} >
                <Button onPress={this.onPress} style={{ width: scaleSzie(30) }} >
                    <Image source={temptIconCheck} style={{ width: scaleSzie(15), height: scaleSzie(15) }} />
                </Button>
                <View style={{ width: scaleSzie(120) }} >
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                        fontWeight: '600',
                    }}  >
                        {`${title}`}
                    </Text>
                </View>
                <View style={[{ width: scaleSzie(420) }]} >
                    {/* ------------------- Header Staff Salary Income ---------------------- */}
                    <View style={{ height: scaleSzie(32), flexDirection: "row" }} >
                        <View style={{ flex: 1 }} >
                            <Text style={styles.title} >
                                {`From ($)`}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={styles.title} >
                                {`To ($)`}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={styles.title} >
                                {`Salary percented (%)`}
                            </Text>
                        </View>
                    </View>

                    {/* ------------------- Item Staff Salary Income ---------------------- */}
                    {
                        rows.map((row, index) => <RowSalaryIncome
                            key={`row_staff_salary_${row}`}
                            rowIndex={row}
                            onFocus={() => onFocus()}
                            removeRow={this.removeRow}
                        />)
                    }

                    <Button onPress={this.addSalaryIncome} >
                        <Text style={{ color: "#0764B0", fontWeight: "700", fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                            {`+ Add more`}
                        </Text>
                    </Button>
                </View>
            </View >
        );
    }
}

class RowSalaryIncome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fromValue: "",
            toValue: "",
            salaryPercent: ""
        }
    }

    render() {
        const { onFocus, removeRow, rowIndex } = this.props;
        const { fromValue, toValue, salaryPercent } = this.state;

        return (
            <View style={{ height: scaleSzie(32), flexDirection: "row", marginBottom: scaleSzie(20) }} >
                <ItemSalaryIncome
                    placeholder="500.00"
                    value={fromValue}
                    onChangeText={(fromValue) => this.setState({ fromValue })}
                    onFocus={() => onFocus()}
                />
                <ItemSalaryIncome
                    placeholder="1000.00"
                    value={toValue}
                    onChangeText={(toValue) => this.setState({ toValue })}
                    onFocus={() => onFocus()}
                />
                <ItemSalaryIncome
                    placeholder="10.00"
                    value={salaryPercent}
                    onChangeText={(salaryPercent) => this.setState({ salaryPercent })}
                    onFocus={() => onFocus()}
                />
                {
                    rowIndex !== 1 ? <Button onPress={() => removeRow(rowIndex)}
                        style={{
                            justifyContent: "center", width: scaleSzie(20),
                        }}
                    >
                        <Image source={ICON.trash_icon} />
                    </Button> : <View style={{ width: scaleSzie(20) }} />
                }

            </View>
        );
    }

}

const ItemSalaryIncome = ({ placeholder, onFocus, maxLength, value, onChangeText }) => {
    return (
        <View style={styles.box_input_border} >
            <View style={styles.input_border} >
                <TextInputMask
                    type={'money'}
                    options={{
                        precision: 2,
                        separator: '.',
                        delimiter: ',',
                        unit: '',
                        suffixUnit: ''
                    }}
                    style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={(value) => onChangeText(value)}
                    onFocus={() => onFocus()}
                    maxLength={maxLength}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        color: "#404040",
        fontWeight: '500',
        fontSize: scaleSzie(13)
    },
    box_input_border: {
        flex: 1,
        paddingRight: scaleSzie(20)
    },
    input_border: {
        flex: 1,
        borderColor: '#C5C5C5',
        borderWidth: 1,
        paddingHorizontal: scaleSzie(5)
    }

})
