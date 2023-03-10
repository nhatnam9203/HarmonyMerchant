import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { ButtonCustom } from '@components';
import { scaleSize } from '@utils';
import IMAGE from '@resources';

class RowTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isArchive: true
        }
    }

    handleArchirveStaff = () => {
        this.setState({
            isArchive: false
        })
    }

    handleRestoreStaff = () => {
        this.setState({
            isArchive: true
        })
    }

    render() {
        const { staff, index, archiveStaff, editStaff, restoreStaff } = this.props;
        const { isArchive } = this.state;
        return (
            <View style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={[{
                    width: scaleSize(60),
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }]} >
                    <Image source={IMAGE.indicate}
                        style={{ width: scaleSize(12), height: scaleSize(29) }}
                    />
                    <Text style={styles.textTableHeader} >
                        {`${index}.`}
                    </Text>
                </View>
                {/* ----- 2 ------ */}
                <View style={{
                    width: scaleSize(200), flexDirection: 'row',
                }} >
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                    <View style={{ justifyContent: 'center', marginLeft: scaleSize(6) }} >
                        {
                            staff.imageUrl ? <FastImage
                                style={{ width: scaleSize(30), height: scaleSize(30) }}
                                source={{
                                    uri: staff.imageUrl,
                                    priority: FastImage.priority.low,
                                    cache:FastImage.cacheControl.immutable
                                }}
                            /> : <Image source={IMAGE.staff_holder} style={{ width: scaleSize(30), height: scaleSize(30) }} />
                        }
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                        <Text style={styles.textTableHeader} numberOfLines={1} >
                            {staff.displayName}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ------ */}
                <View style={{
                    width: scaleSize(110), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                        <Text style={styles.textTableHeader} >
                            {staff.staffId}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSize(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 4 ------ */}
                <View style={{
                    width: scaleSize(110), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
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
                    width: scaleSize(110), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                        <Text style={styles.textTableHeader} >
                            {staff.isDisabled === 0 ? 'Active' : 'Disable'}
                        </Text>
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
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSize(60),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
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

export default RowTable;

