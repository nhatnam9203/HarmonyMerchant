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


class Layout extends React.Component {

    renderBody() {
        const { language, profile } = this.props;
        const { address, firstName, lastName, displayName,
            cellphone, email, pin, confirmPin, roles,
            driverlicense, socialSecurityNumber, professionalLicense,
            isDisabled,isActive
        } = this.state.user;
        const { street, city, state, zip } = address;
        const { nameRole } = roles;

        const businessHourStart = profile.businessHourStart ? profile.businessHourStart : '';
        const businessHourEnd = profile.businessHourEnd ? profile.businessHourEnd : '';

        return (
            <View style={styles.body} >
                <ScrollView
                    ref={this.scrollStaffRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
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
                            marginLeft: scaleSzie(5)
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
                        onFocus={() => this.scrollStaffTo(150)}
                    />

                    <ItemAdminInfoDoubleItem
                        title=""
                        placeholder={localize('City', language)}
                        value={city}
                        onChangeText={(value) => this.updateUserInfo('city', value, 'address')}
                    >
                        <View style={{
                            flex: 1,
                            marginLeft: scaleSzie(5),
                        }} >
                            <TextInputSuggestion
                                value={state}
                                onChangeText={value => this.updateUserInfo('state', value, 'address')}
                                onFocus={() => { }}
                                inputContainerStyle={{
                                    height: scaleSzie(35),
                                }}
                            />
                        </View>
                    </ItemAdminInfoDoubleItem>

                    {/* ------------ Zip code ----------- */}
                    <View style={{
                        flexDirection: 'row',
                        height: scaleSzie(36),
                        paddingLeft: scaleSzie(90),
                        paddingRight: scaleSzie(90),
                        marginTop: scaleSzie(14)
                    }} >
                        <View style={{ width: scaleSzie(150), }} />
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSzie(5) }} >
                                <TextInputMask
                                    type="only-numbers"
                                    style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                                    placeholder={localize('Zip Code', language)}
                                    value={zip}
                                    onChangeText={(value) => this.updateUserInfo('zip', value, 'address')}
                                    maxLength={5}
                                    keyboardType="numeric"
                                    onFocus={() => this.scrollStaffTo(150)}
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
                         height: scaleSzie(36),
                         paddingLeft: scaleSzie(90),
                         paddingRight: scaleSzie(90),
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
                    <View style={{ paddingHorizontal: scaleSzie(90) }} >
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
                    />
                    {
                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                            'Friday', 'Saturday', 'Sunday'
                        ].map((day, index) => {
                            return <ItemWorkingTime
                                key={index}
                                ref={this.setRefTimeWorking}
                                title={day}
                                dataInit={{
                                    timeStart: businessHourStart,
                                    timeEnd: businessHourEnd,
                                    isCheck: true
                                }}
                            />
                        })
                    }

                    {/* -----Service Salary ---- */}
                    <TitleTabAdminInfo
                        title={localize('Service Salary', language)}
                    />
                    {
                        [{ title: `${localize('Per Hour', language)} ($)`, placeholder: '100' },
                        { title: `${localize('Commission')} (%)`, placeholder: '10' }
                        ].map((salary, index) => {
                            return <ItemScalary
                                key={index}
                                ref={this.setRefSalary}
                                title={salary.title}
                                placeholder={salary.placeholder}
                                dataInit={{
                                    value: '',
                                    isCheck: false
                                }}
                                onFocus={() => this.scrollStaffTo(1100)}
                            />
                        })
                    }

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
                                    value: '',
                                    isCheck: false
                                }}
                                onFocus={() => this.scrollStaffTo(1230)}
                            />
                        })
                    }

                    {/* ----- Tip fee ---- */}
                    <TitleTabAdminInfo
                        title={localize('Tip fee', language)}
                    />
                    {
                        [{ title: `${localize('Percent', language)} (%)`, placeholder: '100' },
                        { title: `${localize('Fixed Amount')} ($)`, placeholder: '10' }
                        ].map((salary, index) => {
                            return <ItemScalary
                                key={index}
                                ref={this.setRefTip}
                                title={salary.title}
                                placeholder={salary.placeholder}
                                dataInit={{
                                    value: '',
                                    isCheck: false
                                }}
                                onFocus={() => this.scrollStaffTo(1300)}
                            />
                        })
                    }


                    {/* ---- Address ---- */}
                    <ItemAdminInfo
                        title={localize('Driver License', language)}
                        placeholder="0000-0000-0000"
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
                    />
                    <ItemAdminInfo
                        title={localize('Professional License', language)}
                        placeholder="0000-0000-0000"
                        value={professionalLicense}
                        onChangeText={(value) => this.updateUserInfo('professionalLicense', value)}
                        type={true}
                        onFocus={() => this.scrollStaffTo(1450)}
                    />
                    <View style={{
                        height: scaleSzie(70), paddingHorizontal: scaleSzie(90),
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
        if (isSubmitButton) {
            return (
                <ButtonCustom
                    width={scaleSzie(120)}
                    height={40}
                    backgroundColor="#F1F1F1"
                    title={localize('ADD', language)}
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

    renderFooter() {
        const { language } = this.props;

        return (
            <View style={styles.footer} >
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#F1F1F1"
                        title={localize('BACK', language)}
                        textColor="#6A6A6A"
                        onPress={() => this.props.backTab()}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                    />
                </View>
                <View style={styles.buttonContainer} >
                    <ButtonCustom
                        width={scaleSzie(250)}
                        height={40}
                        backgroundColor="#0764B0"
                        title={localize('NEXT', language)}
                        textColor="#fff"
                        onPress={() => this.props.nextTab()}
                    />
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container} >
                {this.renderBody()}
                {this.renderFooter()}
            </View>

        );
    }
}


const ItemAdminInfoDoubleItem = ({ title, placeholder, children, value, onChangeText }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
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
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
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

const TitleTabAdminInfo = ({ title }) => {
    return (
        <View style={{
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
            marginTop: scaleSzie(14)
        }} >
            <Text style={{
                color: '#404040',
                fontSize: scaleSzie(14),
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
