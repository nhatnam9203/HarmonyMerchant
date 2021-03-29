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


export const ItemScalaryByIncome = ({ title, onFocus, data, onPressIncomesCheckbox, addMoreSalary, onChangeSalaryByIndex, removeSalaryByIndex}) => {

    const rows = data?.value || [];
    const isCheck = data?.isCheck;
    const temptIconCheck = isCheck ? ICON.checkBox : ICON.checkBoxEmpty;

    return (
        <View style={{
            flexDirection: 'row',
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(20)
        }} >
            <Button onPress={onPressIncomesCheckbox} style={{ width: scaleSzie(30) }} >
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
                        index={index}
                        onChangeText={onChangeSalaryByIndex}
                        removeSalaryByIndex={removeSalaryByIndex}
                    />)
                }
                {
                    isCheck ? <Button onPress={addMoreSalary} >
                        <Text style={{ color: "#0764B0", fontWeight: "700", fontSize: scaleSzie(14), marginTop: scaleSzie(5) }} >
                            {`+ Add more`}
                        </Text>
                    </Button> : <View />
                }
            </View>
        </View >
    );
}

const RowSalaryIncome = ({onFocus, removeSalaryByIndex, data, isEditable, index, onChangeText }) => {
        const from = data?.from;
        const to = data?.to;
        const commission = data?.commission;

        return (
            <View style={{ height: scaleSzie(32), flexDirection: "row", marginBottom: scaleSzie(20) }} >
                <ItemSalaryIncome
                    placeholder="500.00"
                    value={from}
                    onChangeText={(value) => onChangeText(value, "from", index)}
                    onFocus={() => onFocus()}
                    isEditable={isEditable}
                />
                <ItemSalaryIncome
                    placeholder="1000.00"
                    value={to}
                    onChangeText={(value) => onChangeText(value, "to", index)}
                    onFocus={() => onFocus()}
                    isEditable={isEditable}
                />
                <ItemSalaryIncome
                    placeholder="10.00"
                    value={commission}
                    onChangeText={(value) => onChangeText(value, "commission", index)}
                    onFocus={() => onFocus()}
                    isEditable={isEditable}
                />
                {
                    index !== 0 ? <Button onPress={() => removeSalaryByIndex(index)}
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
