import React from 'react';
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
import { scaleSzie } from '@utils';
import IMAGE from '@resources';
import connectRedux from '@redux/ConnectRedux';

class RowTable extends React.Component {

    constructor(props) {
        super(props);
        const { staff } = this.props
        this.state = {
            isArchive: true,
            isActive: staff.isActive ? staff.isActive : false
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

    toggleIsActive = async (isActive) => {
        const { staff } = this.props;
        if (this.state.isActive !== isActive) {
            await this.setState({
                isActive: isActive
            });
            this.props.toggleStaffActive(staff, isActive);
        }


    }

    render() {
        const { staff, index, archiveStaff, editStaff, restoreStaff, move, moveEnd,
            toggleStaffActive
        } = this.props;
        const { isActive } = this.state;

        return (
            <TouchableOpacity
                onLongPress={move}
                onPressOut={moveEnd}
                style={styles.tableHeader} >
                {/* ----- 1 ------ */}
                <View style={[{
                    width: scaleSzie(50),
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }]} >
                    <Image source={IMAGE.indicate}
                        style={{ width: scaleSzie(12), height: scaleSzie(29) }}
                    />
                    <Text style={styles.textTableHeader} >
                        {`${parseInt(index) + 1}.`}
                    </Text>
                </View>
                {/* ----- 2 ------ */}
                <View style={{
                    width: scaleSzie(200), flexDirection: 'row',
                }} >
                    <View style={{ justifyContent: 'center' }} >
                        {
                            staff.imageUrl ? <FastImage
                                style={{ width: scaleSzie(30), height: scaleSzie(30) }}
                                source={{
                                    uri: staff.imageUrl,
                                    priority: FastImage.priority.low,
                                    cache: FastImage.cacheControl.immutable
                                }}
                            /> : <Image source={IMAGE.staff_holder} style={{ width: scaleSzie(30), height: scaleSzie(30) }} />
                        }
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                        <Text style={styles.textTableHeader}  >
                            {staff.displayName}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 3 ------ */}
                {/* ----- 4 ------ */}
                <View style={{
                    width: scaleSzie(110), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', paddingLeft: scaleSzie(10) }} >
                        <Text style={styles.textTableHeader} >
                            {staff.roleName}
                        </Text>
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
                        <View style={{ flex: 1, backgroundColor: '#E5E5E5' }} />
                    </View>
                </View>
                {/* ----- 5 ----- */}
                <View style={{
                    width: scaleSzie(90), flexDirection: 'row',
                }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }} >

                        <Switch
                            trackColor={{ false: "#767577", true: "#0764B0" }}
                            // thumbColor={toogle ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#E5E5E5"
                            onValueChange={this.toggleIsActive}
                            // value={staff.isActive ? staff.isActive : false}
                            value={isActive}
                        />
                    </View>
                    <View style={{ width: 1, paddingVertical: scaleSzie(3) }} >
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
                            style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                            styleText={{
                                fontSize: scaleSzie(14)
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
                                style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                                styleText={{
                                    fontSize: scaleSzie(14)
                                }}
                            /> :
                                <ButtonCustom
                                    width={'80%'}
                                    height={28}
                                    backgroundColor="#F1F1F1"
                                    title="Restore"
                                    textColor="#6A6A6A"
                                    onPress={() => restoreStaff()}
                                    style={{ borderWidth: 1, borderColor: '#C5C5C5', borderRadius: scaleSzie(2) }}
                                    styleText={{
                                        fontSize: scaleSzie(14)
                                    }}
                                />
                        }

                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    async componentDidUpdate(prevProps, prevState) {
        const { staff, loading } = this.props;

        if (prevProps.loading !== loading && !loading && staff.isActive !== this.state.isActive) {
            await this.setState({
                isActive: staff.isActive
            })
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableHeader: {
        height: scaleSzie(55),
        backgroundColor: '#FAFAFA',
        borderWidth: 0.5,
        borderColor: '#C5C5C5',
        flexDirection: 'row'
    },
    textTableHeader: {
        color: '#6A6A6A',
        fontSize: scaleSzie(14)
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

