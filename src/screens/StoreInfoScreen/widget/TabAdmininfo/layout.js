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
    ButtonCustom, Text, BrowserFile, TextInputSuggestion, FooterTwoButton
} from '@components';
import { scaleSize, localize } from '@utils';
import { ItemAdminInfo, ItemAdminCellPhone } from '../componentTab';
import ItemWorkingTime from '../ItemWorkingTime';
import ItemScalary from '../ItemScalary';
import ItemScalaryByIncome from "../ItemScalaryByIncome";

class Layout extends React.Component {

    renderBody() {
        const { language } = this.props;
        const { address, firstName, lastName, displayName,
            cellphone, email, pin, confirmPin, roles,
            driverlicense, socialSecurityNumber, professionalLicense,
            isDisabled, isActive
        } = this.state.user;
        const { street, city, state, zip } = address;
        const { nameRole } = roles;
        const { businessHour, dynamicMarginBottomState,rowsSalaryIncome } = this.state;

        return (
            <View style={styles.body} >
                <ScrollView
                    ref={this.scrollStaffRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    <View style={{ height: scaleSize(30) }} />
                    <ItemAdminInfoDoubleItem
                        title={`${localize('Name', language)}*`}
                        placeholder={localize('First Name', language)}
                        value={firstName}
                        onChangeText={(value) => this.updateUserInfo('firstName', value)}
                    >
                        <View style={{
                            flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSize(5),
                        }} >
                            <TextInput
                                style={{ flex: 1, fontSize: scaleSize(14), color: '#404040', }}
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
                        onFocus={() => this.scrollStaffTo(150)}
                    />

                    <ItemAdminInfoDoubleItem
                        title=""
                        placeholder={localize('City', language)}
                        value={city}
                        onChangeText={(value) => this.updateUserInfo('city', value, 'address')}
                    >
                        <View style={{
                            flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSize(5)
                        }} >
                            {/* ------------- */}
                            <TextInputMask
                                type="only-numbers"
                                style={{ flex: 1, fontSize: scaleSize(14), color: '#404040', }}
                                placeholder={localize('Zip Code', language)}
                                value={zip}
                                onChangeText={(value) => this.updateUserInfo('zip', value, 'address')}
                                maxLength={5}
                                keyboardType="numeric"
                                onFocus={() => this.scrollStaffTo(150)}
                            />

                        </View>
                    </ItemAdminInfoDoubleItem>

                    {/* ------------ Zip code ----------- */}
                    <View style={{
                        flexDirection: 'row',
                        height: scaleSize(36),
                        paddingLeft: scaleSize(90),
                        paddingRight: scaleSize(90),
                        marginTop: scaleSize(14),
                        marginBottom: scaleSize(dynamicMarginBottomState)
                    }} >
                        <View style={{ width: scaleSize(150), }} />
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
                                        height: scaleSize(35),
                                    }}
                                    onFocus={() => this.scrollStaffTo(240)}
                                />
                            </View>
                            <View style={{ flex: 1, }} />
                        </View>
                    </View>

                    <ItemAdminCellPhone
                        ref={this.cellphoneRef}
                        title={`${localize('Cell phone', language)}`}
                        placeholder={localize('Phone number', language)}
                        value={cellphone}
                        onChangeText={(value) => this.updateUserInfo('cellphone', value)}
                        onFocus={() => this.scrollStaffTo(310)}
                        style={scaleSize(10)}
                    />

                    <ItemAdminInfo
                        title={`${localize('Contact email', language)}`}
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
                            data={[{ value: 'Admin' }]}
                            value={nameRole}
                            onChangeText={(value) => this.updateUserInfo('nameRole', value, 'roles')}
                            containerStyle={styles.dropdown}
                        />}
                        DropdowStatusAdmin={() => <Dropdown
                            label={localize('Status', language)}
                            data={[{ value: 'Active' }]}
                            value={isDisabled}
                            onChangeText={(value) => this.updateUserInfo('isDisabled', value)}
                            containerStyle={styles.dropdown}
                        />}
                    />

                    {/* ----------- Active -------- */}
                    <View style={{
                        flexDirection: 'row',
                        height: scaleSize(36),
                        paddingLeft: scaleSize(90),
                        paddingRight: scaleSize(90),
                        marginTop: scaleSize(25)
                    }} >
                        <View style={{ width: scaleSize(150), justifyContent: 'center' }} >
                            <Text style={{
                                color: '#404040',
                                fontSize: scaleSize(14),
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
                    <View style={{ paddingHorizontal: scaleSize(90) }} >
                        <BrowserFile
                            ref={this.browserFileRef}
                            updateFileId={this.updateFileId}
                            imageUrl={this.state.imageUrl}
                            styleText={{
                                color: '#404040',
                                fontSize: scaleSize(14),
                                fontWeight: '600',
                            }}
                            editButtonSubmit={this.editButtonSubmit}
                        />
                    </View>
                    <TitleTabAdminInfo
                        title={localize('Working Time', language)}
                    />
                    {
                        Object.keys(businessHour).map((day, index) => {
                            return <ItemWorkingTime
                                key={index}
                                ref={this.setRefTimeWorking}
                                title={day}
                                dataInit={businessHour[day]}
                            />
                        })
                    }

                    {/* -----Service Salary ---- */}
                    <TitleTabAdminInfo
                        title={localize('Service Salary', language)}
                    />

                    <ItemScalary
                        ref={this.perHourServiceSalaryRef}
                        title={`${localize('Per Hour', language)} ($)`}
                        placeholder={'100'}
                        type={"perHour"}
                        dataInit={{
                            value: '0',
                            isCheck: false
                        }}
                        onFocus={() => this.scrollStaffTo(1100)}
                        toogleCheck={this.disableCommisionServiceSalary}
                    />

                    {/* ----- Commission ServiceSalary ---- */}
                    <ItemScalaryByIncome
                        ref={this.commissionSalaryRef}
                        title={`${localize("Incomes", language)}`}
                        placeholder={'10'}
                        dataInit={{
                            isCheck: false,
                            value: {
                                from: "",
                                to: "",
                                commission: "",
                            }
                        }}
                        onFocus={() => this.scrollStaffTo(1250 +rowsSalaryIncome * 35)}
                        toogleCheck={this.disablePerHourSalary}
                        updateRowsSalaryIncome={(rowsSalaryIncome) => this.setState({rowsSalaryIncome})}
                    />

                    {/* ----- Product Salary ---- */}
                    <TitleTabAdminInfo
                        title={localize('Product Salary', language)}
                    />
                    {
                        [{ title: `${localize('Commission')} (%)`, placeholder: '10' }].map((salary, index) => {
                            return <ItemScalary
                                key={index}
                                ref={this.setProductSalary}
                                title={salary.title}
                                placeholder={salary.placeholder}
                                dataInit={{
                                    value: '0',
                                    isCheck: false
                                }}
                                onFocus={() => this.scrollStaffTo(1300+ rowsSalaryIncome * 35)}
                            />
                        })
                    }

                    {/* ----- Tip fee ---- */}
                    <TitleTabAdminInfo
                        title={localize('Tip fee', language)}
                    />


                    {/* ----- Percent Tip Fee ---- */}
                    <ItemScalary
                        ref={this.percentTipFeeRef}
                        title={`${localize("Percent", language)} (%)`}
                        placeholder={'10'}
                        dataInit={{
                            value: '0',
                            isCheck: false
                        }}
                        onFocus={() => this.scrollStaffTo(1300+ rowsSalaryIncome * 35)}
                        toogleCheck={this.disableFixedAmountTip}
                    />

                    {/* ----- Fix amount Tip Fee ---- */}
                    <ItemScalary
                        ref={this.fixedAmountTipFeeRef}
                        title={`${localize("Fixed Amount", language)} ($)`}
                        placeholder={'10'}
                        dataInit={{
                            value: '0',
                            isCheck: false
                        }}
                        onFocus={() => this.scrollStaffTo(1400+ rowsSalaryIncome * 35)}
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
                            value: 0
                        }}
                        onFocus={() => this.scrollStaffTo(1500+ rowsSalaryIncome * 35)}
                        maxLength={3}
                        isNotToggleCheck={true}
                    />


                    {/* ---- Address ---- */}
                    <ItemAdminInfo
                        title={localize('Driver License', language)}
                        placeholder="0000-0000-0000"
                        value={driverlicense}
                        onChangeText={(value) => this.updateUserInfo('driverlicense', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(1600+ rowsSalaryIncome * 35)}
                    />
                    <ItemAdminInfo
                        title={localize('Social Security Number', language)}
                        placeholder="000-00-0000"
                        value={socialSecurityNumber}
                        onChangeText={(value) => this.updateUserInfo('socialSecurityNumber', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(2000+ rowsSalaryIncome * 35)}
                        typeSocial="custom"
                        mark="999-99-9999"
                        style={{
                            fontSize: scaleSize(12),
                            fontWeight: "bold"
                        }}
                    />
                    <ItemAdminInfo
                        title={localize('Professional License', language)}
                        placeholder="0000-0000-0000"
                        value={professionalLicense}
                        onChangeText={(value) => this.updateUserInfo('professionalLicense', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(2000+ rowsSalaryIncome * 35)}
                    />
                    <View style={{
                        height: scaleSize(70), paddingHorizontal: scaleSize(90),
                        justifyContent: 'center', alignItems: 'flex-end'
                    }} >
                        {this.renderButtonSubmit()}
                    </View>
                    <View style={{ height: scaleSize(300) }} />
                </ScrollView>
            </View>
        );
    }

    renderButtonSubmit() {
        const { language } = this.props;
        const { isSubmitButton } = this.state;
        if (isSubmitButton) {
            return (
                <ButtonCustom
                    width={scaleSize(120)}
                    height={40}
                    backgroundColor="#F1F1F1"
                    title={localize('ADD', language)}
                    textColor="#C5C5C5"
                    onPress={this.addAdmin}
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        backgroundColor: '#0764B0'
                    }}
                    styleText={{ fontSize: scaleSize(15), fontWeight: '500', color: '#fff' }}
                />
            );
        } else {
            return (
                <View style={{
                    width: scaleSize(120), height: scaleSize(40), backgroundColor: '#0764B0',
                    borderRadius: scaleSize(2), justifyContent: 'center', alignItems: 'center'
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
                <FooterTwoButton
                    back={() => this.props.backTab()}
                    next={() => this.props.nextTab()}
                />
            </View>

        );
    }
}


const ItemAdminInfoDoubleItem = ({ title, placeholder, children, value, onChangeText }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSize(36),
            paddingLeft: scaleSize(90),
            paddingRight: scaleSize(90),
            marginTop: scaleSize(14)
        }} >
            <View style={{ width: scaleSize(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSize(14),
                    fontWeight: '600',

                }}  >
                    {`${title}`}
                </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSize(5) }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSize(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value => onChangeText(value))}
                    />
                </View>

                <View style={{ width: scaleSize(5) }} />

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
            height: scaleSize(36),
            paddingLeft: scaleSize(90),
            paddingRight: scaleSize(90),
            marginTop: scaleSize(14)
        }} >
            <View style={{ width: scaleSize(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSize(14),
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
                            fontSize: scaleSize(14),
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

const TitleTabAdminInfo = ({ title }) => {
    return (
        <View style={{
            paddingLeft: scaleSize(90),
            paddingRight: scaleSize(90),
            marginTop: scaleSize(14)
        }} >
            <Text style={{
                color: '#404040',
                fontSize: scaleSize(14),
                fontWeight: '600',

            }}  >
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
        height: scaleSize(50),
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
