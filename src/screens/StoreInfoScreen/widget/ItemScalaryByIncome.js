import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from "ramda";

import ICON from '@resources';
import { Button } from '@components';
import { scaleSzie } from '@utils';


export default class ItemScalary extends React.Component {

    constructor(props) {
        super(props);
        const { dataInit } = this.props;
        this.state = {
            isCheck: dataInit.isCheck,
            rows: this.getinitDataForRows(dataInit)
        };
        this.count = 1;
        this.incomeSalaryRef = [];
    }

    resetInitState = () => {
        this.count = 1;
        this.setState({
            rows: [{ keyRows: 1, from: "", to: "", commission: "" }]
        }, () => {
            this.incomeSalaryRef = this.incomeSalaryRef.filter(ref => ref._isMounted);
            for (let ref of this.incomeSalaryRef) {
                ref?.resetStateFromParent();
            }
        })
    }

    getinitDataForRows = (dataInit) => {
        if (dataInit?.isCheck) {
            const tempRows = [];
            const maxLength = dataInit?.value.length || 0;
            for (let i = 0; i < maxLength; i++) {
                const data = dataInit?.value[i];
                tempRows.push({
                    keyRows: i + 1,
                    from: data?.from || 0.00,
                    to: data?.to || 0.00,
                    commission: data?.commission || 0.00,
                });
            };
            this.count = maxLength;
            return tempRows;
        }

        return [{ keyRows: 1, from: "", to: "", commission: "" }];
    }

    addRef = (ref) => {
        if (ref) {
            this.incomeSalaryRef.push(ref);
        }
    }

    setStateFromParent = async (isCheck = false,) => {
        await this.setState({
            isCheck,
        });
        this.resetInitState();
    }

    getDataFromParent = () => {
        this.incomeSalaryRef = this.incomeSalaryRef.filter(ref => ref._isMounted);
        return this.incomeSalaryRef;
    }

    onPress = () => {
        this.setState((prevState, props) => ({
            isCheck: !prevState.isCheck
        }), () => {
            if (!this.state.isCheck) {
                this.resetInitState();
            } else {
                this.props.toogleCheck && this.props.toogleCheck();
            }
        });
    }

    checkValue = (value) => {
        return value !== "" ? true : false;
    }

    addSalaryIncome = () => {
        let isAddSalaryIncome = true;
        this.incomeSalaryRef = this.incomeSalaryRef.filter(ref => ref._isMounted);
        for (let ref of this.incomeSalaryRef) {
            if (!this.checkValue(ref?.state?.from) || !this.checkValue(ref?.state?.to) || !this.checkValue(ref?.state?.commission)) {
                isAddSalaryIncome = false;
                break;
            }
        }
        if (isAddSalaryIncome) {
            this.count++;
            const tempRows = [...this.state.rows];
            tempRows.push({
                keyRows: this.count,
                from: "",
                to: "",
                commission: ""
            });
            this.setState({
                rows: tempRows
            });
            this.props.updateRowsSalaryIncome(tempRows.length);
        } else {
            alert("Please enter full information, before you add more!");
        }


    }

    removeRow = (index) => {
        const tempRows = this.state.rows.filter(data => data.keyRows !== index);
        const tempRefs = this.incomeSalaryRef.filter(ref => ref._isMounted && ref?.props?.keyRows !== index);
        this.incomeSalaryRef = [...tempRefs];
        this.setState({
            rows: tempRows
        });
        this.props.updateRowsSalaryIncome(tempRows.length);
    }

    showRef = () => {
        // console.log(this.incomeSalaryRef);
    }

    // --------------- Render ------------
    render() {
        const { title, placeholder, onFocus, maxLength } = this.props;
        const { isCheck, rows } = this.state;
        const temptIconCheck = isCheck ? ICON.checkBox : ICON.checkBoxEmpty;
        return (
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: scaleSzie(90),
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
                        rows.map((data, index) => <RowSalaryIncome
                            ref={this.addRef}
                            key={`row_staff_salary_${data.keyRows}`}
                            data={data}
                            onFocus={() => onFocus()}
                            removeRow={this.removeRow}
                            isEditable={isCheck}
                        />)
                    }
                    {
                        isCheck ? <Button onPress={this.addSalaryIncome} >
                            <Text style={{ color: "#0764B0", fontWeight: "700", fontSize: scaleSzie(14), marginTop: scaleSzie(5) }} >
                                {`+ Add more`}
                            </Text>
                        </Button> : <View />
                    }

                    {/* <Button onPress={this.showRef} >
                        <Text style={{ color: "#0764B0", fontWeight: "700", fontSize: scaleSzie(14), marginTop: scaleSzie(10) }} >
                            {`+ show`}
                        </Text>
                    </Button> */}
                </View>
            </View >
        );
    }

    componentWillUnmount() {
        this.count = 0;
        this.incomeSalaryRef = [];
    }
}

class RowSalaryIncome extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            from: this.props?.data?.from,
            to: this.props?.data?.to,
            commission: this.props?.data?.commission
        }
    }

    resetStateFromParent = () => {
        this.setState({
            from: "",
            to: "",
            commission: ""
        })
    }

    componentDidMount() {
        this._isMounted = true;
    }

    render() {
        const { onFocus, removeRow, data, isEditable } = this.props;
        const { from, to, commission } = this.state;

        return (
            <View style={{ height: scaleSzie(32), flexDirection: "row", marginBottom: scaleSzie(20) }} >
                <ItemSalaryIncome
                    placeholder="500.00"
                    value={from}
                    onChangeText={(from) => this.setState({ from })}
                    onFocus={() => onFocus()}
                    isEditable={isEditable}
                />
                <ItemSalaryIncome
                    placeholder="1000.00"
                    value={to}
                    onChangeText={(to) => this.setState({ to })}
                    onFocus={() => onFocus()}
                    isEditable={isEditable}
                />
                <ItemSalaryIncome
                    placeholder="10.00"
                    value={commission}
                    onChangeText={(commission) => this.setState({ commission })}
                    onFocus={() => onFocus()}
                    isEditable={isEditable}
                />
                {
                    data.keyRows !== 1 ? <Button onPress={() => removeRow(data.keyRows)}
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

    componentWillUnmount() {
        this._isMounted = false;
    }

}

const ItemSalaryIncome = ({ placeholder, onFocus, maxLength, value, onChangeText, isEditable }) => {
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
                    editable={isEditable}
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
