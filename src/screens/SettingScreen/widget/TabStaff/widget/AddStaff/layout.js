import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Switch
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import {
    Dropdown,
    ButtonCustom, Text, BrowserFile, TextInputSuggestion
} from '@components';
import { scaleSzie, localize } from '@utils';
import { ItemAdminInfo, ItemAdminCellPhone } from '../componentTab';
import ItemWorkingTime from '../ItemWorkingTime';
import ItemScalary from '../ItemScalary';
import ItemScalaryByIncome from "../ItemScalaryByIncome";

class Layout extends React.Component {

    renderBody() {
        const { address, firstName, lastName, displayName,
            cellphone, email, pin, confirmPin, roles,
            driverlicense, socialSecurityNumber, professionalLicense,
            isDisabled, isActive
        } = this.state.user;
        const { street, city, state, zip } = address;
        const { nameRole } = roles;
        const { language, isEditStaff, infoStaffHandle } = this.props;
        const { dynamicMarginBottomState } = this.state;

        const temptDataWorkingTime = isEditStaff ? infoStaffHandle.workingTimes : this.state.workingTime;
        const temptDataTipFee = isEditStaff ? infoStaffHandle.tipFees : this.state.tipFee;
        const temptDataSalary = isEditStaff ? infoStaffHandle.salaries : this.state.salary;
        const temptDataProductScalary = isEditStaff ? infoStaffHandle.productSalaries : this.state.productSalary;

        const perHour_ServiceSalary = temptDataSalary["perHour"] ? temptDataSalary["perHour"] : { value: 0, isCheck: false };
        const commision_ServiceSalary = temptDataSalary["commission"] ? temptDataSalary["commission"] : { value: 0, isCheck: false };
        const percent_TipFee = temptDataTipFee["percent"] ? temptDataTipFee["percent"] : { value: 0, isCheck: false };
        const fixedAmount_TipFee = temptDataTipFee["fixedAmount"] ? temptDataTipFee["fixedAmount"] : { value: 0, isCheck: false };
        const commision_ProductScalary = temptDataProductScalary["commission"] ? temptDataProductScalary["commission"] : { value: 0, isCheck: false };

        const temptCashPercent = isEditStaff ? infoStaffHandle.cashPercent : this.state.cashPercent;


        return (
            <View style={styles.body} >
                <ScrollView
                    ref={this.scrollStaffRef}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={true}
                    keyboardShouldPersistTaps={'always'}
                >
                    <View style={{ height: scaleSzie(30) }} />
                    <ItemAdminInfoDoubleItem
                        title={`${localize('Name', language)}*`}
                        placeholder={localize('First Name', language)}
                        value={firstName}
                        onChangeText={(value) => this.updateUserInfo('firstName', value)}
                    >
                        <View style={{
                            flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSzie(5),
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                                placeholder={localize('Last Name', language)}
                                value={lastName}
                                onChangeText={value => this.updateUserInfo('lastName', value)}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    <ItemAdminInfoDoubleItem
                        title={`${localize('Display Name', language)}*`}
                        placeholder={localize('Display Name', language)}
                        value={displayName}
                        onChangeText={(value) => this.updateUserInfo('displayName', value)}
                    />

                    <ItemAdminInfo
                        title={localize('Address', language)}
                        placeholder={localize('Street', language)}
                        value={street}
                        onChangeText={(value) => this.updateUserInfo('street', value, 'address')}
                        onFocus={() => this.scrollStaffTo(140)}
                    />

                    <ItemAdminInfoDoubleItem
                        title=""
                        placeholder={localize('City', language)}
                        value={city}
                        onChangeText={(value) => this.updateUserInfo('city', value, 'address')}
                    >
                        <View style={{
                            flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSzie(5)
                        }} >
                            <TextInputMask
                                type="only-numbers"
                                style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                                placeholder={localize('Zip Code', language)}
                                value={zip}
                                onChangeText={(value) => this.updateUserInfo('zip', value, 'address')}
                                maxLength={5}
                                keyboardType="numeric"
                                onFocus={() => this.scrollStaffTo(140)}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    {/* ------------ Zip code ----------- */}
                    <View style={{
                        flexDirection: "row", height: scaleSzie(36),
                        paddingHorizontal: scaleSzie(25),
                        marginTop: scaleSzie(14),
                        marginBottom: scaleSzie(dynamicMarginBottomState)
                    }} >
                        <View style={{ width: scaleSzie(150), }} />
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1, }} >
                                <TextInputSuggestion
                                    value={state}
                                    onChangeText={(value, count) => {
                                        this.updateUserInfo('state', value, 'address');
                                        this.setState({
                                            dynamicMarginBottomState: count * 24
                                        })
                                    }}
                                    resetMarginState={() => this.setState({ dynamicMarginBottomState: 24 })}
                                    onFocus={() => { }}
                                    inputContainerStyle={{
                                        height: scaleSzie(35),
                                    }}
                                    onFocus={() => this.scrollStaffTo(250)}
                                />
                            </View>
                            <View style={{ flex: 1, }} />
                        </View>
                    </View>


                    <ItemAdminCellPhone
                        ref={this.cellphoneRef}
                        title={`${localize('Cell Phone', language)}`}
                        placeholder={localize('Phone Number', language)}
                        value={cellphone}
                        onChangeText={(value) => this.updateUserInfo('cellphone', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(310)}
                        style={{ marginTop: scaleSzie(10) }}
                    />
                    <ItemAdminInfo
                        title={`${localize('Contact Email', language)}`}
                        placeholder={localize('Email')}
                        value={email}
                        onChangeText={(value) => this.updateUserInfo('email', value)}
                        onFocus={() => this.scrollStaffTo(370)}
                    />
                    <ItemAdminInfo
                        title={`${localize('Create PIN', language)}*`}
                        placeholder="****"
                        value={pin}
                        onChangeText={(value) => this.updateUserInfo('pin', value)}
                        secureTextEntry={true}
                        maxLength={4}
                        type={true}
                        onFocus={() => this.scrollStaffTo(430)}
                    />
                    <ItemAdminInfo
                        title={`${localize('Confirm PIN', language)}*`}
                        placeholder="****"
                        value={confirmPin}
                        onChangeText={(value) => this.updateUserInfo('confirmPin', value)}
                        secureTextEntry={true}
                        maxLength={4}
                        type={true}
                        onFocus={() => this.scrollStaffTo(490)}
                    />
                    <ItemAdminInfoRole
                        DropdowAdmin={() => <Dropdown
                            label={localize('Admin', language)}
                            data={[{ value: 'Admin' }, { value: 'Staff' }]}
                            value={nameRole}
                            onChangeText={(value) => this.updateUserInfo('nameRole', value, 'roles')}
                            containerStyle={styles.dropdown}
                        />}
                        DropdowStatusAdmin={() => <Dropdown
                            label={localize('Status', language)}
                            data={[{ value: 'Active' }, { value: 'Disable' }]}
                            value={isDisabled}
                            onChangeText={(value) => this.updateUserInfo('isDisabled', value)}
                            containerStyle={styles.dropdown}
                        />}
                    />

                    {/* ----------- Active -------- */}
                    <View style={{
                        flexDirection: 'row',
                        height: scaleSzie(36),
                        paddingHorizontal: scaleSzie(25),
                        marginTop: scaleSzie(25)
                    }} >
                        <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSzie(14),
                                fontWeight: '600',

                            }}  >
                                {`Visible`}
                            </Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: "center" }} >
                            <Switch
                                trackColor={{ false: "#767577", true: "#0764B0" }}
                                // thumbColor={toogle ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#E5E5E5"
                                onValueChange={(isActive) => this.updateUserInfo("isActive", isActive)}
                                value={isActive ? isActive : false}
                            />
                        </View>
                    </View>


                    {/* ------- Upload Image ----- */}
                    <View style={{ paddingHorizontal: scaleSzie(25) }} >
                        <BrowserFile
                            ref={this.browserFileRef}
                            updateFileId={this.updateFileId}
                            imageUrl={this.state.imageUrl}
                            styleText={{
                                color: '#404040',
                                fontSize: scaleSzie(14),
                                fontWeight: '600',
                            }}
                            editButtonSubmit={this.editButtonSubmit}
                        />
                    </View>

                    <TitleTabAdminInfo
                        title={localize('Working Time', language)}
                        style={{ color: "#0764B0" }}
                    />
                    {
                        Object.keys(temptDataWorkingTime).map((day, index) => {
                            return <ItemWorkingTime
                                key={index}
                                ref={this.setRefTimeWorking}
                                title={day}
                                dataInit={temptDataWorkingTime[day]}
                            />
                        })
                    }

                    {/* ----- Service Salary ---- */}
                    <TitleTabAdminInfo
                        title={localize('Service Salary', language)}
                    />

                    {/* ----- Per Hour ServiceSalary ---- */}
                    <ItemScalary
                        ref={this.perHourServiceSalaryRef}
                        title={`${localize("Per Hour", language)} ($)`}
                        placeholder={'10'}
                        dataInit={perHour_ServiceSalary}
                        onFocus={() => this.scrollStaffTo(1100)}
                        toogleCheck={this.disableCommisionServiceSalary}
                    />

                    {/* ----- Commission ServiceSalary ---- */}
                    <ItemScalaryByIncome
                        ref={this.commissionSalaryRef}
                        title={`${localize("Incomes", language)}`}
                        placeholder={'10'}
                        dataInit={commision_ServiceSalary}
                        onFocus={() => this.scrollStaffTo(1100)}
                        toogleCheck={this.disablePerHourSalary}
                    />

                    {/* ----- Product Salary ---- */}
                    <TitleTabAdminInfo
                        title={localize('Product Salary', language)}
                    />

                    <ItemScalary
                        ref={this.commisionProductScalaryRef}
                        title={`${localize("Commission", language)} (%)`}
                        placeholder={'10'}
                        dataInit={commision_ProductScalary}
                        onFocus={() => this.scrollStaffTo(1230)}
                    />

                    {/* ----- Tip fee ---- */}
                    <TitleTabAdminInfo
                        title={localize('Tip', language)}
                    />

                    {/* ----- Percent Tip Fee ---- */}
                    <ItemScalary
                        ref={this.percentTipFeeRef}
                        title={`${localize("Percent", language)} (%)`}
                        placeholder={'10'}
                        dataInit={percent_TipFee}
                        onFocus={() => this.scrollStaffTo(1300)}
                        toogleCheck={this.disableFixedAmountTip}
                    />

                    {/* ----- Fix amount Tip Fee ---- */}
                    <ItemScalary
                        ref={this.fixedAmountTipFeeRef}
                        title={`${localize("Fixed Amount", language)} ($)`}
                        placeholder={'10'}
                        dataInit={fixedAmount_TipFee}
                        onFocus={() => this.scrollStaffTo(1300)}
                        toogleCheck={this.disablePercentTip}
                    />

                    {/* -----  Payout With Cash ---- */}
                    <TitleTabAdminInfo
                        title={localize('Payout With Cash', language)}
                    />


                    {/* ----- Cash Percent ---- */}
                    <ItemScalary
                        ref={this.cashPercentRef}
                        title={`${localize("Cash Percent", language)} (%)`}
                        placeholder={'10'}
                        dataInit={{
                            isCheck: true,
                            value: temptCashPercent
                        }}
                        onFocus={() => this.scrollStaffTo(1500)}
                        maxLength={3}
                        isNotToggleCheck={true}
                    />


                    {/* ---- Address ---- */}
                    <ItemAdminInfo
                        title={localize('Driver License', language)}
                        // placeholder="0000-0000-0000"
                        value={driverlicense}
                        onChangeText={(value) => this.updateUserInfo('driverlicense', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(1450)}
                    />
                    <ItemAdminInfo
                        title={localize('Social Security Number', language)}
                        placeholder="000-00-0000"
                        value={socialSecurityNumber}
                        onChangeText={(value) => this.updateUserInfo('socialSecurityNumber', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(1450)}
                        typeSocial="custom"
                        mark="999-99-9999"
                        style={{
                            fontSize: scaleSzie(12),
                            fontWeight: "bold"
                        }}
                    />
                    <ItemAdminInfo
                        title={localize('Professional License', language)}
                        // placeholder="0000-0000-0000"
                        value={professionalLicense}
                        onChangeText={(value) => this.updateUserInfo('professionalLicense', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(1450)}
                    />
                    <View style={{
                        height: scaleSzie(70), paddingHorizontal: scaleSzie(25),
                        justifyContent: 'center', alignItems: 'flex-end'
                    }} >
                        {this.renderButtonSubmit()}
                    </View>
                    <View style={{ height: scaleSzie(300) }} />
                </ScrollView>
            </View>
        );
    }

    renderButtonSubmit() {
        const { language } = this.props;
        const { isSubmitButton } = this.state;
        const titleButton = this.props.isEditStaff ? 'SAVE' : 'ADD';
        if (isSubmitButton) {
            return (

                <ButtonCustom
                    width={scaleSzie(120)}
                    height={40}
                    backgroundColor="#F1F1F1"
                    title={localize(titleButton, language)}
                    textColor="#C5C5C5"
                    onPress={this.addAdmin}
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        backgroundColor: '#0764B0'
                    }}
                    styleText={{ fontSize: scaleSzie(15), fontWeight: '500', color: '#fff' }}
                />
            );
        } else {
            return (
                <View style={{
                    width: scaleSzie(120), height: scaleSzie(40), backgroundColor: '#0764B0',
                    borderRadius: scaleSzie(2), justifyContent: 'center', alignItems: 'center'
                }} >
                    < ActivityIndicator
                        size="large"
                        color="#fff"
                    />
                </View>
            );
        }

    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderBody()}
            </View>

        );
    }
}


const ItemAdminInfoDoubleItem = ({ title, placeholder, children, value, onChangeText }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(14)
        }} >
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',

                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSzie(5) }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value => onChangeText(value))}

                    />
                </View>

                <View style={{ width: scaleSzie(5) }} />

                <View style={{ flex: 1, }} >
                    {children}
                </View>
            </View>
        </View>
    );
}

const ItemAdminInfoRole = ({ DropdowAdmin, DropdowStatusAdmin }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(14)
        }} >
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',

                }}  >
                    {`Roles`}
                </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1.3, flexDirection: 'row' }} >
                    <View style={{ flex: 1 }} >
                        {DropdowAdmin()}
                    </View>
                    <View style={{ flex: 1 }} />
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <View style={{ justifyContent: 'center' }} >
                        <Text style={{
                            color: '#404040',
                            fontSize: scaleSzie(14),
                            fontWeight: '600',

                        }}  >
                            {`Status`}
                        </Text>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 20 }} >
                        {DropdowStatusAdmin()}
                    </View>
                </View>
            </View>
        </View>
    );
}

const TitleTabAdminInfo = ({ title, style }) => {
    return (
        <View style={{
            paddingHorizontal: scaleSzie(25),
            marginTop: scaleSzie(14)
        }} >
            <Text style={[{
                fontSize: scaleSzie(16),
                fontWeight: '600',
                color: "#0764B0"
            }, style]}  >
                {`${title}`}
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
    borderTextInput: {
        borderWidth: 1,
        borderColor: '#C5C5C5'
    },
    dropdown: {
        backgroundColor: '#F1F1F1',
        borderWidth: 1,
        borderColor: '#C5C5C5',
        flex: 1
    }

})

export default Layout;
