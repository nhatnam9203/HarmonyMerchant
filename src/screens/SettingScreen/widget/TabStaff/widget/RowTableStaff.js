import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { ButtonCustom } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

const RowTable = ({ staff, index, archiveStaff, editStaff, restoreStaff, move, moveEnd, toggleStaffActive }) => {

    // const [source, setSource] = useState({
    //     uri: staff?.imageUrl,
    //     priority: FastImage.priority.low,
    //     cache: FastImage.cacheControl.immutable
    // });

    // useEffect(() => {
    //     if (source?.uri && source?.uri !== staff?.imageUrl) {
    //         setSource({
    //             uri: staff?.imageUrl,
    //             priority: FastImage.priority.low,
    //             cache: FastImage.cacheControl.immutable
    //         })
    //     }
    // }, [staff?.imageUrl])

    function toggleIsActive(isActive) {
        toggleStaffActive(staff, isActive);
    }

    return (
        <TouchableOpacity
            onLongPress={move}
            onPressOut={moveEnd}
            style={styles.tableHeader} >
            {/* ----- 1 ------ */}
            <View style={[{
                width: scaleSize(50),
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center'
            }]} >
                <Image source={IMAGE.indicate}
                    style={{ width: scaleSize(12), height: scaleSize(29) }}
                />
                <Text style={styles.textTableHeader} >
                    {`${parseInt(index) + 1}.`}
                </Text>
            </View>
            {/* ----- 2 ------ */}
            <View style={{
                width: scaleSize(200), flexDirection: 'row',
            }} >
                <View style={{ justifyContent: 'center' }} >
                    {
                        staff?.imageUrl ? <FastImage
                            style={{ width: scaleSize(30), height: scaleSize(30) }}
                            source={{
                                uri: staff?.imageUrl,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                            // onError={() => setSource(IMAGE.staff_holder)}
                        /> : <FastImage source={IMAGE.staff_holder} style={{ width: scaleSize(30), height: scaleSize(30) }} />
                    }
                </View>
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                    <Text style={styles.textTableHeader}  >
                        {staff.displayName}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 3 ------ */}
            {/* ----- 4 ------ */}
            <View style={{
                width: scaleSize(110), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(10) }} >
                    <Text style={styles.textTableHeader} >
                        {staff.roleName}
                    </Text>
                </View>
                <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 5 ----- */}
            <View style={{
                width: scaleSize(90), flexDirection: 'row',
            }} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }} >
                    <Switch
                        trackColor={{ false: "#767577", true: "#0764B0" }}
                        ios_backgroundColor="#E5E5E5"
                        onValueChange={(isActive) => toggleIsActive(isActive)}
                        value={staff.isActive}
                    />
                </View>
                <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                </View>
            </View>
            {/* ----- 6 ------ */}
            <View style={{
                flex: 1,
                flexDirection: 'row'
            }} >
                <View style={styles.actionButton} >
                    <ButtonCustom
                        width={'80%'}
                        height={28}
                        backgroundColor="#0764B0"
                        title="Edit"
                        textColor="#fff"
                        onPress={() => editStaff()}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                        styleText={{
                            fontSize: scaleSize(14)
                        }}
                    />
                </View>
                <View style={styles.actionButton} >
                    {
                        staff.isDisabled === 0 ? <ButtonCustom
                            width={'80%'}
                            height={28}
                            backgroundColor="#FF3B30"
                            title="Archive"
                            textColor="#fff"
                            onPress={() => archiveStaff()}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                            styleText={{
                                fontSize: scaleSize(14)
                            }}
                        /> :
                            <ButtonCustom
                                width={'80%'}
                                height={28}
                                backgroundColor="#F1F1F1"
                                title="Restore"
                                textColor="#6A6A6A"
                                onPress={() => restoreStaff()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSize(2) }}
                                styleText={{
                                    fontSize: scaleSize(14)
                                }}
                            />
                    }

                </View>
            </View>
        </TouchableOpacity>
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSize(55),
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSize(14)
    },
    itemTableHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

const mapStateToProps = state => ({
    loading: state.app.loading
})



export default connectRedux(mapStateToProps, RowTable);

// export default RowTable;

